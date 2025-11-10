"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/app/_lib/helpers"; // we'll create this helper

export default function PictureInput({ control, handlePictureUpload }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc!, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedImage(croppedUrl);

      // Optionally upload cropped image to Cloudinary
      const file = new File([croppedImageBlob], "cropped.jpg", { type: "image/jpeg" });
      await handlePictureUpload(file);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, imageSrc, handlePictureUpload]);

  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageSrc && (
        <div className="relative w-[300px] h-[300px] bg-gray-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}

      {imageSrc && (
        <Button type="button" onClick={showCroppedImage}>
          Crop & Upload
        </Button>
      )}

      {croppedImage && (
        <div className="mt-4">
          <p>Preview:</p>
          <img src={croppedImage} alt="Cropped" className="w-32 h-32 object-cover rounded-full" />
        </div>
      )}
    </div>
  );
}
