import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../constants";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email aur password dono bharo");
      return;
    }

    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
behavior={Platform.OS === "ios" ? "padding" : undefined}    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 40 ,justifyContent:'center',alignItems:'center'}}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: COLORS.primary,
                marginBottom: 8,
              }}
            >
              MiniLMS 📚
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.gray }}>
              Welcome to Login Here!
            </Text>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: COLORS.black,
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <TextInput
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: COLORS.lightGray,
                color: COLORS.black,
              }}
              placeholder="apna@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: COLORS.black,
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <TextInput
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: COLORS.lightGray,
                color: COLORS.black,
              }}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Login Here
              </Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            style={{ marginTop: 24, alignItems: "center" }}
onPress={() => router.push("/register" as any)}          >
            <Text style={{ color: COLORS.gray, fontSize: 14 }}>
              No Account Login?{" "}
              <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                Register Here
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}