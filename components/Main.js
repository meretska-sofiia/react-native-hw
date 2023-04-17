import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../router";

import { authStateChangeUser } from "../redux/auth/authOperations";

const Main = () => {
  const { stateChange } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const routing = useRoute(stateChange);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, [stateChange]);

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
