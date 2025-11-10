import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { useEffect, useState } from "react";
import { createRating, editRating } from "@/app/_services/ratings";
import { CourseResponse, Enrollment, Rating } from "@/app/_services/types";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setRating } from "@/store/ratingSlice";
import { FaStar } from "react-icons/fa";
import { addCourseRating, editCourseRating, getCourseById } from "@/app/_services/courses";

export function RatingDialog({
  enrollment,
  rating,
}: {
  enrollment: Enrollment;
  rating: Rating;
}) {
  const [selectedRating, setSelectedRating] = useState(rating.rating);
  const [feedback, setFeedback] = useState<string>(rating.feedback);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [course, setCourse] = useState<CourseResponse>(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedRating(rating.rating);
    setFeedback(rating.feedback);
  }, [rating]);

  useEffect(() => {
    async function fetchCourse() {
      const res = await getCourseById(enrollment?.courseId);
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
      setOpenDialog(false); 
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
      // setPreviousRating(selectedRating)
      dispatch(setRating(res));
      setOpenDialog(false); // Close the dialog on success
      toast.message("Thanks for your feedback!");
    } catch {
      toast.error("An error occurred while giving feedback");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        {rating.id ? (
          <Button
            variant="outline"
            className="flex bg-white text-yellow-500 gap-1 items-center"
          >
            <FaStar size={20} /> <p>{rating.rating}</p>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-cyan-600/20 text-cyan-600 cursor-pointer hover:text-cyan-600"
          >
            Leave Rating
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={rating.id ? handleEditRating : handleCreateRating}
          className="space-y-2"
        >
          <DialogHeader>
            <DialogTitle>Give course a rating</DialogTitle>
          </DialogHeader>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              {rating.id ? "Edit Feedback" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
