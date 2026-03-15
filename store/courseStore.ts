import { create } from "zustand";
import { Course, CourseState } from "../types";
import { courseService } from "../services/courseService";
import { notificationService } from "../services/notificationService";

interface CourseStore extends CourseState {
  fetchCourses: () => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  toggleEnroll: (courseId: string) => void;
  setSearchQuery: (query: string) => void;
  loadBookmarks: () => Promise<void>;
  getFilteredCourses: () => Course[];
  enrolledCourses: string[];
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  bookmarks: [],
  enrolledCourses: [],
  isLoading: false,
  error: null,
  searchQuery: "",

  // Courses fetch karo API se
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const courses = await courseService.getCourses();
      const bookmarks = await courseService.getBookmarks();
      const enrolled = await courseService.getEnrolled();

      const updatedCourses = courses.map((course) => ({
        ...course,
        isBookmarked: bookmarks.includes(course.id),
        isEnrolled: enrolled.includes(course.id),
      }));

      set({
        courses: updatedCourses,
        bookmarks,
        enrolledCourses: enrolled,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Courses load nahi hue",
        isLoading: false,
      });
    }
  },

  // Bookmark toggle karo
  toggleBookmark: async (courseId) => {
    const { bookmarks, courses } = get();
    let newBookmarks: string[];

    if (bookmarks.includes(courseId)) {
      newBookmarks = bookmarks.filter((id) => id !== courseId);
    } else {
      newBookmarks = [...bookmarks, courseId];
    }

    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? { ...course, isBookmarked: !course.isBookmarked }
        : course
    );

    set({ bookmarks: newBookmarks, courses: updatedCourses });
    await courseService.saveBookmarks(newBookmarks);

    // 5 bookmarks pe notification
    if (newBookmarks.length === 5) {
      await notificationService.showBookmarkNotification();
    }
  },

  // Enroll toggle karo
  toggleEnroll: async (courseId) => {
    const { enrolledCourses, courses } = get();
    let newEnrolled: string[];

    if (enrolledCourses.includes(courseId)) {
      newEnrolled = enrolledCourses.filter((id) => id !== courseId);
    } else {
      newEnrolled = [...enrolledCourses, courseId];
    }

    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? { ...course, isEnrolled: !course.isEnrolled }
        : course
    );

    set({ enrolledCourses: newEnrolled, courses: updatedCourses });
    await courseService.saveEnrolled(newEnrolled);
  },

  // Search query set karo
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Bookmarks load karo
  loadBookmarks: async () => {
    const bookmarks = await courseService.getBookmarks();
    set({ bookmarks });
  },

  // Filter karo search se
  getFilteredCourses: () => {
    const { courses, searchQuery } = get();
    if (!searchQuery) return courses;
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },
}));