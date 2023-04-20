import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import { app } from "../../firebase/config";
import PostCard from "../../components/PostCard";

const DefaultPostsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { photoURL, login, email } = useSelector((state) => state.auth);

  useEffect(() => {
    const db = getFirestore(app);
    const postsRef = collection(db, "posts");
    const unsubscribe = onSnapshot(postsRef, async (querySnapshot) => {
      const postsWithComments = [];
      for (const doc of querySnapshot.docs) {
        postsWithComments.push({ ...doc.data(), id: doc.id });
      }
      setPosts(postsWithComments);
      setIsLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
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
          <PostCard
            photo={item.photo}
            imgDescription={item.imgDescr}
            postId={item.id}
            userId={item.userId}
            location={item.location}
            locationDescription={item.locationDescription}
            navigation={navigation}
          />
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
});

export default DefaultPostsScreen;
