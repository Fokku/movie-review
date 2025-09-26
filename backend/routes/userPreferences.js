const express = require('express');
const router = express.Router();
const pool = require('../server').pool; // reuse existing MySQL pool

// Get user preferences
router.get('/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Get main preferences
    const [prefs] = await pool.execute('SELECT * FROM user_preferences WHERE id = ?', [userId]);

    // Get preferred genres
    const [genres] = await pool.execute(
        `SELECT mg.genre_id, mg.genre_name 
         FROM user_preferred_genres upg 
         JOIN movie_genres mg ON upg.genre_id = mg.genre_id 
         WHERE upg.id = ?`,
        [userId]
    );

    res.json({ preferences: prefs[0] || {}, genres });
}));

// Update user preferences
router.put('/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { duration_min, duration_max, era_start, era_end, min_rating, preferred_languages, other } = req.body;

    await pool.execute(
        `UPDATE user_preferences
         SET duration_min = ?, duration_max = ?, era_start = ?, era_end = ?, min_rating = ?, preferred_languages = ?, other = ?
         WHERE id = ?`,
        [duration_min, duration_max, era_start, era_end, min_rating, JSON.stringify(preferred_languages), JSON.stringify(other), userId]
    );

    res.json({ message: 'Preferences updated successfully' });
}));

// Add preferred genre
router.post('/:userId/genres', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { genre_id } = req.body;

    await pool.execute(
        'INSERT INTO user_preferred_genres (id, genre_id) VALUES (?, ?)',
        [userId, genre_id]
    );

    res.json({ message: 'Genre added successfully' });
}));

// Remove preferred genre
router.delete('/:userId/genres/:genreId', asyncHandler(async (req, res) => {
    const { userId, genreId } = req.params;

    await pool.execute(
        'DELETE FROM user_preferred_genres WHERE id = ? AND id = ?',
        [userId, genreId]
    );

    res.json({ message: 'Genre removed successfully' });
}));

module.exports = router;
