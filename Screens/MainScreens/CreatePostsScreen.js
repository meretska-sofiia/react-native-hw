import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

const AddPostsScreen = () => {
  return (
    <View style={styles.container}>
      <Camera style={styles.camera}></Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    height: 300,
  },
});

export default AddPostsScreen;
