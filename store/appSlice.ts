import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

// in some appSlice.ts
const initialState = { initialized: false };
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
  },
});
export const { setInitialized } = appSlice.actions;
export const getAppState = (state: RootState) => state.app.initialized;
export default appSlice.reducer;
