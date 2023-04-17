import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
import { StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import PostsScreen from "./MainScreens/PostsScreen";
import CreatePostsScreen from "./MainScreens/CreatePostsScreen";
import ProfileScreen from "./MainScreens/ProfileScreen";

const Home = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        options={() => ({
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="grid-outline" size={24} color="black" />
          ),
        })}
        name={"Posts"}
        component={PostsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => (
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
              onPress={() => navigation.navigate("Публикации")}
            />
          ),
        }}
        name="Создать публикацию"
        component={CreatePostsScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: () => (
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
