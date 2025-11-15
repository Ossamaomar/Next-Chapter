"use client";

import { getVideoDuration } from "@/app/_lib/helpers";
import { updateCourseDuration } from "@/app/_services/courses";
import { editLectureApi } from "@/app/_services/lectures";
import { CourseLecture, CourseLectureInput } from "@/app/_services/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { editLecture } from "@/store/courseLecturesSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

const editLectureFormSchema = z.object({
  title: z.string().min(3, {
    message: "Enter a proper name for the lecture",
  }),
  lecture: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File cannot be empty" })
    .optional(),
  lectureUrl: z.string(),
  description: z
    .string()
    .min(0, {
      message: "Enter a proper description for the lecture",
    })
    .optional(),
});

export function EditLectureDialog({ lecture }: { lecture: CourseLecture }) {
  const { id: courseId }: { id: string } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const editLectureForm = useForm<z.infer<typeof editLectureFormSchema>>({
    resolver: zodResolver(editLectureFormSchema),
    defaultValues: {
      title: lecture.title,
      lecture: undefined,
      description: lecture.description,
      lectureUrl: lecture.video_url,
    },
  });

  async function handleVideoUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lectures"); // Replace this with your actual unsigned preset
    formData.append("resource_type", "video");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setUploading(true);
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsed4bxit/video/upload",
        formData, // 👈 FormData only
        {
          signal: controller.signal,
          onUploadProgress: (event) => {
            if (event.lengthComputable && event.total) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          },
        }
      );

      const videoUrl = res.data.secure_url;
      editLectureForm.setValue("lectureUrl", videoUrl);
    } catch (err) {
      if (axios.isCancel(err)) {
        toast.info("Upload cancelled");
      } else if (err.name === "CanceledError") {
        toast.info("Upload cancelled");
      } else {
        console.error("Upload error:", );
        toast.info(err);
      }
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof editLectureFormSchema>) {
    const duration =
      editLectureForm.getValues("lecture") === undefined
        ? lecture.duration
        : await getVideoDuration(values.lecture);

    const durationDiff = Number((duration - lecture.duration).toFixed(0));

    const lectureApiInput: CourseLectureInput = {
      course_id: courseId,
      section_id: lecture.section_id,
      title: values.title,
      video: editLectureForm.getValues("lectureUrl"),
      description: values.description,
      duration: Number(duration.toFixed(0)),
    };

    try {
      setIsLoading(true);
      if (durationDiff !== 0) {
        await updateCourseDuration(lecture.course_id, durationDiff, "inc");
      }
      const res = await editLectureApi(lectureApiInput, lecture.id);
      dispatch(editLecture(res));
      ref.current?.click();
      toast.success("Lecture edited succesfully!");
      setUploadProgress(0);
      setUploading(false);
    } catch {
      toast.error("Error occurred during editing the lecture");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen && abortControllerRef.current) {
          abortControllerRef.current.abort(); // cancel upload
          setUploading(false);
          setUploadProgress(0);
        }
      }}
    >
      <form>
        <DialogTrigger asChild>
          <div role="button" className="font-normal text-sm">
            Edit
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit lecture</DialogTitle>
            <DialogDescription>
              Edit a lecture from your section here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...editLectureForm}>
            <form
              onSubmit={editLectureForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={editLectureForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lecture Title</FormLabel>
                    <FormControl>
                      <Input placeholder="lecture title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editLectureForm.control}
                name="lecture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lecture Video</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="video/*, .mkv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(e.target.files?.[0]);
                            handleVideoUpload(file);
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {uploadProgress ? (
                <Progress value={uploadProgress} color="#2ed360" />
              ) : null}

              <FormField
                control={editLectureForm.control}
                name="lectureUrl"
                render={() => <></>}
              />

              <FormField
                control={editLectureForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lecture Description(optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="lecture description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading || uploading}>
                  {isLoading ? <BeatLoader size={10} /> : "Save changes"}
                </Button>
                <DialogClose asChild>
                  <Button ref={ref} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
