"use client";

import { createLecture } from "@/app/_services/lectures";
import { CourseLectureInput } from "@/app/_services/types";
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
import { addLecture, getCourseLectures } from "@/store/courseLecturesSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { getVideoDuration } from "@/app/_lib/helpers";
import { getSecionsState } from "@/store/courseSectionsSlice";


const addLectureFormShema = z.object({
  title: z.string().min(3, {
    message: "Enter a proper name for the lecture",
  }),
  lecture: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File cannot be empty" }),
  lectureUrl: z.string(),
  description: z
    .string()
    .min(0, {
      message: "Enter a proper description for the lecture",
    })
    .optional(),
});

export function AddLectureDialog({ sectionId }: { sectionId: string }) {
  const { id: courseId }: { id: string } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const courseLectures = useSelector(getCourseLectures);
  const sections = useSelector(getSecionsState);
  const selectedSection = sections.filter(sec => sec.id === sectionId)[0];

  const addLectureForm = useForm<z.infer<typeof addLectureFormShema>>({
    resolver: zodResolver(addLectureFormShema),
    defaultValues: {
      title: "",
      lecture: undefined,
      description: "",
      lectureUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addLectureFormShema>) {
    const duration = await getVideoDuration(values.lecture);
    
    const order = courseLectures.filter(lec => lec.section_index === selectedSection.order_index).length;
    const lectureApiInput: CourseLectureInput = {
      course_id: courseId,
      section_id: sectionId,
      title: values.title,
      video: addLectureForm.getValues("lectureUrl"),
      description: values.description,
      duration: Number(duration.toFixed(0)),
      order_index: order,
      section_index: selectedSection.order_index
    };

    try {
      setIsLoading(true);
      const res = await createLecture(lectureApiInput);
      dispatch(addLecture(res));
      ref.current?.click();
      toast.success("Lecture added succesfully!");
      setUploadProgress(0);
      setUploading(false);
    } catch {
      toast.error("Error occurred during adding the lecture");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVideoUpload(file: File) {
  const CHUNK_SIZE = 6000000; // 6MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  setUploading(true);
  
  try {
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("upload_preset", "lectures");
      formData.append("resource_type", "video");
      
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsed4bxit/video/upload",
        formData,
        {
          headers: {
            'X-Unique-Upload-Id': `${file.name}-${Date.now()}`,
            'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
          },
          onUploadProgress: (event) => {
            const chunkProgress = (event.loaded / event.total!) * 100;
            const totalProgress = ((i + chunkProgress / 100) / totalChunks) * 100;
            setUploadProgress(Math.round(totalProgress));
          },
        }
      );
      
      // Last chunk will have the video URL
      if (i === totalChunks - 1) {
        addLectureForm.setValue("lectureUrl", res.data.secure_url);
      }
    }
  } catch (error) {
    console.error("Upload error:", error);
  } finally {
    setUploading(false);
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
          <Button className="w-full">Add lecture</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader onClick={() => console.log("Header")}>
            <DialogTitle>Add lecture</DialogTitle>
            <DialogDescription>
              Add a lecture to your section here. Click add when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...addLectureForm}>
            <form
              onSubmit={addLectureForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={addLectureForm.control}
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
                control={addLectureForm.control}
                name="lectureUrl"
                render={() => <></>}
              />

              <FormField
                control={addLectureForm.control}
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
                control={addLectureForm.control}
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
                  {isLoading ? <BeatLoader size={10} /> : "Add lecture"}
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
