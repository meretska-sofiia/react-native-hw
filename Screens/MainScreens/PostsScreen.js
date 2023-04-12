import React from "react";
import { useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import DefaultPostsScreen from "../NestedScreens/DefaultPostsScreen";
import CommentsScreen from "../NestedScreens/CommentsScreen";
import MapScreen from "../NestedScreens/MapScreen";

import { authSignOutUser } from "../../redux/auth/authOperations";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
  const dispatch = useDispatch();

  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => dispatch(authSignOutUser())}
              style={{ paddingRight: 10 }}
            >
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
        name={"Публикации"}
        component={DefaultPostsScreen}
      />
      <NestedScreen.Screen name={"Комментарии"} component={CommentsScreen} />
      <NestedScreen.Screen name={"Карта"} component={MapScreen} />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
