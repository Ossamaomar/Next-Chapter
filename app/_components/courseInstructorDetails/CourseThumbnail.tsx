"use client";

import EditButton from "./EditButton";
import { useDispatch, useSelector } from "react-redux";
import {
  editCourseThumbnail,
  getCourseMetaState,
  setEditTypeNone,
} from "@/store/courseMetaSlice";
import { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import ImageCropper from "@/app/_components/forms/ImageCropper";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { toast } from "sonner";

export default function CourseThumbnail() {
  const {
    isEditing,
    editType,
    currentState: { thumbnail_url: currentThumbnail },
    lastFetched: { thumbnail_url: lastThumbnail, title },
  } = useSelector(getCourseMetaState);

  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editType === "thumbnail") {
      fileInputRef.current?.click();
    }
  }, [editType]);

  const thumbnail = isEditing ? currentThumbnail : lastThumbnail;

  // Handle file selection - convert to data URL and show cropper
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
      dispatch(setEditTypeNone());
    }
  };

  // Handle cropped image
  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);

    // Convert blob to file
    const croppedFile = new File([croppedBlob], "cropped-thumbnail.jpg", {
      type: "image/jpeg",
    });

    // Upload to Cloudinary
    await handlePictureUpload(croppedFile);
  };

  // Upload to Cloudinary
  async function handlePictureUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "personal_pictures");

    setUploading(true);
    setUploadProgress(0);
    setIsLoading(true);

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
      dispatch(editCourseThumbnail(pictureUrl));
      toast.success("Thumbnail uploaded successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload thumbnail");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setIsLoading(false);
    }
  }

  if (!currentThumbnail)
    return <Skeleton className="h-[300px] w-full bg-gray-300" />;

  return (
    <>
      {showCropper && imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setImageSrc(null);
          }}
          aspect="4:3"
        />
      )}

      <div className="relative rounded-2xl border-4 border-emerald-500">
        <div className="absolute z-50 right-5 top-5">
          <EditButton editType="thumbnail" isDisabled={!currentThumbnail} />
        </div>
        {thumbnail && (
          <div className="relative aspect-video">
            <Image
              className="rounded-2xl border-4 border-gray-300"
              fill
              src={thumbnail}
              alt={`The thumbnail for ${title} course`}
            />

            {isLoading && (
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 rounded-2xl flex flex-col gap-4 justify-center items-center">
                <BeatLoader color="#fff" />
                {uploadProgress > 0 && (
                  <div className="w-3/4">
                    <Progress value={uploadProgress} className="bg-gray-600" />
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
        )}
      </div>
    </>
  );
}