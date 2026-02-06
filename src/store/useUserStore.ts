import api from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: string;
  name: string;
  profileImage: string
  email: string;
  role: string;
  createdProjectsCount?: number;
  contributionsCount?: number;
  recentActivities?: { type: string; title: string; timestamp: string }[];
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
          if (!force && get().user) return;

          const { data } = await api.get("/api/users/profile");

          const userData = data?.data || data;

          if (userData && (userData.id || userData.userId || userData.name)) {
            const updatedUser = {
              userId: userData.id || userData.userId || get().user?.userId,
              name: userData.name || userData.username || get().user?.name,
              profileImage: userData.profileImage || get().user?.profileImage,
              email: userData.email || get().user?.email,
              role: userData.role || get().user?.role,
              createdProjectsCount: userData.createdProjectsCount ?? get().user?.createdProjectsCount ?? 0,
              contributionsCount: userData.contributionsCount ?? get().user?.contributionsCount ?? 0,
              recentActivities: userData.recentActivities ?? get().user?.recentActivities ?? []
            };

            if (updatedUser.userId && updatedUser.name) {
              set({ user: updatedUser as User });
            }
          }
        } catch (error: unknown) {
          // Silently handle 401 errors (user not authenticated) - this is expected on landing page
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status !== 401) {
              console.error("Error fetching user:", error);
            }
          } else {
            console.error("Error fetching user:", error);
          }
          set({ user: null });
        }
      },

      logout: () => {
        set({ user: null });
      }
    }),

    { name: "auth-storage" }
  )
);

export const useUser = () => useAuthStore((s) => s.user);
