import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  userId: null,
  login: null,
  email: null,
  stateChange: false,
  error: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      login: payload.login,
      email: payload.email,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    logOutUser: (state) => (state = { ...initialState }),
  },
});
