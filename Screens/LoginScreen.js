import React, { useState } from "react";
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
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";

export default function RegistartionScreen() {
  //   const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordHandler = (text) => setPassword(text);
  const emailHandler = (text) => setEmail(text);

  const onRegister = () => {
    Alert.alert("Credentials", `${login} + ${password}`);
  };

  //   const onLoginPress = () => {
  //     navigation.navigate("LoginScreen");
  //   };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require("../assets/bg.jpg")}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Войти</Text>
            <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  value={email}
                  onChangeText={emailHandler}
                  placeholder="Адрес электронной почты"
                  style={styles.input}
                />
                <TextInput
                  value={password}
                  onChangeText={passwordHandler}
                  placeholder="Пароль"
                  secureTextEntry={true}
                  type={showPassword ? "text" : "password"}
                  style={styles.passwordInput}
                />
              </View>
              <TouchableOpacity onPress={handlePasswordVisibility}>
                <Text style={styles.showPassword}>Показать</Text>
              </TouchableOpacity>
              <TouchableOpacity
                title="Зарегистрироваться"
                style={styles.primaryButton}
                onPress={onRegister}
              >
                <Text style={styles.primaryButtonText}>Войти</Text>
              </TouchableOpacity>

              <TouchableOpacity
                title={"Уже есть аккаунт? Войти"}
                //   onPress={onLoginPress}
              >
                <Text style={styles.secondaryButtonText}>
                  Нет аккаунта? Зарегистрироваться
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  form: {
    backgroundColor: "#fff",
    borderRadius: "25 25 0 0",
    alignItems: "center",
    flex: 0.67,
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingTop: 92,
    paddingBottom: 78,
    paddingLeft: 16,
    paddingRight: 16,
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
  },

  input: {
    backgroundColor: "#F6F6F6",
    width: 343,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginBottom: 16,
  },
  passwordInput: {
    position: "relative",
    marginBottom: 0,
    backgroundColor: "#F6F6F6",
    width: 343,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  showPassword: {
    position: "absolute",
    right: 16,
    bottom: 59,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 400,
    color: "#1B4371",
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
  },
  secondaryButtonText: {
    color: "#1B4371",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
  },
});
