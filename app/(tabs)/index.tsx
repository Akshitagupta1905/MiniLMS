import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState, useCallback, memo } from "react";
import { router } from "expo-router";
import { useCourseStore } from "../../store/courseStore";
import { useAuthStore } from "../../store/authStore";
import { Course } from "../../types";
import { COLORS } from "../../constants";

// Course Card - alag component taaki performance achi rahe
const CourseCard = memo(({ item }: { item: Course }) => {
  const { toggleBookmark } = useCourseStore();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
      }}
      onPress={() => router.push(`/course/${item.id}` as any)}
      activeOpacity={0.9}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: item.thumbnail }}
        style={{ width: "100%", height: 160 }}
        resizeMode="cover"
      />

      <View style={{ padding: 16 }}>
        {/* Category */}
        <View
          style={{
            backgroundColor: COLORS.primary + "20",
            borderRadius: 6,
            alignSelf: "flex-start",
            marginBottom: 8,
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
            {item.category}
          </Text>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: COLORS.black,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Instructor */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Image
            source={{ uri: item.instructorAvatar }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 13, color: COLORS.gray }}>
            {item.instructor}
          </Text>
        </View>

        {/* Price aur Bookmark */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            ₹{item.price}
          </Text>
          <TouchableOpacity
            onPress={() => toggleBookmark(item.id)}
            style={{
              padding: 8,
              backgroundColor: item.isBookmarked
                ? COLORS.primary + "20"
                : COLORS.lightGray,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {item.isBookmarked ? "🔖" : "🏷️"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function HomeScreen() {
  const { fetchCourses, isLoading, error, setSearchQuery, getFilteredCourses } =
    useCourseStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    setSearchQuery(text);
  };

  const filteredCourses = getFilteredCourses();

  if (isLoading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.gray }}>
          Loading Courses...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>😕</Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: COLORS.black,
            marginBottom: 8,
          }}
        >
         Something went wrong
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.gray,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
          onPress={fetchCourses}
        >
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
            Dobara Try Karo
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 16,
        }}
      >
        <Text style={{ fontSize: 14, color: COLORS.gray }}>
          Welcome 👋
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: COLORS.black,
            marginBottom: 16,
          }}
        >
          {user?.username || "Student"}
        </Text>

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: COLORS.background,
            borderRadius: 12,
            paddingHorizontal: 12,
       
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: COLORS.lightGray,
          }}
        >
          <Text style={{ marginRight: 8 }}>🔍</Text>
          <TextInput
            placeholder=" Search Course..."
            value={searchText}
            onChangeText={handleSearch}
            style={{ flex: 1, fontSize: 15, color: COLORS.black }}
          />
        </View>
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard item={item} />}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              marginTop: 60,
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.gray,
                textAlign: "center",
              }}
            >
             No Course found
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}