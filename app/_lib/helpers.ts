import { CourseLecture, LectureProgress } from "../_services/types";

export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject("Error loading video metadata.");
    };

    video.src = URL.createObjectURL(file);
  });
}

export function truncateWords(str: string, num: number) {
  const words = str.split(" ");
  return words.length > num
    ? words.slice(0, num).join(" ") + " ..."
    : str;
}

export function findFirstNotCompletedLecture(lecturesProgress: LectureProgress[], lectures: CourseLecture[]) {
  // Sort lectures by sectionIndex first, then orderIndex
  const sorted = [...lecturesProgress].sort((a, b) => {
    if (a.sectionIndex !== b.sectionIndex)
      return a.sectionIndex - b.sectionIndex;
    return a.orderIndex - b.orderIndex;
  });

  // Find the first lecture that is not completed
  const firstLec = sorted.find(lecture => !lecture.isCompleted) || sorted[sorted.length - 1];
  return lectures.find(l => l.id === firstLec.lectureId)
}

export function sortLectures(lectures: CourseLecture[]) {
  const sorted = [...lectures].sort((a, b) => {
    if (a.section_index !== b.section_index)
      return a.section_index - b.section_index;
    return a.order_index - b.order_index;
  });

  return sorted
}

export function getCompletedLecturesCount(
  lecturesProgress: LectureProgress[],
  sectionIndex: number
): number {
  return lecturesProgress.filter(
    (lecture) => lecture.sectionIndex === sectionIndex && lecture.isCompleted
  ).length;
}

export function formatDuration(duration:number) {
  if (duration > 3600) {
    const hr = Math.floor(duration / 3600);
    return `${hr} hours`;
  } else {
    const mins = Math.floor(duration / 60);
    return `${mins} minutes`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
};

export const categories = [
  "Development",
  "IT & Software",
  "Business",
  "Finance & Accounting",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
];



