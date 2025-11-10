import { CourseMetaState } from "@/app/_services/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CourseMetaState = {
  isEditing: false,
  editType: "none",
  // currentFile: new File([""], "empty.txt", { type: "text/plain" }),
  currentState: {
    title: "",
    description: "",
    price: 0,
    thumbnail_url: "",
  },
  lastFetched: {
    title: "",
    description: "",
    price: 0,
    thumbnail_url: "",
  },
};

const courseMetaSlice = createSlice({
  name: "courseMeta", 
  initialState,
  reducers: {
    setCourseFetched(state, action) {
      state.currentState = action.payload;
      state.lastFetched = action.payload;
      state.isEditing = false;
      state.editType = "none";
    },
    setEditSession(state, action) {
      state.isEditing = true;
      state.editType = action.payload;
    },
    setEditTypeNone(state) {
      state.editType = "none";
    },
    editCourseTitle(state, action) {
      state.currentState.title = action.payload;
    },
    editCourseDescription(state, action) {
      state.currentState.description = action.payload;
    },
    editCoursePrice(state, action) {
      state.currentState.price = action.payload;
    },
    editCourseThumbnail(state, action) {
      state.currentState.thumbnail_url = action.payload;
    },
    returnToInitial(state) {
      state.isEditing = false;
      state.currentState = state.lastFetched;
      state.editType = "none";
    },
  },
});

export const {
  setCourseFetched,
  setEditSession,
  setEditTypeNone,
  editCourseTitle,
  editCourseDescription,
  editCoursePrice,
  editCourseThumbnail,
  returnToInitial,
} = courseMetaSlice.actions;

export const getIsEditing = (state: {courseMeta: CourseMetaState}) => state.courseMeta.isEditing;
export const getEditingType = (state: {courseMeta: CourseMetaState}) => state.courseMeta.editType;
export const getCurrentCourseState = (state: {courseMeta: CourseMetaState}) => state.courseMeta.currentState;
export const getLastCourseState = (state: {courseMeta: CourseMetaState}) => state.courseMeta.lastFetched;
export const getCourseMetaState = (state: {courseMeta: CourseMetaState}) => state.courseMeta;


export default courseMetaSlice.reducer;
