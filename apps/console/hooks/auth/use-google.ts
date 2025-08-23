import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

type GoogleAuthStore = {
  refreshToken: string | null;
  expiryDate: string | null;
}

interface AuthStore {
  store: GoogleAuthStore;
  setToken: (refreshToken: string | null, expiryDate: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      store: {
        refreshToken: null as string | null,
        expiryDate: null as string | null,
      },
      setToken: (refreshToken: string | null, expiryDate: string | null) => {
        set({ store: { refreshToken, expiryDate } });
        if (refreshToken && expiryDate) {
          Cookies.set('google_token', refreshToken, { path: "/", expires: Number(expiryDate) });
        } else {
          Cookies.remove('google_token');
        }
      },
    }),
    {
      name: 'google-auth-storage',
      partialize: (state) => ({
        store: state.store,
      }),
    }
  )
);

export const useGoogleStore = () => {
  const {
    store,
    setToken,
  } = useAuthStore();
  return {
    store,
    setToken,
  };
};
