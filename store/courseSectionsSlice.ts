import {
  addSection,
  deleteSection,
  updateSectionsOrder,
} from "@/app/_services/sections";
import { CourseSection, CourseSectionInputs } from "@/app/_services/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";


export const addSectionThunk = createAsyncThunk(
  "courseSections/insertSection",
  async function (section: CourseSectionInputs) {
    const res = await addSection(section);

    return res;
  }
);

export const updateSectionsOrderThunk = createAsyncThunk(
  "courseSections/updateOrder",
  async (_, { getState }) => {
    const sections = (getState() as RootState).courseSections.sections;
    const payload = sections.map(({ id, order_index }) => ({
      id,
      order_index,
    }));
    await updateSectionsOrder(payload);
    return payload;
  }
);

export const deleteSectionThunk = createAsyncThunk(
  "courseSections/deleteSection",
  async (id: string, { getState }) => {
    const sections = (getState() as RootState).courseSections.sections;
    const lectures = (getState() as RootState).courseLectures.lectures;
    const sectionLectures = lectures.filter((lec) => lec.section_id === id);
    const payload = sections.map(({ id, order_index }) => ({
      id,
      order_index,
    }));
    await deleteSection(id, sections, sectionLectures);
    return payload;
  }
);

const initialState: {
  sections: CourseSection[];
  previousSections: CourseSection[];
  isLoading: boolean;
  editingSectionId: string;
} = {
  sections: [],
  previousSections: [],
  isLoading: false,
  editingSectionId: "",
};

const courseSectionsSlice = createSlice({
  name: "courseSections",
  initialState,
  reducers: {
    setSectionsFetched(state, action: PayloadAction<CourseSection[]>) {
      state.sections = action.payload;
      state.previousSections = action.payload;
    },
    removeSection(
      state,
      action: PayloadAction<{ id: string; order_index: number }>
    ) {
      state.previousSections = JSON.parse(JSON.stringify(state.sections));

      state.sections = state.sections.map((sec) =>
        sec.order_index > action.payload.order_index
          ? { ...sec, order_index: sec.order_index - 1 }
          : sec
      );

      state.sections = state.sections.filter(
        (sec) => sec.id !== action.payload.id
      );
    },
    selectSection(state, action: PayloadAction<string>) {
      state.editingSectionId = action.payload;
    },
    modifySection(state, action: PayloadAction<{ id: string; name: string }>) {
      state.sections = state.sections.map((sec) =>
        sec.id === action.payload.id
          ? { ...sec, name: action.payload.name }
          : sec
      );

      state.previousSections = state.sections;
      state.editingSectionId = "";
    },
    modifySectionOrder(
      state,
      action: PayloadAction<{ order: number; type: "up" | "down" }>
    ) {
      state.previousSections = JSON.parse(JSON.stringify(state.sections));
      const movedSection = state.sections.filter(
        (sec) => sec.order_index === action.payload.order
      )[0];
      const adjacentSection =
        action.payload.type === "up"
          ? state.sections.filter(
              (sec) => sec.order_index === action.payload.order - 1
            )[0]
          : state.sections.filter(
              (sec) => sec.order_index === action.payload.order + 1
            )[0];

      if (action.payload.type === "up") {
        state.sections = state.sections.map((sec) =>
          sec.id === movedSection.id
            ? { ...sec, order_index: sec.order_index - 1 }
            : sec
        );

        state.sections = state.sections.map((sec) =>
          sec.id === adjacentSection.id
            ? { ...sec, order_index: sec.order_index + 1 }
            : sec
        );
      } else {
        state.sections = state.sections.map((sec) =>
          sec.id === movedSection.id
            ? { ...sec, order_index: sec.order_index + 1 }
            : sec
        );

        state.sections = state.sections.map((sec) =>
          sec.id === adjacentSection.id
            ? { ...sec, order_index: sec.order_index - 1 }
            : sec
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        addSectionThunk.fulfilled,
        (state, action: PayloadAction<CourseSection>) => {
          state.sections.push(action.payload);
          state.isLoading = false;
        }
      )
      .addCase(addSectionThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSectionsOrderThunk.rejected, (state) => {
        state.sections = state.previousSections;
      })
      .addCase(deleteSectionThunk.rejected, (state) => {
        state.sections = state.previousSections;
      });
    // .addCase(deletetSectionThunk.fulfilled, (state,action: PayloadAction<string>) => {
    //   state.sections.filter(sec => sec.id !== action.payload)
    // });
  },
});

export const {
  setSectionsFetched,
  removeSection,
  selectSection,
  modifySection,
  modifySectionOrder,
} = courseSectionsSlice.actions;

export const getSecionsState = (state: {
  courseSections: {
    sections: CourseSection[];
    isLoading: boolean;
    editingSectionId: string;
  };
}) => state.courseSections.sections;

export const getSecionsLoadingState = (state: {
  courseSections: {
    sections: CourseSection[];
    isLoading: boolean;
    editingSectionId: string;
  };
}) => state.courseSections.isLoading;

export const getSecionSelected = (state: {
  courseSections: {
    sections: CourseSection[];
    isLoading: boolean;
    editingSectionId: string;
  };
}) => state.courseSections.editingSectionId;

export default courseSectionsSlice.reducer;
