export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: {
    url: string;
    localPath: string;
  };
  role: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  rating: number;
  isBookmarked: boolean;
  isEnrolled: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface CourseState {
  courses: Course[];
  bookmarks: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}