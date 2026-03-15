import apiClient from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Course } from "../types";
import { STORAGE_KEYS } from "../constants";

export const courseService = {
  // Courses fetch karo
  getCourses: async (page: number = 1) => {
    const [productsRes, usersRes] = await Promise.all([
      apiClient.get(`/api/v1/public/randomproducts?page=${page}&limit=10`),
      apiClient.get(`/api/v1/public/randomusers?page=1&limit=10`),
    ]);

    const products = productsRes.data.data.data;
    const users = usersRes.data.data.data;

    // Products ko courses ki tarah treat karo
    const courses: Course[] = products.map((product: any, index: number) => ({
      id: product.id?.toString() || index.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
thumbnail: `https://picsum.photos/seed/${product.id}/400/300`,
instructor: (() => {
  const user = users[index % users.length];
  if (!user?.name) return "Unknown Instructor";
  if (typeof user.name === "string") return user.name;
  return `${user.name.first || ""} ${user.name.last || ""}`.trim() || "Unknown Instructor";
})(),      instructorAvatar:
        users[index % users.length]?.picture?.medium || "",
      category: product.category,
      rating: product.rating || 4.5,
      isBookmarked: false,
      isEnrolled: false,
    }));

    return courses;
  },

  // Bookmarks save karo
  saveBookmarks: async (bookmarks: string[]) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.BOOKMARKS,
      JSON.stringify(bookmarks)
    );
  },

  // Bookmarks load karo
  getBookmarks: async (): Promise<string[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  },

  // Enrolled courses save karo
  saveEnrolled: async (enrolled: string[]) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ENROLLED_COURSES,
      JSON.stringify(enrolled)
    );
  },

  // Enrolled courses load karo
  getEnrolled: async (): Promise<string[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ENROLLED_COURSES);
    return data ? JSON.parse(data) : [];
  },
};