import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const screenDimensions = Dimensions.get("screen");

const DefaultPostsScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [dimensions, setDimensions] = useState(screenDimensions.width - 16 * 2);
  console.log(route.params);
  useEffect(() => {
    if (route.params) {
      setPosts((prev) => [...prev, route.params]);
    }
    const subscription = Dimensions.addEventListener("change", (screen) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Image
          source={require("../../assets/user.jpg")}
          width={60}
          style={styles.userImg}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Natali Romanova</Text>
          <Text style={styles.userEmail}>email@example.com</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(i, inx) => inx.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.photo }}
              width={dimensions}
              style={{ height: 240, borderRadius: 8 }}
            />
            <Text style={styles.imgDescription}>{item.imgDescr}</Text>

            <View style={styles.locationContainer}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate("Комментарии")}
              >
                <EvilIcons name="comment" size={24} color="#BDBDBD" />
                <Text style={styles.comments}>23</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() =>
                  navigation.navigate("Карта", {
                    latitude: item?.location.coords?.latitude,
                    longitude: item?.location.coords?.longitude,
                  })
                }
              >
                <Feather name="map-pin" size={24} color="#BDBDBD" />
                <Text style={styles.location}>{item.locationDescription}</Text>
              </TouchableOpacity>
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
    fontFamily: "Roboto-Medium",
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
  user: {
    flexDirection: "row",
    marginBottom: 32,
    gap: 8,
    alignItems: "center",
  },
  userInfo: {},
  userName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
    lineHeight: 15,
    color: "#212121",
  },
  userEmail: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    lineHeight: 13,
    color: "#212121CC",
  },
  userImg: {
    borderRadius: 16,
  },
  location: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textDecorationLine: "underline",
  },
  comments: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
});

export default DefaultPostsScreen;
