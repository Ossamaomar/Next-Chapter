"use client";

import { getUserData } from "@/store/authSlice";
import { useSelector } from "react-redux";
import StudentProfile from "./StudentProfile";
import InstructorProfile from "./InstructorProfile";



export default function MainProfileTemp() {
  const user = useSelector(getUserData);

  if(!user.id) return
  return (
    <div>
      {user.role === "Student" ? <StudentProfile /> : <InstructorProfile id={user.id} />}
    </div>
  );
}



