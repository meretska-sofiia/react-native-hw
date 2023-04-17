import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import PrimaryButton from "../components/PrimaryButton";
import { AntDesign } from "@expo/vector-icons";
import { authSignUpUser } from "../redux/auth/authOperations";

import { app } from "../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const initialState = {
  login: "",
  userEmail: "",
  password: "",
  avatar: "",
};

export default function RegistartionScreen({ navigation }) {
  const [userAvatar, setUserAvatar] = useState("");
  const [state, setState] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const dispatch = useDispatch();
  const storage = getStorage(app);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async () => {
    keyboardHide();

    dispatch(authSignUpUser(state));
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserAvatar(result.assets[0].uri);

      if (result.assets.length > 0) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        const imageId = Date.now().toString();
        const photoRef = ref(storage, `avatars/${imageId}`);

        await uploadBytes(photoRef, blob);
        const downloadURL = await getDownloadURL(photoRef);

        setState((prevState) => ({
          ...prevState,
          avatar: downloadURL,
        }));
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require("../assets/bg.jpg")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View
              style={{
                ...styles.form,
                paddingBottom: isShowKeyboard ? 20 : 78,
              }}
            >
              <View style={styles.avatarContainer}>
                {userAvatar ? (
                  <Image
                    source={{ uri: userAvatar }}
                    width={120}
                    height={120}
                    style={{ borderRadius: 16 }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.uploadAvatarButton}
                  >
                    <AntDesign name="plus" size={24} color="#FF6C00" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.formTitle}>Регистрация</Text>

              <View style={{ ...styles.inputContainer }}>
                <TextInput
                  value={state.login}
                  placeholder="Логин"
                  style={styles.input}
                  onFocus={() => setIsShowKeyboard(true)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
                <TextInput
                  value={state.userEmail}
                  onChangeText={(value) =>
                    setState((prevState) => ({
                      ...prevState,
                      userEmail: value,
                    }))
                  }
                  placeholder="Адрес электронной почты"
                  style={styles.input}
                  onFocus={() => setIsShowKeyboard(true)}
                />
                <TextInput
                  value={state.password}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                  placeholder="Пароль"
                  secureTextEntry={showPassword ? false : true}
                  style={styles.passwordInput}
                  onFocus={() => setIsShowKeyboard(true)}
                />
                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Text style={styles.showPassword}>Показать</Text>
                </TouchableOpacity>
              </View>
              <PrimaryButton text={"Зарегистрироваться"} onPress={onSubmit} />

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.secondaryButtonText}>
                  Уже есть аккаунт? Войти
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },

  form: {
    backgroundColor: "#fff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    alignItems: "center",
    paddingTop: 92,
    paddingBottom: 78,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 43,
    width: "100%",
  },
  formTitle: {
    fontWeight: 500,
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.16,
    color: "#212121",
    marginBottom: 32,
    fontFamily: "Roboto-Medium",
  },

  input: {
    backgroundColor: "#F6F6F6",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginBottom: 16,
    fontFamily: "Roboto-Regular",
  },
  passwordInput: {
    position: "relative",
    marginBottom: 0,
    backgroundColor: "#F6F6F6",
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
  },
  showPassword: {
    position: "absolute",
    right: 16,
    bottom: 16,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 400,
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
  },
  primaryButton: {
    backgroundColor: "#FF6C00",
    width: 343,
    borderRadius: 100,
    paddingVertical: 16,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  secondaryButtonText: {
    color: "#1B4371",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
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
});
