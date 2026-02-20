import api from "@/lib/axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  userId: string;
  name: string;
  profileImage: string
  email: string;
  role: string;
  createdProjectsCount?: number;
  contributionsCount?: number;
  recentActivities?: { type: string; title: string; timestamp: string }[];
  subscription?: {
    plan: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
  };
}

interface AuthState {
  user: User | null;
  fetchUser: (force?: boolean) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      fetchUser: async (force = false) => {
        try {
          const { data } = await api.get("/api/users/profile");

          const userData = data?.data || data;

          if (userData && (userData.id || userData.userId || userData.name)) {
            const updatedUser: User = {
              userId: userData.id || userData.userId || get().user?.userId || '',
              name: userData.name || userData.username || get().user?.name || '',
              profileImage: userData.profileImage || get().user?.profileImage || '',
              email: userData.email || get().user?.email || '',
              role: userData.role || get().user?.role || '',
              createdProjectsCount: userData.createdProjectsCount ?? 0,
              contributionsCount: userData.contributionsCount ?? 0,
              recentActivities: userData.recentActivities ?? [],
              // Always take the server subscription value — never fall back to stale cached value
              subscription: userData.subscription ?? undefined
            };

            if (updatedUser.userId && updatedUser.name) {
              set({ user: updatedUser });
            }
          }
        } catch (error: unknown) {
          let isUnauthorized = false;
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 401) {
              isUnauthorized = true;
            } else {
              console.error("Error fetching user:", error);
            }
          } else {
            console.error("Error fetching user:", error);
          }

          if (isUnauthorized) {
            set({ user: null });
          }
        }
      },

      logout: () => {
        set({ user: null });
        // Purge persisted storage completely so no stale data bleeds into the next session
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      }
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUser = () => useAuthStore((s) => s.user);

