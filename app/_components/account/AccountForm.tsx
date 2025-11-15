"use client"

import { Form } from "@/components/ui/form";
import { z } from "zod";
import InputField from "../forms/InputField";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import TextInput from "../forms/TextInput";
import SocailLinksInput from "../forms/SocailLinksInput";
import { Progress } from "@/components/ui/progress";
import PictureInput from "../forms/PictureInput";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, loginUser } from "@/store/authSlice";
import axios from "axios";
import ImageCropper from "../forms/ImageCropper";
import { getInstructorInfo, updateUserInfo } from "@/app/_services/auth";
import Image from "next/image";
import { Account } from "@/app/_services/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaCamera } from "react-icons/fa6";

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Your first name is required",
    }),
    email: z.string().email("Email must be like name@example.com"),
    role: z.enum(["Student", "Instructor", ""], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
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
      if (!data.personalPictureUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Personal picture is required for instructors",
          path: ["personalPicture"],
        });
      }

      if (!data.title || data.title.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Title must be at least 2 characters",
          path: ["title"],
        });
      }

      if (!data.description || data.description.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Description must be at least 10 characters",
          path: ["description"],
        });
      }
    }
  });

export default function AccountForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      personalPictureUrl: "",
      email: "",
      name: "",
      role: "Student",
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
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof FormSchema
  > | null>(null);

  const user = useSelector(getUserData);
  const dispatch = useDispatch();

  // Watch all form values to detect changes
  const currentValues = form.watch();

  // Check if form has changes
  const hasChanges = initialValues
    ? JSON.stringify(currentValues) !== JSON.stringify(initialValues)
    : false;

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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const filteredLinks =
      data.links
        ?.filter((link) => link.url.trim() !== "")
        .map((link) => link.url) || [];

    const account: Account = {
      id: user.id,
      email: data.email,
      name: data.name,
      role: data.role,
      title: data.title,
      description: data.description,
      personalPictureUrl: data.personalPictureUrl,
      links: filteredLinks,
    };

    setIsLoading(true);
    try {
      const res = await updateUserInfo(account);
      dispatch(
        loginUser({
          id: res.id,
          email: res.email,
          name: res.name,
          role: res.role,
          personalPictureUrl: res.personalPictureUrl,
        })
      );

      // Update initial values after successful save
      setInitialValues(form.getValues());

      toast.success("Your profile updated successfully");
    } catch {
      toast.error("An error occurred during update");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function setFormInitialValues() {
      try {
        const formValues: z.infer<typeof FormSchema> = {
          name: user.name,
          email: user.email,
          role: user.role,
          personalPictureUrl: "",
          title: "",
          description: "",
          links: [{ url: "" }],
        };

        if (user.role === "Instructor") {
          const data = await getInstructorInfo(user.id);

          formValues.title = data.title || "";
          formValues.description = data.description || "";
          formValues.personalPictureUrl = data.personalPictureUrl || "";

          if (data.links && data.links.length > 0) {
            formValues.links = data.links.map((link: string) => ({
              url: link,
            }));
          }
        }

        // Set form values
        form.reset(formValues);

        // Store initial values for comparison
        setInitialValues(formValues);
      } catch (error) {
        console.error("Error setting form values:", error);
        toast.error("Failed to load profile data");
      }
    }

    setFormInitialValues();
  }, [form, user]);

  const container = useRef<HTMLFormElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      container.current,
      { filter: "blur(10px)", opacity: 0 },
      {
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.5,
        delay: 1,
        ease: "power2.out",
        stagger: 0.3
      }
    );
  });

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

      <div className="w-full mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px] flex flex-col justify-center items-center rounded-lg space-y-6">
        <Form {...form}>
          <form
          ref={container}
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <div className="flex gap-4 items-center">
              <div className="relative aspect-square w-20 rounded-full bg-gray-300 flex justify-center items-center">
                {user.personalPictureUrl || form.getValues("personalPictureUrl") ? (
                  <Image
                    src={form.getValues("personalPictureUrl") || user.personalPictureUrl}
                    alt={`${form.getValues("personalPictureUrl") || user.personalPictureUrl } personal picture`}
                    fill
                    className="rounded-full"
                  />
                ) : <FaCamera className="text-slate-500" size={20} />}
              </div>

              <div>
                <PictureInput
                  control={form.control}
                  handlePictureUpload={handleFileSelect}
                  name="personalPicture"
                  label="Personal Picture"
                />

                {uploadProgress > 0 && <Progress value={uploadProgress} />}
              </div>
            </div>

            <InputField
              control={form.control}
              name="name"
              label="Name"
              placeholder="name"
              type="text"
              disabled={true}
            />

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
              name="role"
              label="Role"
              placeholder="role"
              type="text"
              disabled={true}
            />

            {user.role === "Instructor" && (
              <>
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
              </>
            )}

            <Button
              disabled={uploading || isLoading || !hasChanges}
              type="submit"
              className="w-fit"
            >
              {isLoading ? (
                <BeatLoader size={10} color="#fff" />
              ) : (
                "Update profile"
              )}
            </Button>

            {!hasChanges && !isLoading && (
              <p className="text-sm text-gray-500">No changes to save</p>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
