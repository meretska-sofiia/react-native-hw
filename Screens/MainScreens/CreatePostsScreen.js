import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AddPostsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>AddPostsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddPostsScreen;
