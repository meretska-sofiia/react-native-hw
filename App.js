import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./Screens/LoginScreen";
import RegistartionScreen from "./Screens/RegistrationScreen";
import PostsScreen from "./Screens/MainScreens/PostsScreen";
import AddPostsScreen from "./Screens/MainScreens/AddPostScreen";
import ProfileScreen from "./Screens/MainScreens/ProfileScreen";

const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Posts" component={PostsScreen} />
        <Tab.Screen name="AddPosts" component={AddPostsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

//  <MainStack.Navigator>
//    <MainStack.Screen
//      options={{ headerShown: false }}
//      name="Login"
//      component={LoginScreen}
//    />
//    <MainStack.Screen
//      options={{ headerShown: false }}
//      name="Registration"
//      component={RegistartionScreen}
//    />
//  </MainStack.Navigator>;
