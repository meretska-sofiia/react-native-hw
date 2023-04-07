import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const initialState = {
  login: "",
  email: "",
  password: "",
};

export default function RegistartionScreen() {
  const [state, setState] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
    setState(initialState);
  };
  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;

      setDimensions(width);
    };
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);
  const [loaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container} onLayout={onLayoutRootView}>
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
                paddingBottom: isShowKeyboard ? 0 : 78,
              }}
            >
              <Text style={styles.formTitle}>Регистрация</Text>

              <View style={{ ...styles.inputContainer }}>
                <TextInput
                  value={state.login}
                  placeholder="Логин"
                  style={{ ...styles.input, width: dimensions }}
                  onFocus={() => setIsShowKeyboard(true)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
                <TextInput
                  value={state.email}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                  placeholder="Адрес электронной почты"
                  style={{
                    ...styles.input,
                    width: dimensions,
                  }}
                  onFocus={() => setIsShowKeyboard(true)}
                />
                <TextInput
                  value={state.password}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                  placeholder="Пароль"
                  secureTextEntry={showPassword ? false : true}
                  style={{ ...styles.passwordInput, width: dimensions }}
                  onFocus={() => setIsShowKeyboard(true)}
                />
                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Text style={styles.showPassword}>Показать</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={keyboardHide}
              >
                <Text style={styles.primaryButtonText}>Зарегистрироваться</Text>
              </TouchableOpacity>

              <TouchableOpacity>
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
    paddingVertical: 16,
  },
  inputContainer: {
    marginBottom: 43,
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
});
