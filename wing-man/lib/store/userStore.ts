import { create } from 'zustand';

export interface UserProfile {
  name: string;
  interests: string[];
  location: string;
  budget: 'low' | 'medium' | 'high';
  preferences: {
    cuisine: string[];
    activities: string[];
    atmosphere: string[];
  };
}

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updatedProfile) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, ...updatedProfile }
        : null,
    })),
}));
