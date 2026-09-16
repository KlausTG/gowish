import { Platform, ToastAndroid } from "react-native";

export function showToast(message: string) {
  if (Platform.OS !== "android") return;

  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM
  );
}
