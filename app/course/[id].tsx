import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCourseStore } from "../../store/courseStore";
import { COLORS } from "../../constants";
import { useState } from "react";
import CourseWebView from "../../components/CourseWebView";
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courses, toggleBookmark, toggleEnroll } = useCourseStore();
  const [showWebView, setShowWebView] = useState(false);

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>😕</Text>
        <Text style={{ fontSize: 16, color: COLORS.gray }}>
          Course nahi mila
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
            Wapas Jao
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleEnroll = () => {
    if (course.isEnrolled) {
      Alert.alert("Already Enrolled", "You are already enrolled!", [
        {
          text: "See Content",
          onPress: () => setShowWebView(true),
        },
        { text: "OK" },
      ]);
    } else {
      Alert.alert(
        "Enroll Now",
`Are you sure you want to enroll in "${course.title}"?`,
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes, Enroll Now!",
            onPress: () => {
              toggleEnroll(id);
              Alert.alert(
                "Congratulations! 🎉",
                "You are successfully enrolled!",
                [
                  {
                    text: "See Content ",
                    onPress: () => setShowWebView(true),
                  },
                  { text: "Later" },
                ]
              );
            },
          },
        ]
      );
    }
  };

  // WebView screen dikhao
  if (showWebView) {
    return <CourseWebView course={course} onBack={() => setShowWebView(false)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Thumbnail */}
        <View>
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: "100%", height: 250 }}
            resizeMode="cover"
          />
          {/* Back Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 48,
              left: 16,
              backgroundColor: COLORS.white,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
            onPress={() => router.back()}
          >
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 48,
              right: 16,
              backgroundColor: COLORS.white,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
            onPress={() => toggleBookmark(course.id)}
          >
            <Text style={{ fontSize: 18 }}>
              {course.isBookmarked ? "🔖" : "🏷️"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 24 }}>
          {/* Category Badge */}
          <View
            style={{
              backgroundColor: COLORS.primary + "20",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              alignSelf: "flex-start",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 12,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {course.category}
            </Text>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: COLORS.black,
              marginBottom: 16,
              lineHeight: 30,
            }}
          >
            {course.title}
          </Text>

          {/* Instructor Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <Image
              source={{ uri: course.instructorAvatar }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 12,
              }}
            />
            <View>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>
                Instructor
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: COLORS.black,
                }}
              >
                {course.instructor}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              justifyContent: "space-around",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20 }}>⭐</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: COLORS.black,
                }}
              >
                {course.rating}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>Rating</Text>
            </View>
            <View
              style={{ width: 1, backgroundColor: COLORS.lightGray }}
            />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20 }}>💰</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: COLORS.black,
                }}
              >
                ₹{course.price}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>Price</Text>
            </View>
            <View
              style={{ width: 1, backgroundColor: COLORS.lightGray }}
            />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20 }}>
                {course.isEnrolled ? "✅" : "🎓"}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: COLORS.black,
                }}
              >
                {course.isEnrolled ? "Enrolled" : "Open"}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>Status</Text>
            </View>
          </View>

          {/* Description */}
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 16,
              marginBottom: 100,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: COLORS.black,
                marginBottom: 8,
              }}
            >
              About Course
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.gray,
                lineHeight: 22,
              }}
            >
              {course.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Enroll Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.white,
          padding: 24,
          paddingBottom: 32,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: course.isEnrolled
              ? COLORS.success
              : COLORS.primary,
            borderRadius: 14,
            padding: 16,
            alignItems: "center",
          }}
          onPress={handleEnroll}
        >
          <Text
            style={{ color: COLORS.white, fontSize: 16, fontWeight: "bold" }}
          >
            {course.isEnrolled ? "✅ Enrolled - See Content" : "🎓 Enroll Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}