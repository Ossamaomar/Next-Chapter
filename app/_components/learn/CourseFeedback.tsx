import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRating, editRating } from "@/app/_services/ratings";
import { setRating } from "@/store/ratingSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { CourseResponse, Enrollment, Rating } from "@/app/_services/types";
import {
  addCourseRating,
  editCourseRating,
  getCourseById,
} from "@/app/_services/courses";

export default function CourseFeedback({
  enrollment,
  rating,
}: {
  enrollment: Enrollment;
  rating: Rating;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(rating.rating);
  const [feedback, setFeedback] = useState<string>(rating.feedback);
  const [course, setCourse] = useState<CourseResponse>(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedRating(rating.rating);
    setFeedback(rating.feedback);
  }, [rating]);

  useEffect(() => {
    async function fetchCourse() {
      const res = await getCourseById(enrollment?.courseId ?? "");
      setCourse(res);
    }
    fetchCourse();
  }, [enrollment?.courseId]);

  async function handleCreateRating(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await createRating(enrollment, selectedRating, feedback);
      await addCourseRating(course, selectedRating);
      dispatch(setRating(res));
      toast.message("Thanks for your feedback!");
    } catch {
      toast.error("An error occurred while giving feedback");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditRating(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await editCourseRating(course, selectedRating, rating);
      const res = await editRating(enrollment, selectedRating, feedback);
      const newCourseUpdate = await getCourseById(course?.id);
      setCourse(newCourseUpdate);
      dispatch(setRating(res));
      toast.message("Thanks for your feedback!");
    } catch {
      toast.error("An error occurred while giving feedback");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setSelectedRating(rating.rating);
    setFeedback(rating.feedback);
  }, [rating]);
  return (
    <form
      onSubmit={rating.id ? handleEditRating : handleCreateRating}
      className="space-y-2"
    >
      {/* <DialogHeader>
            <DialogTitle>Give course a rating</DialogTitle>
          </DialogHeader> */}
      <div className="grid gap-4">
        <StarRating
          onRatingChange={setSelectedRating}
          defaultRating={selectedRating}
        />
        <div className="grid gap-3">
          <Label htmlFor="feedback">Feedback</Label>
          <Input
            id="feedback"
            name="feedback"
            placeholder="please give us your feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>

        <Button
          className="disabled:cursor-not-allowed"
          disabled={isLoading}
          type="submit"
        >
          {rating.id ? "Edit Feedback" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
