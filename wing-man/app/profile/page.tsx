'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileData {
  age: number | null;
  location: string;
  gender: string;
  interests: string;
  datingGoals: string;
  datingStyle: string;
  budget: string;
  outdoor: boolean;
  social: boolean;
  dietaryRestrictions: string;
  additionalNotes: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    age: null,
    location: '',
    gender: '',
    interests: '',
    datingGoals: '',
    datingStyle: '',
    budget: 'medium',
    outdoor: false,
    social: false,
    dietaryRestrictions: '',
    additionalNotes: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (response.ok && data.profile) {
          setProfile({
            age: data.profile.age,
            location: data.profile.location || '',
            gender: data.profile.gender || '',
            interests: data.profile.interests || '',
            datingGoals: data.profile.datingGoals || '',
            datingStyle: data.profile.datingStyle || '',
            budget: data.profile.budget || 'medium',
            outdoor: data.profile.outdoor || false,
            social: data.profile.social || false,
            dietaryRestrictions: data.profile.dietaryRestrictions || '',
            additionalNotes: data.profile.additionalNotes || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save profile');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e2c0d7] to-white flex items-center justify-center">
        <p className="text-xl font-mono">Loading...</p>
      </div>
    );
  }

  // If not logged in, don't render (redirect handled in useEffect)
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e2c0d7] to-white px-8 py-16">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black hover:underline font-mono font-bold uppercase text-sm"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Logo/Title */}
        <h1 className="text-6xl md:text-7xl font-black text-center mb-12 text-black tracking-tighter">
          WINGMAN
        </h1>

        {/* Account Info Card */}
        <div className="bg-white border-4 border-black p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  className="w-16 h-16 rounded-full border-4 border-black"
                />
              )}
              <div>
                <p className="font-bold text-lg">{session.user?.name}</p>
                <p className="text-sm text-gray-600">{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-white text-black border-4 border-black hover:bg-black hover:text-white transition-colors font-mono font-bold uppercase text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8 space-y-6">
          <div className="flex items-center justify-between mb-6">
            {saved && (
              <span className="text-sm font-mono text-green-600">✓ Saved!</span>
            )}
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-bold font-mono uppercase text-sm border-b-2 border-black pb-2">Personal Info</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono uppercase mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 border-4 border-black font-mono"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase mb-2">Gender</label>
                <input
                  type="text"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-4 py-2 border-4 border-black font-mono"
                  placeholder="Male/Female/Other"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase mb-2">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2 border-4 border-black font-mono"
                placeholder="Toronto, ON"
              />
            </div>
          </div>

          {/* Dating Preferences */}
          <div className="space-y-4">
            <h3 className="font-bold font-mono uppercase text-sm border-b-2 border-black pb-2">Dating Preferences</h3>

            <div>
              <label className="block text-sm font-mono uppercase mb-2">Interests & Hobbies</label>
              <input
                type="text"
                value={profile.interests}
                onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                className="w-full px-4 py-2 border-4 border-black font-mono"
                placeholder="hiking, movies, cooking, gaming..."
              />
            </div>

            <div>
              <label className="block text-sm font-mono uppercase mb-2">Dating Goals</label>
              <input
                type="text"
                value={profile.datingGoals}
                onChange={(e) => setProfile({ ...profile, datingGoals: e.target.value })}
                className="w-full px-4 py-2 border-4 border-black font-mono"
                placeholder="looking for a serious relationship, casual dating..."
              />
            </div>

            <div>
              <label className="block text-sm font-mono uppercase mb-2">Dating Style</label>
              <input
                type="text"
                value={profile.datingStyle}
                onChange={(e) => setProfile({ ...profile, datingStyle: e.target.value })}
                className="w-full px-4 py-2 border-4 border-black font-mono"
                placeholder="adventurous, laid-back, romantic..."
              />
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-4">
            <h3 className="font-bold font-mono uppercase text-sm border-b-2 border-black pb-2">Logistics</h3>

            <div>
              <label className="block text-sm font-mono uppercase mb-2">Budget for Dates</label>
              <select
                value={profile.budget}
                onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
                className="w-full px-4 py-2 border-4 border-black font-mono"
              >
                <option value="low">Low ($)</option>
                <option value="medium">Medium ($$)</option>
                <option value="high">High ($$$)</option>
                <option value="no preference">No preference</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.outdoor}
                  onChange={(e) => setProfile({ ...profile, outdoor: e.target.checked })}
                  className="w-5 h-5 border-4 border-black"
                />
                <span className="font-mono text-sm">Prefer outdoor activities</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.social}
                  onChange={(e) => setProfile({ ...profile, social: e.target.checked })}
                  className="w-5 h-5 border-4 border-black"
                />
                <span className="font-mono text-sm">Prefer social settings</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase mb-2">Dietary Restrictions</label>
              <input
                type="text"
                value={profile.dietaryRestrictions}
                onChange={(e) => setProfile({ ...profile, dietaryRestrictions: e.target.value })}
                className="w-full px-4 py-2 border-4 border-black font-mono"
                placeholder="vegetarian, vegan, gluten-free, halal..."
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="font-bold font-mono uppercase text-sm border-b-2 border-black pb-2">Additional Context</h3>

            <div>
              <label className="block text-sm font-mono uppercase mb-2">Additional Notes</label>
              <textarea
                value={profile.additionalNotes}
                onChange={(e) => setProfile({ ...profile, additionalNotes: e.target.value })}
                className="w-full px-4 py-2 border-4 border-black font-mono h-32 resize-none"
                placeholder="Anything else you'd like WingMan to know..."
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-colors font-mono font-bold uppercase disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
