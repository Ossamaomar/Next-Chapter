"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { userSignup } from "@/app/_services/types";
import { signUp } from "@/app/_services/auth";
import { useState } from "react";
import SubmitAuthForm from "@/app/_components/auth/register/SubmitAuthForm";
import { useRouter } from "next/navigation";
import InputField from "../../forms/InputField";
import SelectInputField from "../../forms/SelectInputField";
import GoogleSignInButton from "./GoogleSignInButton";

const FormSchema = z
  .object({
    email: z.string().email("Email must be like name@example.com"),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    rePassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    firstName: z.string().min(2, {
      message: "Your first name is required",
    }),
    lastName: z.string().min(2, {
      message: "Your last name is required",
    }),
    role: z.enum(["Student", "Instructor"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
    gender: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Please select your gender" }),
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function RegisterContainer() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      rePassword: "",
      firstName: "",
      lastName: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const signUpData: userSignup = {
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      gender: data.gender,
      role: data.role,
    };
    setIsLoading(true);
    try {
      await signUp(signUpData);
      toast.success("Check your email to verify your account");
      router.push("/auth/register/checkAccount");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 py-10 px-8 flex items-center justify-center bg-gradient-to-r from-amber-100 to-emerald-100">
      <div className="w-full max-w-[400px] px-4 md:px-8 py-10 rounded-lg space-y-6 border border-gray-400 bg-white">
        <GoogleSignInButton />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <InputField
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="first name"
              type="text"
            />

            <InputField
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="last name"
              type="text"
            />

            <InputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
            />

            <InputField
              control={form.control}
              name="password"
              label="Password"
              placeholder="password"
              type="password"
            />

            <InputField
              control={form.control}
              name="rePassword"
              label="Re-Password"
              placeholder="re-password"
              type="password"
            />

            <SelectInputField
              control={form.control}
              name="gender"
              label="Select your gender"
              placeholder="select your gender"
              values={["Male", "Female"]}
            />

            <SelectInputField
              control={form.control}
              name="role"
              label="Select your role"
              placeholder="select your role"
              values={["Student", "Instructor"]}
            />

            <SubmitAuthForm isLoading={isLoading} type="register" />
          </form>
        </Form>
      </div>
    </div>
  );
}
