import { AuthState } from "@/app/_services/types";
import { createSlice } from "@reduxjs/toolkit";



const initialState: AuthState = {
  authenticated: false,
  user: {
    id: "",
    email: "",
    name: "",
    role: "",
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
    // setLoading(state, action) {
    //   // state.isLoading = action.payload;
    // },
    logoutUser(state) {
      state.authenticated = false;
      state.user = {
        id: "",
        email: "",
        name: "",
        role: "",
      };
      // state.isLoading = false;
    },
    // setAuthLoading: (state, action: PayloadAction<boolean>) => {
    //   // state.isLoading = action.payload
    // },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export const getUserData = (state: {auth: AuthState}) => state.auth.user;

export default authSlice.reducer