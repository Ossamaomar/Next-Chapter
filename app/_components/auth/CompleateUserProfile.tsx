"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  createInstructorUser,
  createStudentUser,
  getInstructorInfo,
  getUserSession,
  setAuthCookies,
} from "@/app/_services/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../forms/InputField";
import SelectInputField from "../forms/SelectInputField";
import PictureInput from "../forms/PictureInput";
import TextInput from "../forms/TextInput";
import SocailLinksInput from "../forms/SocailLinksInput";
import ImageCropper from "../forms/ImageCropper";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import { StudentProfile, InstructorProfile, User } from "@/app/_services/types";
import { Session } from "@supabase/supabase-js";
import { checkUserHasCart } from "@/app/_services/cart";
import { checkUserHasWishlist } from "@/app/_services/wishlist";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { getEnrolledCourses } from "@/app/_services/enrollments";
import { setEnrollments } from "@/store/enrollmentsSlice";
import { createCartSlice } from "@/store/cartSlice";
import { createWishlistSlice } from "@/store/wishlistSlice";

const FormSchema = z
  .object({
    email: z.string().email("Email must be like name@example.com"),
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
    // Instructor-specific fields
    personalPicture: z.instanceof(File).optional(),
    personalPictureUrl: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    links: z
      .array(
        z.object({
          url: z
            .string()
            .url({ message: "Please enter a valid URL" })
            .or(z.literal("")),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Instructor") {
      // Personal picture
      if (!data.personalPictureUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Personal picture is required for instructors",
          path: ["personalPicture"],
        });
      }

      // Title
      if (!data.title || data.title.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Title must be at least 2 characters",
          path: ["title"],
        });
      }

      // Description
      if (!data.description || data.description.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Description must be at least 10 characters",
          path: ["description"],
        });
      }
    }
  });

export default function CompleteUserProfile() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      personalPictureUrl: "",
      title: "",
      description: "",
      links: [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [session, setSession] = useState<Session>();
  const router = useRouter();
  const dispatch = useDispatch();

  // Watch the role field to show/hide instructor fields
  const selectedRole = form.watch("role");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      let user: User = undefined;

      if (data.role === "Student") {
        const userInputs: StudentProfile = {
          id: session.user.id,
          email: session.user.email,
          gender: data.gender,
          name: `${data.firstName} ${data.lastName}`,
          role: data.role,
        };

        user = await createStudentUser(userInputs);
      }

      if (data.role === "Instructor") {
        const filteredLinks =
          data.links
            ?.filter((link) => link.url.trim() !== "")
            .map((link) => link.url) || [];

        const userInputs: InstructorProfile = {
          id: session.user.id,
          email: session.user.email,
          gender: data.gender,
          name: `${data.firstName} ${data.lastName}`,
          role: data.role,
          description: data.description,
          title: data.title,
          personalPictureUrl: data.personalPictureUrl,
          links: filteredLinks,
        };

        user = await createInstructorUser(userInputs);
      }

      const userCart = await checkUserHasCart(user.id, user.role);
      const userWishlist = await checkUserHasWishlist(user.id, user.role);
      await setAuthCookies(session, user);
      dispatch(
        loginUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          personalPictureUrl: user.personalPictureUrl,
        })
      );

      if (user.role === "Student") {
        const enrollments = await getEnrolledCourses(user.id);
        dispatch(setEnrollments(enrollments));
      }

      if (user.role === "Student" && userCart.hasCart) {
        dispatch(
          createCartSlice({
            id: userCart.cart.id,
            studentId: userCart.cart.studentId,
            createdAt: userCart.cart.createdAt,
            userHasCart: true,
            cartItems: userCart.cartItems,
          })
        );
      }

      if (user.role === "Student" && userWishlist.hasWishlist) {
        dispatch(
          createWishlistSlice({
            id: userWishlist.wishlist.id,
            studentId: userWishlist.wishlist.studentId,
            createdAt: userWishlist.wishlist.createdAt,
            userHasWishlist: true,
            wishlistItems: userWishlist.wishlistItems,
          })
        );
      }

      if (user.role === "Instructor") {
        const instructorInfo = await getInstructorInfo(user.id);

        if (instructorInfo === null) {
          toast.info("Please complete your profile");
          router.push("/auth/register/completeProfile");
          return;
        }
      }

      toast.success("Profile completed successfully!");
      router.push("/");
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    form.setValue("personalPicture", file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);

    const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
      type: "image/jpeg",
    });

    await handlePictureUpload(croppedFile);
  };

  async function handlePictureUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "personal_pictures");

    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsed4bxit/image/upload",
        formData,
        {
          onUploadProgress: (event) => {
            if (event.lengthComputable && event.total) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          },
        }
      );

      const pictureUrl = res.data.secure_url;
      form.setValue("personalPictureUrl", pictureUrl);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  useEffect(() => {
    async function fetchSession() {
      try {
        const data = await getUserSession();

        if (data.session?.user?.email) {
          setSession(data.session);
          form.setValue("email", data.session.user.email);
          const fullName = data.session.user.user_metadata.full_name;
          if (fullName) {
            const [firstName, ...lastNameParts] = fullName.split(" ");
            form.setValue("firstName", firstName);
            form.setValue("lastName", lastNameParts.join(" ") || "");
          }
        }
      } catch {
        toast.error("An error occurred please sign in again");
        router.push("/");
      }
    }
    fetchSession();
  }, [form, router]);

  return (
    <>
      {showCropper && imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
          aspect="1:1"
        />
      )}

      <div className="flex-1 py-10 flex items-center justify-center bg-gradient-to-r from-amber-100 to-emerald-100">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[600px] rounded-lg space-y-4 py-20 border px-8 border-gray-400 bg-white"
          >
            <InputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
              disabled={true}
            />

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

            {/* Conditional Instructor Fields */}
            {selectedRole === "Instructor" && (
              <>
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Instructor Information
                  </h3>

                  <div className="space-y-6">
                    <PictureInput
                      control={form.control}
                      handlePictureUpload={handleFileSelect}
                      name="personalPicture"
                      label="Personal Picture"
                    />

                    {uploadProgress > 0 && <Progress value={uploadProgress} />}

                    <InputField
                      control={form.control}
                      name="title"
                      label="Title"
                      placeholder="eg. Software Developer"
                      type="text"
                    />

                    <TextInput
                      control={form.control}
                      name="description"
                      label="Description"
                      placeholder="Tell us about yourself"
                    />

                    <SocailLinksInput
                      control={form.control}
                      fields={fields}
                      append={append}
                      remove={remove}
                    />
                  </div>
                </div>
              </>
            )}

            <Button
              disabled={uploading || isLoading}
              type="submit"
              className="w-fit"
            >
              {isLoading ? <BeatLoader size={20} /> : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
