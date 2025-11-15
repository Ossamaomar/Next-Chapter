import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getCourseById } from "./app/_services/courses";
import { CourseResponse } from "./app/_services/types";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = request.cookies.get("token")?.value;
  const role = cookieStore.get("role")?.value;
  const id = cookieStore.get("userId")?.value;
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = [
    "/profile",
    "/cart",
    "/wishlist",
    "/addCourse",
    "/checkout",
    "/learn",
    "/myLearning",
    "/courseDetails",
    "/account"
  ];
  const studentRoutes = ["/cart", "/wishlist", "/learn", "myLearning"];
  const authRoutes = ["/auth/login", "/auth/register"];
  const instructorRoutes = ["/addCourse", "/courseDetails", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isInstructorRoute = instructorRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isStudentRoute = studentRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isStudentRoute && role !== "Student") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isInstructorRoute && role !== "Instructor") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/courseDetails/")) {
    const course: CourseResponse = await getCourseById(pathname.split("/")[2]);
    if (course.instructor_id !== id) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/categories/:path*",
    "/checkout/:path*",
    "/learn/:path",
    "/myLearning",
    "/courses",
    "/course/:path*",
    "/cart",
    "/wishlist",
    "/courseDetails/:path*",
    "/auth/login",
    "/auth/register",
    "/account"
  ],
};
