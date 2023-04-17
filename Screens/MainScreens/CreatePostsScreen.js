import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Keyboard,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";

import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

import { nanoid } from "nanoid";

import PrimaryButton from "../../components/PrimaryButton";

import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../../firebase/config";

const initialState = {
  imgDescr: "",
  photo: null,
  locationDescription: "",
  location: {},
};

const AddPostsScreen = ({ navigation }) => {
  const [state, setState] = useState(initialState);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("screen").width - 16 * 2
  );

  const { userId, login } = useSelector((state) => state.auth);

  const storage = getStorage(app);

  const takePhoto = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync({
        pictureOrientation:
          Camera.Constants?.Orientation?.auto ??
          Camera.Constants?.PictureOrientation?.auto,
      });
      await MediaLibrary.createAssetAsync(uri);
      setState((prev) => ({ ...prev, photo: uri }));
      const location = await Location.getCurrentPositionAsync();
      if (location) {
        setState((prev) => ({ ...prev, location }));
      }
    }
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const onHandleSubmit = async () => {
    const response = await fetch(state.photo);
    const blob = await response.blob();

    const imageId = Date.now().toString();
    const photoRef = ref(storage, `images/${imageId}`);

    await uploadBytes(photoRef, blob);
    const downloadURL = await getDownloadURL(photoRef);
    uploadPostsToServer(downloadURL);

    navigation.navigate("Публикации");

    setState(initialState);
  };

  const uploadPostsToServer = async (photoURL) => {
    const db = getFirestore(app);
    await setDoc(doc(db, "posts", nanoid()), {
      imgDescr: state.imgDescr,
      photo: photoURL,
      locationDescription: state.locationDescription,
      location: state.location,
      userId,
      login,
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
    const subscription = Dimensions.addEventListener("change", (screen) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            ref={(ref) => {
              setCameraRef(ref);
            }}
            type={type}
          >
            {state?.photo && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: state.photo }}
                  width={dimensions}
                  height={240}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={takePhoto}
            >
              <Fontisto name="camera" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flipIcon}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <MaterialCommunityIcons
                name="camera-flip"
                size={24}
                color="#BDBDBD"
              />
            </TouchableOpacity>
          </Camera>
        </View>
        {state.photo ? (
          <TouchableOpacity
            onPress={() => setState((prev) => ({ ...prev, photo: "" }))}
          >
            <Text style={styles.uploudDescr}>Редактировать фото</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.uploudDescr}>Загрузите фото</Text>
        )}

        <TextInput
          value={state.imgDescr}
          placeholder="Название..."
          style={styles.imageTitle}
          onChangeText={(value) => {
            setState((prev) => ({ ...prev, imgDescr: value }));
          }}
          onFocus={() => setIsShowKeyboard(true)}
        />
        <View style={styles.mapPinInputContainer}>
          <Feather
            name="map-pin"
            size={24}
            color="#BDBDBD"
            style={styles.mapPinIcon}
          />
          <TextInput
            value={state.locationDescription}
            onChangeText={(value) => {
              setState((prev) => ({ ...prev, locationDescription: value }));
            }}
            onFocus={() => setIsShowKeyboard(true)}
            placeholder="Местность..."
            style={styles.mapPinInput}
          />
        </View>
        <View style={styles.button}>
          <PrimaryButton text={"Опубликовать"} onPress={onHandleSubmit} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
  },
  cameraContainer: {
    height: 240,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 5,
    borderRadius: 8,
  },
  cameraIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#FFFFFF4D",
  },
  flipIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    borderColor: "#E8E8E8",
    borderRadius: 30,
    height: 240,
  },
  uploudDescr: {
    color: "#BDBDBD",
    marginTop: 8,
    fontSize: 16,
    lineHeight: 19,
  },
  imageTitle: {
    marginTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 19,
  },
  mapPinInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  mapPinInput: {
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 19,
    paddingLeft: 4,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
});

export default AddPostsScreen;
