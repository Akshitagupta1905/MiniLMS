import apiClient from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../constants";

export const authService = {
  // Register
register: async (username: string, email: string, password: string) => {
  try {
    const response = await apiClient.post("/api/v1/users/register", {
      username,
      email,
      password,
    });
    console.log("Register response:", JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.log("Register error:", JSON.stringify(error.response?.data));
    throw error;
  }
},

  // Login
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/api/v1/users/login", {
      email,
      password,
    });

    const { accessToken, user } = response.data.data;

    // Token securely save karo
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, accessToken);

    // User data AsyncStorage mein save karo
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(user)
    );
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);

    return response.data;
  },

  // Logout
  logout: async () => {
    await apiClient.post("/api/v1/users/logout");
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Check karo token hai ya nahi
  getToken: async () => {
    return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Saved user data lao
  getSavedUser: async () => {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },
};