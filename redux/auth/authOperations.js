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

const { updateUserProfile, authStateChange, logOutUser, updateUserAvatar } =
  authSlice.actions;

export const authSignUpUser =
  ({ userEmail, password, login, avatar }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password
      );

      await updateProfile(auth.currentUser, {
        photoURL: avatar,
        displayName: login,
      });

      const { displayName, uid, email, photoURL } = auth.currentUser;

      const updatedUserProfile = {
        login: displayName,
        userId: uid,
        email: email,
        photoURL: photoURL,
      };
      dispatch(updateUserProfile(updatedUserProfile));
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
          photoURL: user.photoURL,
        };
        dispatch(updateUserProfile(updatedUserProfile));
        dispatch(authStateChange({ stateChange: true }));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUsersAvatar = (userAvatar) => async (dispatch, getState) => {
  try {
    const auth = getAuth(app);
    await updateProfile(auth.currentUser, {
      photoURL: userAvatar,
    });
    const { photoURL } = auth.currentUser;

    dispatch(updateUserAvatar({ photoURL }));
  } catch (error) {
    console.log(error);
  }
};
