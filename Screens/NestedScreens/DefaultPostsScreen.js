import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import {
  getFirestore,
  onSnapshot,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { app } from "../../firebase/config";

import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const DefaultPostsScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("screen").width - 16 * 2
  );

  const { photoURL, login, email } = useSelector((state) => state.auth);

  async function getPostsWithComments() {
    const db = getFirestore(app);
    const postsRef = collection(db, "posts");

    onSnapshot(postsRef, async (querySnapshot) => {
      const postsWithComments = [];
      for (const doc of querySnapshot.docs) {
        const post = { ...doc.data(), id: doc.id };

        const commentsRef = collection(db, "posts", post.id, "comments");
        const commentsQuery = query(commentsRef);

        const commentsSnapshot = await getDocs(commentsQuery);
        const comments = [];

        commentsSnapshot.forEach((commentDoc) => {
          const comment = commentDoc.data();
          comments.push(comment);
        });

        post.comments = comments;

        const postIndex = postsWithComments.findIndex((p) => p.id === post.id);
        if (postIndex !== -1) {
          postsWithComments[postIndex] = post;
        } else {
          postsWithComments.push(post);
        }
      }

      setPosts(postsWithComments);
      setIsLoading(true);
    });
  }

  useEffect(() => {
    getPostsWithComments();

    const subscription = Dimensions.addEventListener("change", (screen) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  }, []);

  if (!isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#FF6C00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Image
          source={{ uri: photoURL }}
          width={60}
          height={60}
          style={styles.userImg}
        />
        <View>
          <Text style={styles.userName}>{login}</Text>
          <Text style={styles.userEmail}>{email}</Text>
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
                onPress={() =>
                  navigation.navigate("Комментарии", {
                    postId: item.id,
                    photo: item.photo,
                    userId: item.userId,
                  })
                }
              >
                <EvilIcons name="comment" size={24} color="#BDBDBD" />
                <Text style={styles.comments}>{item.comments?.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() =>
                  navigation.navigate("Карта", {
                    latitude: item.location.coords?.latitude,
                    longitude: item.location.coords?.longitude,
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
