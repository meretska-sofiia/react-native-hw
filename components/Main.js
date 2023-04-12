import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../router";

import { authStateChangeUser } from "../redux/auth/authOperations";

const Main = ({ onLayoutRootView }) => {
  const { stateChange } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const routing = useRoute(stateChange);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  return (
    <NavigationContainer onLayout={onLayoutRootView}>
      {routing}
    </NavigationContainer>
  );
};

export default Main;
