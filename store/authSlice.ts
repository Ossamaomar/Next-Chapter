import { AuthState } from "@/app/_services/types";
import { createSlice } from "@reduxjs/toolkit";



const initialState: AuthState = {
  authenticated: false,
  user: {
    id: "",
    email: "",
    name: "",
    role: "",
    personalPictureUrl: ""
  },
  // isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.authenticated = true;
      state.user = action.payload;
      // state.isLoading = false;
    },
    updateUserPicture(state, action) {
      state.user.personalPictureUrl = action.payload.personalPictureUrl;
    },
    logoutUser(state) {
      state.authenticated = false;
      state.user = {
        id: "",
        email: "",
        name: "",
        role: "",
        personalPictureUrl: ""
      };
      // state.isLoading = false;
    },
    // setAuthLoading: (state, action: PayloadAction<boolean>) => {
    //   // state.isLoading = action.payload
    // },
  },
});

export const { loginUser, logoutUser, updateUserPicture } = authSlice.actions;
export const getUserData = (state: {auth: AuthState}) => state.auth.user;

export default authSlice.reducer