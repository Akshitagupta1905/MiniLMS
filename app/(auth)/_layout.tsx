import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

export default function AuthLayout() {
  const { isLoggedIn, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace("/(tabs)" as any);
    }
  }, [isLoggedIn, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}