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

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

  try {
  await register(username.toLowerCase(), email, password);
  Alert.alert("Success", "Account created! Please login now.", [
    { text: "OK", onPress: () => router.replace("/login") },
  ]);
} catch (error: any) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    JSON.stringify(error.response?.data) ||
    "Something went wrong";
  Alert.alert("Register Failed", message);
}
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
behavior={Platform.OS === "ios" ? "padding" : undefined}    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
          {/* Header */}
          <View style={{ marginBottom: 40,justifyContent:'center',alignItems:'center'}}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: COLORS.primary,
                marginBottom: 8,
              }}
            >
               Create Account 🎓
            </Text>
           
          </View>

          {/* Username */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: COLORS.black,
                marginBottom: 8,
              }}
            >
              Username
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
              placeholder="Please enter your name"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
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

          {/* Password */}
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

          {/* Register Button */}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={handleRegister}
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            style={{ marginTop: 24, alignItems: "center" }}
            onPress={() => router.back()}
          >
            <Text style={{ color: COLORS.gray, fontSize: 14 }}>
             Already have an account?{" "}
              <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                Login 
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}