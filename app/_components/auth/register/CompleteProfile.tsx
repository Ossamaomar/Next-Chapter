"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { InstructorInfo } from "@/app/_services/types";
import { createInstructorInfo } from "@/app/_services/auth";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getUserData } from "@/store/authSlice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import PictureInput from "../../forms/PictureInput";
import InputField from "../../forms/InputField";
import TextInput from "../../forms/TextInput";
import SocailLinksInput from "../../forms/SocailLinksInput";
import ImageCropper from "../../forms/ImageCropper";

const FormSchema = z.object({
  personalPicture: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File cannot be empty" }),
  personalPictureUrl: z.string(),
  title: z.string().min(2, {
    message: "Your last name is required",
  }),
  description: z.string().min(10, {
    message: "Your description is required",
  }),
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
});

export default function CompleteProfile() {
  const user = useSelector(getUserData);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      personalPicture: undefined,
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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const filteredLinks =
      data.links
        ?.filter((link) => link.url.trim() !== "")
        .map((link) => link.url) || [];

    const info: InstructorInfo = {
      id: user.id,
      name: user.name,
      title: data.title,
      description: data.description,
      personalPictureUrl: data.personalPictureUrl,
      links: filteredLinks,
    };

    setIsLoading(true);
    try {
      await createInstructorInfo(info);
      toast.success("Your profile is now updated");
      router.push("/");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  }

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
          aspect="1:1"
        />
      )}
      
      <div className="flex-1 py-10 flex items-center justify-center bg-gradient-to-r from-amber-100 to-emerald-100">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[600px] rounded-lg space-y-6 py-20 border px-8 border-gray-400 bg-white"
          >
            <PictureInput
              control={form.control}
              handlePictureUpload={handleFileSelect}
              name="personalPicture"
              label="Personal Picture"
            />

            {uploadProgress > 0 && (
              <Progress value={uploadProgress} />
            )}

            <InputField
              control={form.control}
              name="title"
              label="Title"
              placeholder="title"
              type="text"
            />

            <TextInput
              control={form.control}
              name="description"
              label="Description"
              placeholder="description"
            />

            <SocailLinksInput
              control={form.control}
              fields={fields}
              append={append}
              remove={remove}
            />

            <Button
              disabled={uploading || isLoading}
              type="submit"
              className="w-fit"
            >
              {isLoading ? <MoonLoader size={22} color="#ffffff" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}