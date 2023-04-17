import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  userId: null,
  login: null,
  email: null,
  stateChange: false,
  error: null,
  photoURL: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => {
      return {
        ...state,
        userId: payload.userId,
        login: payload.login,
        email: payload.email,
        photoURL: payload.photoURL,
      };
    },
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    logOutUser: (state) => (state = { ...initialState }),
    // deleteUserAvatar: (state) => ({
    //   ...state,
    //   photoURL: null,
    // }),
    updateUserAvatar: (state, { payload }) => ({
      ...state,
      photoURL: payload.photoURL,
    }),
  },
});
