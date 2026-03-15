import { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { notificationService } from "../services/notificationService";
import OfflineBanner from "../components/OfflineBanner";
import { View } from "react-native";

export default function RootLayout() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    notificationService.requestPermissions();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course/[id]" />
      </Stack>
    </View>
  );
}