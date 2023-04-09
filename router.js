import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const MainStack = createStackNavigator();

import LoginScreen from "./Screens/LoginScreen";
import RegistartionScreen from "./Screens/RegistrationScreen";
import Home from "./Screens/Home";

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <MainStack.Navigator>
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Registration"
          component={RegistartionScreen}
        />
      </MainStack.Navigator>
    );
  }
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
    </MainStack.Navigator>
  );
};
