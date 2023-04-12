import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "../../firebase/config";
import { authSlice } from "./authSlice";

const { updateUserProfile, authStateChange, logOutUser } = authSlice.actions;

export const authSignUpUser =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, { displayName: login });

      const { displayName, uid, email } = auth.currentUser;

      const updatedUserProfile = {
        login: displayName,
        userId: uid,
        email: email,
      };
      dispatch(updateUserProfile(updatedUserProfile));

      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth(app);
    await signOut(auth);
    dispatch(logOutUser());
  } catch (error) {
    console.log(error);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const updatedUserProfile = {
          login: user.displayName,
          userId: user.uid,
          email: user.email,
        };
        dispatch(authStateChange({ stateChange: true }));
        dispatch(updateUserProfile(updatedUserProfile));
      }
    });
  } catch (error) {
    console.log(error);
  }
};
