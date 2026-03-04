import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  user: {
    id: number;
    email: string;
    name: string;
    profileImageUrl: string;
  } | null;
  hasCompletedPreference: boolean;
  isLoggedIn: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: AuthState['user']) => void;
  setHasCompletedPreference: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasCompletedPreference: false,
      isLoggedIn: false,

      setAccessToken: (token) => set({ accessToken: token, isLoggedIn: true }),
      setUser: (user) => set({ user }),
      setHasCompletedPreference: (v) => set({ hasCompletedPreference: v }),
      logout: () =>
        set({
          accessToken: null,
          user: null,
          hasCompletedPreference: false,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'dahang-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        hasCompletedPreference: state.hasCompletedPreference,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
