import { Rating } from "@/app/_services/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Rating = {
  id: "",
  courseId: "",
  feedback: "",
  rating: null,
  enrollmentId: "",
  instructorId: "",
};

const ratingSlice = createSlice({
  initialState,
  name: "rating",
  reducers: {
    setRating(state, action: PayloadAction<Rating>) {
      state.id = action.payload.id;
      state.courseId = action.payload.courseId;
      state.enrollmentId = action.payload.enrollmentId;
      state.rating = action.payload.rating;
      state.feedback = action.payload.feedback;
    },
    clearRating() {
      return initialState;
    }
  },
});

export const { setRating, clearRating } = ratingSlice.actions;

export const getEnrollmentRatingState = (state: {rating: Rating}) => state.rating;

export default ratingSlice.reducer;
