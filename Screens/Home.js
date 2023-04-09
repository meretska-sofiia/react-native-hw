import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import PostsScreen from "./MainScreens/PostsScreen";
import CreatePostsScreen from "./MainScreens/CreatePostsScreen";
import ProfileScreen from "./MainScreens/ProfileScreen";

const Home = () => {
  return (
    <Tab.Navigator tabBarOptions={{ showLabel: false }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="grid-outline" size={24} color="black" />
          ),
        }}
        name="Posts"
        component={PostsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <AntDesign
              name="plus"
              size={24}
              color="#fff"
              style={{
                textAlign: "center",
                padding: 8,
                backgroundColor: "#FF6C00",
                borderRadius: 20,
                width: 70,
                height: 40,
              }}
            />
          ),
        }}
        name="AddPosts"
        component={CreatePostsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="person-outline" size={24} color="black" />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default Home;
