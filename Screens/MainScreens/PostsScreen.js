import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, FlatList, Text } from "react-native";

import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const PostsScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  console.log("posts", posts);
  useEffect(() => {
    if (route.params) {
      setPosts((prev) => [...prev, route.params]);
    }
  }, [route.params]);
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(i, inx) => inx.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.photo }}
              width={"100%"}
              style={{ height: 240, borderRadius: 8 }}
            />
            <Text style={styles.imgDescription}>{item.imgDescr}</Text>

            <View style={styles.locationContainer}>
              <View style={styles.iconContainer}>
                <EvilIcons name="comment" size={24} color="black" />
                <Text>mk</Text>
              </View>
              <View style={styles.iconContainer}>
                <Feather name="map-pin" size={24} color="#BDBDBD" />
                <Text>Ivano-Frankivs'k Region, Ukraine</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  imgDescription: {
    color: "#212121",
    fontSize: 16,
    lineHeight: 19,
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginTop: 8,
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default PostsScreen;
