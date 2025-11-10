"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCourse } from "@/app/_services/courses";
import { useSelector } from "react-redux";
import { getUserData } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Course } from "@/app/_services/types";
import InputField from "../forms/InputField";
import SelectInputField from "../forms/SelectInputField";
import PictureInput from "../forms/PictureInput";
import axios from "axios";
import ImageCropper from "../forms/ImageCropper";
import { Progress } from "@/components/ui/progress";
import { categories } from "@/app/_lib/helpers";
import TextInput from "../forms/TextInput";


const FormSchema = z.object({
  title: z
    .string({
      required_error: "Must include the course title",
    })
    .min(5, {
      message: "Enter a valid title",
    }),
  description: z
    .string({
      required_error: "Must include the course description",
    })
    .min(5, {
      message: "Enter a valid description",
    }),
  price: z
    .number({
      required_error: "Must include the course price",
    })
    .gte(0, {
      message: "Enter a valid price",
    }),
  category: z.enum(
    [
      "Development",
      "IT & Software",
      "Business",
      "Finance & Accounting",
      "Personal Development",
      "Design",
      "Marketing",
      "Health & Fitness",
    ],
    {
      errorMap: () => ({ message: "Please select a valid category" }),
    }
  ),
  coursePicture: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File cannot be empty" }),
  coursePictureUrl: z.string(),
});

export default function AddCourseForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      coursePicture: undefined,
      coursePictureUrl: "",
      price: undefined,
      //courseImage: "",
    },
  });
  const userData = useSelector(getUserData);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const inputs: Course = {
      title: data.title,
      category: data.category,
      description: data.description,
      price: data.price,
      thumbnail_url: data.coursePictureUrl
    }
    try {
      setIsLoading(true);
      const res = await createCourse(inputs, userData);
      toast.success("Your course has been added successfully");
      router.push(`/courseDetails/${res[0].id}`);
    } catch {
      toast.error("An error occurred during adding your course");
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
    form.setValue("coursePicture", file);
  };

  // Handle cropped image
  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);

    // Convert blob to file
    const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
      type: "image/jpeg",
    });

    // Upload to Cloudinary
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
      form.setValue("coursePictureUrl", pictureUrl);
      toast.success("Image uploaded successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <>
      {showCropper && imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
          aspect="4:3"
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[600px] space-y-6"
        >
          <InputField
            control={form.control}
            name="title"
            label="Course Title"
            placeholder="course title"
            type="text"
          />

          <TextInput
            control={form.control}
            name="description"
            label="Course Description"
            placeholder="course description"
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="course price"
                    type="number"
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SelectInputField
            control={form.control}
            name="category"
            label="Category"
            placeholder="category"
            values={categories}
          />

          {/* <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Thumbnail</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription className="text-xs">
                We recommend you to upload an thumbnail with 16:9 or 4:3 aspect
                ratio
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

          <PictureInput
            control={form.control}
            handlePictureUpload={handleFileSelect}
            name="coursePicture"
            label="Course Thumbnail"
          />
          {uploadProgress > 0 && <Progress value={uploadProgress} />}

          <Button type="submit" disabled={uploading || isLoading}>
            {isLoading ? <BeatLoader size={12} color="white" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
}
