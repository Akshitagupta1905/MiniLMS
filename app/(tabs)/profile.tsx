import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useCourseStore } from "../../store/courseStore";
import { COLORS } from "../../constants";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { bookmarks, enrolledCourses, courses } = useCourseStore();
  const [uploading, setUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [showCourses, setShowCourses] = useState(false);

  useEffect(() => {
    const loadSavedPhoto = async () => {
      const saved = await AsyncStorage.getItem("profile_picture");
      if (saved) setLocalAvatar(saved);
    };
    loadSavedPhoto();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login" as any);
        },
      },
    ]);
  };

  const handleProfilePicture = () => {
    Alert.alert("Profile Picture", "Where do you want to get it from?", [
      { text: "Cancel", style: "cancel" },
      { text: "📷 Camera", onPress: () => openCamera() },
      { text: "🖼️ Gallery", onPress: () => openGallery() },
    ]);
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission chahiye", "Camera use karne ki permission do");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) saveProfilePicture(result.assets[0].uri);
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission chahiye", "Gallery access karne ki permission do");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) saveProfilePicture(result.assets[0].uri);
  };

  const saveProfilePicture = async (uri: string) => {
    setUploading(true);
    try {
      await AsyncStorage.setItem("profile_picture", uri);
      setLocalAvatar(uri);
      Alert.alert("Success! 🎉", "Profile picture updated!");
    } catch (error) {
      Alert.alert("Error", "Picture not save");
    } finally {
      setUploading(false);
    }
  };

  const handleNotifications = () => {
    if (bookmarks.length >= 5) {
      Alert.alert(
        "Notifications 🔔",
        `You have bookmarked ${bookmarks.length} courses! 🎉\nNotification has already been sent!`
      );
    } else {
      Alert.alert(
        "Notifications 🔔",
        `You currently have ${bookmarks.length} bookmarks.\n${
          5 - bookmarks.length
        } more to get a notification! 📚`
      );
    }
  };

  const enrolledCoursesList = courses.filter((c) =>
    enrolledCourses.includes(c.id)
  );

  // Progress calculate karo
  const totalCourses = courses.length;
  const enrolledCount = enrolledCourses.length;
  const progressPercent =
    totalCourses > 0 ? Math.round((enrolledCount / totalCourses) * 100) : 0;

  const avatarUri = localAvatar || user?.avatar?.url || null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: COLORS.primary,
          paddingTop: 60,
          paddingBottom: 40,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleProfilePicture}
          style={{ position: "relative", marginBottom: 12 }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: COLORS.white,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              borderWidth: 3,
              borderColor: COLORS.white,
            }}
          >
            {uploading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 90, height: 90 }}
              />
            ) : (
              <Text style={{ fontSize: 40 }}>👤</Text>
            )}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: COLORS.secondary,
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: COLORS.white,
            }}
          >
            <Text style={{ fontSize: 12 }}>✏️</Text>
          </View>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: COLORS.white,
            marginBottom: 4,
          }}
        >
          {user?.username || "Student"}
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.white + "CC" }}>
          {user?.email}
        </Text>
        <Text
          style={{ fontSize: 12, color: COLORS.white + "99", marginTop: 4 }}
        >
          Tap to change profile 
        </Text>
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.white,
          marginHorizontal: 24,
          marginTop: -20,
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            {enrolledCount}
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>
            Enrolled
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: COLORS.lightGray }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: COLORS.secondary,
            }}
          >
            {bookmarks.length}
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>
            Bookmarks
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: COLORS.lightGray }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: COLORS.success,
            }}
          >
            {progressPercent}%
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>
            Progress
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          backgroundColor: COLORS.white,
          marginHorizontal: 24,
          marginTop: 16,
          borderRadius: 16,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{ fontSize: 14, fontWeight: "600", color: COLORS.black }}
          >
            Overall Progress
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: "bold" }}>
            {enrolledCount}/{totalCourses} Courses
          </Text>
        </View>

        {/* Progress Bar Background */}
        <View
          style={{
            backgroundColor: COLORS.lightGray,
            borderRadius: 8,
            height: 12,
            overflow: "hidden",
          }}
        >
          {/* Progress Fill */}
          <View
            style={{
              backgroundColor: COLORS.primary,
              height: 12,
              borderRadius: 8,
              width: `${progressPercent}%`,
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 12,
            color: COLORS.gray,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {progressPercent === 0
            ? "No courses enrolled yet. 😕"
            : progressPercent === 100
            ? "Wow! You've enrolled in all the courses! 🎉"
            : `${totalCourses - enrolledCount} remaining courses! 💪`}
        </Text>
      </View>

      {/* Menu Items */}
      <View
        style={{
          backgroundColor: COLORS.white,
          marginHorizontal: 24,
          marginTop: 16,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Mere Courses */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.lightGray,
          }}
          onPress={() => setShowCourses(!showCourses)}
        >
          <Text style={{ fontSize: 20, marginRight: 12 }}>📚</Text>
          <Text
            style={{
              fontSize: 15,
              color: COLORS.black,
              fontWeight: "500",
              flex: 1,
            }}
          >
            My Courses
          </Text>
          <Text style={{ color: COLORS.gray }}>
            {showCourses ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {/* Courses Dropdown */}
        {showCourses && (
          <View
            style={{
              backgroundColor: COLORS.background,
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.lightGray,
            }}
          >
            {enrolledCoursesList.length === 0 ? (
              <Text
                style={{
                  color: COLORS.gray,
                  textAlign: "center",
                  padding: 16,
                  fontSize: 14,
                }}
              >
                No courses enrolled yet 😕{"\n"}Go to Courses and enroll them!
              </Text>
            ) : (
              enrolledCoursesList.map((course, index) => (
                <View
                  key={course.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderBottomWidth:
                      index < enrolledCoursesList.length - 1 ? 1 : 0,
                    borderBottomColor: COLORS.lightGray,
                  }}
                >
                  <Image
                    source={{ uri: course.thumbnail }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: COLORS.black,
                      }}
                      numberOfLines={1}
                    >
                      {course.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.gray }}>
                      {course.instructor}
                    </Text>
                  </View>
                  <Text style={{ color: COLORS.success, fontSize: 12 }}>
                    ✅
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* Notifications */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
          }}
          onPress={handleNotifications}
        >
          <Text style={{ fontSize: 20, marginRight: 12 }}>🔔</Text>
          <Text
            style={{
              fontSize: 15,
              color: COLORS.black,
              fontWeight: "500",
              flex: 1,
            }}
          >
            Notifications
          </Text>
          {bookmarks.length >= 5 && (
            <View
              style={{
                backgroundColor: COLORS.error,
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginRight: 8,
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: 12 }}>
                {bookmarks.length}
              </Text>
            </View>
          )}
          <Text style={{ color: COLORS.gray }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.error + "15",
          marginHorizontal: 24,
          marginTop: 24,
          marginBottom: 40,
          borderRadius: 16,
          padding: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
        onPress={handleLogout}
      >
        <Ionicons
          name="power"
          size={22}
          color={COLORS.error}
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            color: COLORS.error,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}