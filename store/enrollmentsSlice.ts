// import { checkLectureProgress } from "@/app/_services/enrollments";
import {
  CourseLecture,
  Enrollment,
  EnrollmentsState,
  LectureProgress,
} from "@/app/_services/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: EnrollmentsState = {
  enrollments: [],
  loading: true,
  learningMode: false,
  lecturesProgress: [],
  currentWatchedLecture: null,
};

// const checkLectureThunk = createAsyncThunk(
//   "enrollments/checkLecture",
//   async function ({
//     lectureId,
//     enrollmentId,
//     value,
//   }: {
//     lectureId: string;
//     enrollmentId: string;
//     value: boolean;
//   }) {
//     const payload = await checkLectureProgress(enrollmentId, lectureId, value);

//     return payload;
//   }
// );

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments(state, action: PayloadAction<Enrollment[]>) {
      state.enrollments = action.payload;
      state.loading = false;
    },
    setLearningMode(state, action: PayloadAction<boolean>) {
      state.learningMode = action.payload;
    },
    setLecturesProgress(state, action: PayloadAction<LectureProgress[]>) {
      state.lecturesProgress = action.payload;
    },
    setCheckedLecture(
      state,
      action: PayloadAction<{ value: boolean; lectureId: string }>
    ) {
      state.lecturesProgress = state.lecturesProgress.map((l) =>
        l.lectureId === action.payload.lectureId
          ? { ...l, isCompleted: action.payload.value }
          : l
      );
    },
    setCurrentWatchedLecture(state, action: PayloadAction<CourseLecture>) {
      state.currentWatchedLecture = action.payload;
    },
    updateEnrollmentProgressState(
      state,
      action: PayloadAction<{ id: string; newProgress: number }>
    ) {
      const enr = state.enrollments.find((enr) => enr.id === action.payload.id);
      enr.progress = action.payload?.newProgress;
    },
    clearEnrollmentSlice() {
      return initialState;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(checkLectureThunk.fulfilled, )
  // }
});

export const {
  setEnrollments,
  setLearningMode,
  setLecturesProgress,
  setCheckedLecture,
  setCurrentWatchedLecture,
  updateEnrollmentProgressState,
  clearEnrollmentSlice
} = enrollmentsSlice.actions;

export const getEnrollmentsState = (state: { enrollments: EnrollmentsState }) =>
  state.enrollments;

export const getLecturesProgressState = (state: {
  enrollments: EnrollmentsState;
}) => state.enrollments.lecturesProgress;

export const getLearningModeState = (state: {
  enrollments: EnrollmentsState;
}) => state.enrollments.learningMode;

export const getCurrentWatchedLectureState = (state: {
  enrollments: EnrollmentsState;
}) => state.enrollments.currentWatchedLecture;

export default enrollmentsSlice.reducer;
