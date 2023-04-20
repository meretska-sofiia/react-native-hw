import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Text,
} from "react-native";

import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import {
  getFirestore,
  collection,
  getCountFromServer,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../firebase/config";

const PostCard = ({
  photo,
  imgDescription,
  postId,
  userId,
  location,
  locationDescription,
  navigation,
}) => {
  const [commentsCount, setCommentsCount] = useState(0);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("screen").width - 16 * 2
  );

  const getCommentsCount = async () => {
    try {
      const db = getFirestore(app);
      const commentsRef = collection(db, "posts", postId, "comments");
      onSnapshot(commentsRef, (querySnapshot) => {
        const comments = [];
        for (const doc of querySnapshot.docs) {
          comments.push({ ...doc.data(), id: doc.id });
        }
        setCommentsCount(comments.length);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommentsCount();
    const subscription = Dimensions.addEventListener("change", (screen) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  }, []);
  return (
    <View>
      <Image
        source={{ uri: photo }}
        width={dimensions}
        style={{ height: 240, borderRadius: 8 }}
      />
      <Text style={styles.imgDescription}>{imgDescription}</Text>

      <View style={styles.locationContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() =>
            navigation.navigate("Комментарии", {
              postId: postId,
              photo: photo,
              userId: userId,
            })
          }
        >
          <EvilIcons name="comment" size={24} color="#BDBDBD" />
          <Text style={styles.comments}>{commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() =>
            navigation.navigate("Карта", {
              latitude: location.coords?.latitude,
              longitude: location.coords?.longitude,
            })
          }
        >
          <Feather name="map-pin" size={24} color="#BDBDBD" />
          <Text style={styles.location}>{locationDescription}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgDescription: {
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 19,
    marginTop: 8,
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

export default PostCard;
