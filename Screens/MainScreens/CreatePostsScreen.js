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
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import PrimaryButton from "../../components/PrimaryButton";

import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const initialState = {
  imgDescr: "",
  photo: null,
};

const AddPostsScreen = ({ navigation }) => {
  const [state, setState] = useState(initialState);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  console.log("state", state);
  const onHandleSubmit = () => {
    navigation.navigate("Публикации", {
      photo: state.photo,
      imgDescr: state.imgDescr,
    });
    setState(initialState);
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync({
        pictureOrientation:
          Camera.Constants?.Orientation?.auto ??
          Camera.Constants?.PictureOrientation?.auto,
      });
      await MediaLibrary.createAssetAsync(uri);
      setState((prev) => ({ ...prev, photo: uri }));
      console.log(uri);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
    const onScreenSizeChange = () => {
      setScreenWidth(Dimensions.get("window").width - 16 * 2);
    };

    Dimensions.addEventListener("change", onScreenSizeChange);

    return () => {
      Dimensions.removeEventListener("change", onScreenSizeChange);
    };
  }, []);
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
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
                  width={screenWidth}
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
        <Text style={styles.uploudDescr}>Загрузите фото</Text>
        <TextInput
          value={state.imgDescr}
          placeholder="Название..."
          style={styles.imageTitle}
          onChangeText={(value) => {
            setState((prev) => ({ ...prev, imgDescr: value }));
          }}
        />
        <View style={styles.mapPinInputContainer}>
          <Feather
            name="map-pin"
            size={24}
            color="#BDBDBD"
            style={styles.mapPinIcon}
          />
          <TextInput placeholder="Местность..." style={styles.mapPinInput} />
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
    // borderWidth: 1,
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
