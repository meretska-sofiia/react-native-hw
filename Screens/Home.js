import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
import { TouchableOpacity, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PostsScreen from "./MainScreens/PostsScreen";
import CreatePostsScreen from "./MainScreens/CreatePostsScreen";
import ProfileScreen from "./MainScreens/ProfileScreen";

const Home = () => {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="grid-outline" size={24} color="black" />
          ),
          headerRight: ({ focused, size, color }) => (
            <TouchableOpacity onPress={() => {}} style={styles.logout}>
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
        name="Публикации"
        component={PostsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={styles.plusIconContainer}>
              <AntDesign name="plus" size={24} color="#fff" />
            </View>
          ),
          headerLeft: () => (
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={24}
              color="#212121"
              style={{ marginLeft: 10 }}
            />
          ),
        }}
        name="Создать публикацию"
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
const styles = StyleSheet.create({
  logout: {
    paddingRight: 10,
  },
  plusIconContainer: {
    backgroundColor: "#FF6C00",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 40,
  },
});

export default Home;
