import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { app } from "../../firebase/config";
import {
  ref,
  deleteObject,
  getStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { authSignOutUser } from "../../redux/auth/authOperations";
import { updateUsersAvatar } from "../../redux/auth/authOperations";

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [usersPost, setUsersPost] = useState([]);
  const { photoURL, login, userId } = useSelector((state) => state.auth);

  const [dimensions, setDimensions] = useState(
    Dimensions.get("screen").width - 16 * 2
  );
  const dispatch = useDispatch();
  const storage = getStorage(app);

  async function getPostsWithComments() {
    const db = getFirestore(app);

    const postsWithComments = [];
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    for (const doc of querySnapshot.docs) {
      const post = { ...doc.data(), postId: doc.id };

      const commentsRef = collection(db, "posts", doc.id, "comments");
      const commentsQuery = query(commentsRef);

      const commentsSnapshot = await getDocs(commentsQuery);
      const comments = [];

      commentsSnapshot.forEach((commentDoc) => {
        const comment = commentDoc.data();
        comments.push(comment);
      });
      post.comments = comments;
      postsWithComments.push(post);
    }

    setUsersPost(postsWithComments);
    setIsLoading(true);
  }

  const deleteAvatarFromServer = () => {
    const decodedName = decodeURIComponent(photoURL);
    const fileRef = ref(storage, decodedName);
    deleteObject(fileRef)
      .then(() => {
        console.log("File deleted successfully");
        dispatch(updateUsersAvatar(""));
      })
      .catch((error) => {
        console.error("Error deleting file: ", error);
      });
  };

  const pickImageToServer = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets.length > 0) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        const imageId = Date.now().toString();
        const photoRef = ref(storage, `avatars/${imageId}`);

        await uploadBytes(photoRef, blob);
        getDownloadURL(photoRef).then((downloadURL) => {
          dispatch(updateUsersAvatar(downloadURL));
        });
      }
    }
  };

  useEffect(() => {
    getPostsWithComments();

    const subscription = Dimensions.addEventListener("change", (screen) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  }, [usersPost]);

  if (!isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="small" color="#FF6C00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require("../../assets/bg.jpg")}
      >
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => dispatch(authSignOutUser())}
            style={styles.logoutButton}
          >
            <MaterialIcons name="logout" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            {photoURL ? (
              <View>
                <Image
                  source={{ uri: photoURL }}
                  width={120}
                  height={120}
                  style={{ borderRadius: 16 }}
                />
                <TouchableOpacity
                  style={styles.deleteAvatarButton}
                  onPress={deleteAvatarFromServer}
                >
                  <AntDesign name="close" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImageToServer}
                style={styles.uploadAvatarButton}
              >
                <AntDesign name="plus" size={24} color="#FF6C00" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userNickName}>{login}</Text>
          <FlatList
            data={usersPost}
            keyExtractor={(item) => item.postId}
            style={{ marginBottom: 0 }}
            renderItem={({ item }) => (
              <View>
                <Image
                  source={{ uri: item.photo }}
                  width={dimensions}
                  height={240}
                  style={{ borderRadius: 8 }}
                />
                <Text style={styles.imgDescription}>{item.imgDescr}</Text>

                <View style={styles.locationContainer}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() =>
                      navigation.navigate("Комментарии", {
                        postId: item.postId,
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
                        latitude: item?.location.coords?.latitude,
                        longitude: item?.location.coords?.longitude,
                      })
                    }
                  >
                    <Feather name="map-pin" size={24} color="#BDBDBD" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  profileContainer: {
    flex: 0.8,
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    alignItems: "center",
    paddingTop: 92,

    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },
  uploadAvatarButton: {
    position: "absolute",
    bottom: 14,
    right: -17,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FF6C00",
    padding: 3,
  },
  deleteAvatarButton: {
    position: "absolute",
    bottom: 14,
    right: -17,
    borderRadius: 100,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderColor: "#BDBDBD",
    padding: 3,
  },
  logoutButton: {
    position: "absolute",
    top: 22,
    right: 16,
  },
  userNickName: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 1,
    color: "#212121",
    marginBottom: 32,
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

export default ProfileScreen;
