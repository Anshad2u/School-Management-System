'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UserProfile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email?: string | null;
  role?: string | null;
};

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Form state for creating/editing profile
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let profileData: UserProfile | null = null;

    // If logged in, try to get/create own profile
    if (user) {
      // Check if viewing own profile (by ID or email)
      const isOwnProfile = user && (user.id === params.id || user.email === params.id);
      
      // Try to get profile by ID first
      const { data: profileById, error: errorById } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email, role')
        .eq('id', isOwnProfile ? user.id : params.id)
        .single();

      if (profileById) {
        profileData = profileById as UserProfile;
      } else if (errorById?.code !== 'PGRST116') {
        // Log unexpected errors (not "row not found")
        console.error('Error fetching profile by ID:', errorById);
      }

      // Try by email if ID didn't work and params looks like email
      if (!profileData && params.id && params.id.includes('@')) {
        const { data: profileByEmail, error: errorByEmail } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, email, role')
          .eq('email', params.id)
          .single();

        if (profileByEmail) {
          profileData = profileByEmail as UserProfile;
        } else if (errorByEmail?.code !== 'PGRST116') {
          console.error('Error fetching profile by email:', errorByEmail);
        }
      }

      // For own profile, auto-create if not found
      if (isOwnProfile && !profileData) {
        const defaultUsername = user.email?.split('@')[0] || 'User';
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: defaultUsername,
            email: user.email,
            role: 'admin'
          })
          .select()
          .single();

        if (created) {
          profileData = created as UserProfile;
        } else {
          setError('Create your profile');
          setIsLoading(false);
          return;
        }
      }
    }

    if (profileData) {
      setProfile(profileData);
      setUsername(profileData.username || '');
      setAvatarUrl(profileData.avatar_url || '');
      setAvatarPreview(profileData.avatar_url || null);
    } else {
      setError('Profile not found.');
    }
    setIsLoading(false);
  }, [params.id, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    // Validate username
    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (username.length > 50) {
      setError('Username must be less than 50 characters.');
      return;
    }

    // Validate avatar URL if provided
    if (avatarUrl && !isValidUrl(avatarUrl)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error: saveError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username.trim(),
          avatar_url: avatarUrl || null,
          email: user.email,
        })
        .select()
        .single();

      if (saveError) throw saveError;
      
      setProfile(data as UserProfile);
      setAvatarPreview(data.avatar_url);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUrlChange = (url: string) => {
    setAvatarUrl(url);
    // Update preview only if valid URL
    if (isValidUrl(url)) {
      setAvatarPreview(url);
    } else if (url === '') {
      setAvatarPreview(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">User Profile</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-primary/10 h-16 w-16 rounded-full"></div>
              <div className="space-y-2">
                <div className="animate-pulse rounded-md bg-primary/10 h-4 w-[150px]"></div>
                <div className="animate-pulse rounded-md bg-primary/10 h-3 w-[200px]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    // Show edit form if it's own profile and needs creation
    const isOwnProfile = user && (user.id === params.id || user.email === params.id);
    if (isOwnProfile && error === 'Create your profile') {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Create Your Profile</h1>
          <p className="text-gray-600">Please create your profile to continue.</p>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500">{username.length}/50 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL (optional)</Label>
                  <Input
                    id="avatar"
                    value={avatarUrl}
                    onChange={(e) => handleAvatarUrlChange(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {avatarPreview && isValidUrl(avatarPreview) && (
                    <div className="mt-2">
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="h-20 w-20 rounded-full object-cover"
                        onError={() => setAvatarPreview(null)}
                      />
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Creating...' : 'Create Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">User Profile</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Profile not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if this is the user's own profile
  const isOwnProfile = user && (user.id === params.id || user.email === params.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">User Profile</h1>
        {isOwnProfile && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500">{username.length}/50 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (optional)</Label>
                <Input
                  id="avatar"
                  value={avatarUrl}
                  onChange={(e) => handleAvatarUrlChange(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                {avatarPreview && isValidUrl(avatarPreview) && (
                  <div className="mt-2">
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="h-20 w-20 rounded-full object-cover"
                      onError={() => setAvatarPreview(null)}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    setUsername(profile.username || '');
                    setAvatarUrl(profile.avatar_url || '');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center space-x-4">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.username || 'User'} 
                  className="h-16 w-16 rounded-full object-cover"
                  onError={(e) => {
                    // Hide broken image, show fallback
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {profile.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{profile.username || 'Anonymous'}</h2>
                <p className="text-gray-600">Gem Stone Salafi School</p>
                {profile.email && <p className="text-sm text-gray-500">{profile.email}</p>}
                {profile.role && <p className="text-xs text-gray-400 capitalize">{profile.role}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}