import { create } from "zustand";
import { AuthState, User } from "../types";
import { authService } from "../services/authServices";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: true,

  setLoading: (loading) => set({ isLoading: loading }),
setUser: (user) => set({ user }),
  // Login function
login: async (email, password) => {
  set({ isLoading: true });
  try {
    const response = await authService.login(email, password);
    const data = response.data;
    const accessToken = data.accessToken || data.token;
    const user = data.user;
    set({
      user,
      token: accessToken,
      isLoggedIn: true,
      isLoading: false,
    });
  } catch (error) {
    set({ isLoading: false });
    throw error;
  }
},

  // Register function
  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      await authService.register(username, email, password);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      set({
        user: null,
        token: null,
        isLoggedIn: false,
      });
    }
  },

  // App start pe check karo login hai ya nahi
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await authService.getToken();
      const user = await authService.getSavedUser();
      if (token && user) {
        set({
          user,
          token,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));