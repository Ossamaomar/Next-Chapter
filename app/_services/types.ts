import { Session, User as UserSB, WeakPassword } from "@supabase/supabase-js";

export type userSignup = {
  email: string;
  password: string;
  name: string;
  gender: string;
  role: string;
};

export type InstructorInfo = {
  id: string;
  name: string;
  title: string;
  description: string;
  personalPictureUrl: string;
  links: string[];
};

export type userSignin = {
  email: string;
  password: string;
};

export type AuthState = {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: "Student" | "Instructor" | "";
  } | null;

  // isLoading: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: "Student" | "Instructor" | "";

  // isLoading: boolean;
};

export type LoginSession = {
  user: UserSB;
  session: Session;
  weakPassword?: WeakPassword;
};

export type Course = {
  title: string;
  description: string;
  price: number;
  thumbnail_url: string;
  category: string;
};

export type CourseEditType = {
  title: string;
  description: string;
  price: number;
  thumbnail_url: string;
};

export type CourseResponse = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail_url: string;
  created_at: string;
  instructor_id: string;
  instructor_name: string;
  category: string;
  duration: number;
  numberOfLectures: number;
  avgRating: number;
  numberOfRatings: number;
};

export type EditType = "title" | "description" | "price" | "thumbnail" | "none";

export type CourseMetaState = {
  isEditing: boolean;
  editType: EditType;
  // currentFile: File;
  currentState: {
    title: string;
    description: string;
    price: number;
    thumbnail_url: string;
  };
  lastFetched: {
    title: string;
    description: string;
    price: number;
    thumbnail_url: string;
  };
};

export type CourseSection = {
  id: string;
  created_at?: string;
  name: string;
  course_id: string;
  order_index: number;
  instructor_id: string;
};

export type CourseSectionInputs = {
  name: string;
  course_id: string;
  order_index: number;
  instructor_id: string;
};

export type CourseLecture = {
  id: string;
  course_id: string;
  section_id: string;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
  order_index: number;
  section_index: number;
  duration: number;
};

export type CourseLectureInput = {
  course_id: string;
  section_id: string;
  title: string;
  description: string | undefined;
  video: string;
  order_index?: number;
  section_index?: number;
  duration: number;
};

export type CourseLectureEditInput = {
  id: string;
  title?: string;
  video?: File;
  description?: string | undefined;
};

export type CartItem = {
  id: string;
  createdAt: string;
  studentId: string;
  cartId: string;
  courseId: string;
  course: CourseResponse;
};

export type CartState = {
  id: string;
  createdAt: string;
  studentId: string;
  userHasCart: boolean;
  cartItems: CartItem[];
  previousCartItems?: CartItem[];
};

export type Cart = {
  id: string;
  createdAt: string;
  studentId: string;
};

export type Enrollment = {
  id: string;
  enrolledAt: string;
  studentId: string;
  courseId: string;
  instructorId: string;
  progress: number;
  instructorName: string;
  courseTitle: string;
  courseThumbnail: string;
};

export type EnrollmentsState = {
  enrollments: Enrollment[];
  loading: boolean;
  learningMode: boolean;
  lecturesProgress: LectureProgress[];
  currentWatchedLecture: CourseLecture;
};

export type LectureProgress = {
  id: string;
  courseId: string;
  enrollmentId: string;
  lectureId: string;
  isCompleted: boolean;
  completedAt: string | null;
  orderIndex: number;
  sectionIndex: number;
  duration: number;
};

export type Rating = {
  id: string;
  enrollmentId: string;
  instructorId: string;
  courseId: string;
  rating: number;
  feedback: string;
};

export type Wishlist = {
  id: string;
  createdAt: string;
  studentId: string;
};

export type WishlistItem = {
  id: string;
  createdAt: string;
  studentId: string;
  wishlistId: string;
  courseId: string;
  course: CourseResponse;
};

export type WishlistState = {
  id: string;
  createdAt: string;
  studentId: string;
  userHasWishlist: boolean;
  wishlistItems: WishlistItem[];
  previousWishlistItems?: WishlistItem[];
};

export type Category = {
  id: string;
  name: string;
}
