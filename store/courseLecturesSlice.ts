import { CourseLecture } from "@/app/_services/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { deleteLectureApi } from "@/app/_services/lectures";

const initialState: {
  lectures: CourseLecture[];
  previousLectures: CourseLecture[];
  isLoading: boolean;
  editingLectureId: string;
} = {
  lectures: [],
  previousLectures: [],
  isLoading: false,
  editingLectureId: "",
};

export const deleteLectureThunk = createAsyncThunk(
  "courseLectures/deleteLecture",
  async (lecture: CourseLecture) => {
    // const cart = (getState() as RootState).cart;
    await deleteLectureApi(lecture);
    return lecture;
  }
);

const courseLecturesSlice = createSlice({
  name: "courseLectures",
  initialState,
  reducers: {
    setLecturesFetched(state, action: PayloadAction<CourseLecture[]>) {
      state.lectures = action.payload;
    },
    addLecture(state, action: PayloadAction<CourseLecture>) {
      state.lectures.push(action.payload);
    },
    editLecture(state, action: PayloadAction<CourseLecture>) {
      state.lectures = state.lectures.map((lec) =>
        lec.id === action.payload.id ? action.payload : lec
      );
    },
    deleteLecture(state, action: PayloadAction<{ id: string }>) {
      state.lectures = state.lectures.filter(
        (lec) => lec.id !== action.payload.id
      );
    },
    selectLectureToEdit(state, action: PayloadAction<{ id: string }>) {
      state.editingLectureId = action.payload.id;
    },
    unSelectLecture(state) {
      state.editingLectureId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteLectureThunk.rejected, (state) => {
        state.lectures = state.previousLectures;
      })
      .addCase(deleteLectureThunk.fulfilled, (state, action) => {
        state.lectures = state.lectures.filter(
          (item) => item.id !== action.payload.id
        );
      });
  },
});

export const getCourseLectures = (state: {
  courseLectures: { lectures: CourseLecture[] };
}) => state.courseLectures.lectures;

export const getEditedLectureId = (state: {
  courseLectures: { editingLectureId: string };
}) => state.courseLectures.editingLectureId;

export const getNumberOfLecturesBySection =
  (sectionId: string) => (state: RootState) =>
    state.courseLectures.lectures.reduce(
      (sum, cur) => (cur.section_id === sectionId ? (sum += 1) : sum),
      0
    );

export const getDurationOfLecturesBySection =
  (sectionId: string) => (state: RootState) =>
    state.courseLectures.lectures.reduce(
      (sum, cur) =>
        cur.section_id === sectionId ? (sum += cur.duration) : sum,
      0
    );

export const {
  setLecturesFetched,
  addLecture,
  deleteLecture,
  selectLectureToEdit,
  unSelectLecture,
  editLecture,
} = courseLecturesSlice.actions;
export default courseLecturesSlice.reducer;
