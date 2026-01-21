import api from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: string;
  name: string;
  profileImage: string
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      fetchUser: async () => {
        try {
          if (get().user) return;

          const { data } = await api.get("/api/profile/me");

          if (data?.success && data?.data) {
            set({ user: data.data });
          } else if (data?.userId && data?.name) {
            set({ user: data });
          } else {
            set({ user: null });
          }

        } catch (error) {
          console.error("Error fetching user:", error);
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
