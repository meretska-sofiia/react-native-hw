import React, { useCallback, useState } from "react";
import { useFonts } from "expo-font";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import Main from "./components/Main";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  const onLayoutRootViews = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main onLayoutRootView={onLayoutRootViews} />
    </Provider>
  );
}
