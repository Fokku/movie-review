import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/navbar';
import { User, Mail, Calendar, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AVAILABLE_GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 
  'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
];

export default function Profile() {
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newGenre, setNewGenre] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated."
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      avatar: user.avatar || '',
    });
    setIsEditing(false);
  };

  const handleAddGenre = () => {
    if (newGenre && !user.favoriteGenres?.includes(newGenre)) {
      const updatedGenres = [...(user.favoriteGenres || []), newGenre];
      updateProfile({ favoriteGenres: updatedGenres });
      setNewGenre('');
      toast({
        title: "Genre added!",
        description: `${newGenre} has been added to your favorite genres.`
      });
    }
  };

  const handleRemoveGenre = (genre: string) => {
    const updatedGenres = user.favoriteGenres?.filter(g => g !== genre) || [];
    updateProfile({ favoriteGenres: updatedGenres });
    toast({
      title: "Genre removed!",
      description: `${genre} has been removed from your favorite genres.`
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.avatar} alt={user.name} />
                      <AvatarFallback className="text-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="flex-1">
                        <label className="text-sm font-medium">Avatar URL</label>
                        <Input
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleInputChange}
                          placeholder="https://example.com/avatar.jpg"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{user.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{user.email}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    {isEditing ? (
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself and your movie preferences..."
                        className="mt-1"
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{user.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member since</p>
                      <p className="font-medium">
                        {new Date(user.joinedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Reviews written</p>
                      <p className="font-medium">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Genres */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Favorite Genres</CardTitle>
                  <CardDescription>Your preferred movie genres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Genres */}
                  <div className="flex flex-wrap gap-2">
                    {user.favoriteGenres?.map((genre) => (
                      <Badge 
                        key={genre} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        {genre}
                        <Button
                          onClick={() => handleRemoveGenre(genre)}
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )) || <p className="text-sm text-muted-foreground">No genres selected</p>}
                  </div>

                  <Separator />

                  {/* Add New Genre */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add Genre</label>
                    <div className="flex gap-2">
                      <select
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background"
                      >
                        <option value="">Select a genre</option>
                        {AVAILABLE_GENRES.filter(genre => !user.favoriteGenres?.includes(genre)).map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                      <Button 
                        onClick={handleAddGenre}
                        disabled={!newGenre}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logout */}
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
