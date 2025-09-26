// First install required packages:
// npm install resend bcryptjs mysql2 express dotenv cors

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const cors = require('cors');
require('dotenv').config();
const userPreferencesRouter = require('./routes/userPreferences');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
}));
app.use('/api/user-preferences', userPreferencesRouter);

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// OTP Service Class
class OTPService {
    // Generate 6-digit OTP
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP via email
    static async sendOTP(email, otpType = 'verification') {
        try {
            const otp = this.generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Delete any existing unused OTPs for this email and type
            await pool.execute(
                'DELETE FROM user_otps WHERE email = ? AND otp_type = ? AND is_used = FALSE',
                [email, otpType]
            );

            // Store OTP in database
            await pool.execute(
                'INSERT INTO user_otps (email, otp_code, otp_type, expires_at) VALUES (?, ?, ?, ?)',
                [email, otp, otpType, expiresAt]
            );

            // Send email
            const emailContent = this.getEmailContent(otp, otpType);
            
            await resend.emails.send({
                from: process.env.FROM_EMAIL || 'CineReview <noreply@cinereview.com>',
                to: email,
                subject: emailContent.subject,
                html: emailContent.html
            });

            return { success: true, message: 'OTP sent successfully' };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }

    // Verify OTP
    static async verifyOTP(email, otpCode, otpType = 'verification') {
        try {
            // Find valid OTP
            const [rows] = await pool.execute(
                `SELECT * FROM user_otps 
                 WHERE email = ? AND otp_code = ? AND otp_type = ? 
                 AND is_used = FALSE AND expires_at > NOW()`,
                [email, otpCode, otpType]
            );

            if (rows.length === 0) {
                // Increment attempts for failed verification
                await pool.execute(
                    'UPDATE user_otps SET attempts = attempts + 1 WHERE email = ? AND otp_type = ?',
                    [email, otpType]
                );
                return { success: false, message: 'Invalid or expired OTP' };
            }

            // Mark OTP as used
            await pool.execute(
                'UPDATE user_otps SET is_used = TRUE WHERE id = ?',
                [rows[0].id]
            );

            return { success: true, message: 'OTP verified successfully' };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return { success: false, message: 'Failed to verify OTP' };
        }
    }

    // Get email content based on OTP type
    static getEmailContent(otp, otpType) {
        const templates = {
            verification: {
                subject: 'Verify Your CineReview Account',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0;">🎬 CineReview</h1>
                        </div>
                        <div style="padding: 30px; background-color: #f8f9fa;">
                            <h2 style="color: #333;">Verify Your Email Address</h2>
                            <p style="color: #666; line-height: 1.6;">
                                Welcome to CineReview! Please use the verification code below to complete your account setup:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="background-color: #667eea; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 3px;">
                                    ${otp}
                                </span>
                            </div>
                            <p style="color: #666; line-height: 1.6;">
                                This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
                            </p>
                            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                                This is an automated message from CineReview. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                `
            },
            reset_password: {
                subject: 'Reset Your CineReview Password',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0;">🎬 CineReview</h1>
                        </div>
                        <div style="padding: 30px; background-color: #f8f9fa;">
                            <h2 style="color: #333;">Reset Your Password</h2>
                            <p style="color: #666; line-height: 1.6;">
                                You requested to reset your password. Use the code below to proceed:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="background-color: #e74c3c; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 3px;">
                                    ${otp}
                                </span>
                            </div>
                            <p style="color: #666; line-height: 1.6;">
                                This code will expire in 10 minutes. If you didn't request this reset, please secure your account immediately.
                            </p>
                        </div>
                    </div>
                `
            },
            login: {
                subject: 'Your CineReview Login Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0;">🎬 CineReview</h1>
                        </div>
                        <div style="padding: 30px; background-color: #f8f9fa;">
                            <h2 style="color: #333;">Login Verification Code</h2>
                            <p style="color: #666; line-height: 1.6;">
                                Use this code to complete your login to CineReview:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="background-color: #27ae60; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 3px;">
                                    ${otp}
                                </span>
                            </div>
                            <p style="color: #666; line-height: 1.6;">
                                This code will expire in 10 minutes.
                            </p>
                        </div>
                    </div>
                `
            }
        };

        return templates[otpType] || templates.verification;
    }
}

// API Routes

// 1. Send OTP for email verification
app.post('/api/auth/send-verification-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const result = await OTPService.sendOTP(email, 'verification');
        
        if (result.success) {
            res.json({ message: 'Verification OTP sent to your email' });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Verify OTP and complete registration
app.post('/api/auth/verify-email', async (req, res) => {
    try {
        const { email, otp, name, password } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Verify OTP
        const otpResult = await OTPService.verifyOTP(email, otp, 'verification');
        
        if (!otpResult.success) {
            return res.status(400).json({ error: otpResult.message });
        }

        // If registering, create user account
        if (name && password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            
            try {
                await pool.execute(
                    'INSERT INTO users (name, email, password, email_verified) VALUES (?, ?, ?, TRUE)',
                    [name, email, hashedPassword]
                );
            } catch (dbError) {
                if (dbError.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already registered' });
                }
                throw dbError;
            }
        } else {
            // Just mark email as verified
            await pool.execute(
                'UPDATE users SET email_verified = TRUE WHERE email = ?',
                [email]
            );
        }

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Send OTP for password reset
app.post('/api/auth/send-reset-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if user exists
        const [users] = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await OTPService.sendOTP(email, 'reset_password');
        
        if (result.success) {
            res.json({ message: 'Password reset OTP sent to your email' });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        console.error('Send reset OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Reset password with OTP
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Email, OTP, and new password are required' });
        }

        // Verify OTP
        const otpResult = await OTPService.verifyOTP(email, otp, 'reset_password');
        
        if (!otpResult.success) {
            return res.status(400).json({ error: otpResult.message });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await pool.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. Login with OTP
app.post('/api/auth/login-with-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Verify OTP
        const otpResult = await OTPService.verifyOTP(email, otp, 'login');
        
        if (!otpResult.success) {
            return res.status(400).json({ error: otpResult.message });
        }

        // Get user details
        const [users] = await pool.execute(
            'SELECT id, name, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];
        
        // Here you would typically generate and return a JWT token
        // For now, just return user info
        res.json({ 
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Login with OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, OTPService };