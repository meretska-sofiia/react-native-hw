import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import { MaterialIcons } from "@expo/vector-icons";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../../firebase/config";

const CommentScreen = ({ route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("screen").width - 16 * 2
  );
  const { photoURL, userId } = useSelector((state) => state.auth);
  const { postId, photo } = route.params;

  const formatingDate = (date) => {
    const dateObject = new Date(date.seconds * 1000);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "UTC",
      hourCycle: "h24",
      formatMatcher: "basic",
      timeSeparator: "|",
    };
    const formatter = new Intl.DateTimeFormat("ru-RU", options);
    const dateString = formatter.format(dateObject);
    return dateString;
  };

  const createPost = () => {
    keyboardHide();
    if (comment) {
      const db = getFirestore(app);
      const postsCollection = collection(db, "posts");
      const postRef = doc(postsCollection, postId);
      getDoc(postRef)
        .then((doc) => {
          if (doc.exists()) {
            const commentsCollection = collection(postRef, "comments");
            addDoc(commentsCollection, {
              text: comment,
              author: userId,
              authorAvatar: photoURL,
              createdAt: new Date(),
            });
          } else {
            console.log("Пост не найден");
          }
        })
        .catch((error) => {
          console.log("Ошибка получения документа поста: ", error);
        });
      setComment("");
    }
  };

  const getComments = async () => {
    const db = getFirestore(app);
    const commentsCollection = collection(db, "posts", postId, "comments");

    onSnapshot(
      query(commentsCollection, orderBy("createdAt", "asc")),
      (querySnapshot) => {
        const comments = [];
        for (const doc of querySnapshot.docs) {
          comments.push({
            id: doc.id,
            ...doc.data(),
          });
        }
        setAllComments(comments);
        setIsLoading(true);
      }
    );
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    getComments();

    const subscription = Dimensions.addEventListener("change", (screen) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  }, []);

  if (!isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="small" color="#FF6C00" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <Image
          source={{ uri: photo }}
          width={dimensions}
          style={{ height: 240, borderRadius: 8, marginBottom: 32 }}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={allComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  ...styles.commentPhotoContainer,
                  flexDirection: item.author !== userId ? "row" : "row-reverse",
                }}
              >
                <Image
                  source={{ uri: item?.authorAvatar }}
                  width={28}
                  height={28}
                  style={{
                    borderRadius: 100,
                  }}
                />
                <View
                  style={{
                    ...styles.commentContainer,
                    borderTopLeftRadius: item.author === userId ? 6 : 0,
                    borderTopRightRadius: item.author === userId ? 0 : 6,
                  }}
                >
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentCreatedAt}>
                    {formatingDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View
            style={{
              marginBottom: isShowKeyboard ? 100 : 16,
            }}
          >
            <TextInput
              value={comment}
              placeholder="Комментировать..."
              style={{
                ...styles.input,
                width: dimensions,
              }}
              onFocus={() => setIsShowKeyboard(true)}
              onBlur={() => setIsShowKeyboard(false)}
              onChangeText={(value) => setComment(value)}
            />
            <TouchableOpacity
              style={styles.iconSendContainer}
              onPress={createPost}
            >
              <MaterialIcons
                name="arrow-upward"
                size={14}
                color="#fff"
                style={styles.iconSend}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
  },
  iconSendContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    padding: 12,
  },
  commentPhotoContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 16,
  },
  commentContainer: {
    width: 299,
    backgroundColor: "#00000008",
    borderRadius: 6,
    padding: 16,
    marginBottom: 24,
  },
  commentText: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
  },
  commentCreatedAt: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    lineHeight: 12,
    color: "#BDBDBD",
    textAlign: "right",
  },
});

export default CommentScreen;
