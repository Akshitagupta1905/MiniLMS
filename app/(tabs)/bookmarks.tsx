import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useCourseStore } from "../../store/courseStore";
import { Course } from "../../types";
import { COLORS } from "../../constants";
import { memo } from "react";

const BookmarkCard = memo(({ item }: { item: Course }) => {
  const { toggleBookmark } = useCourseStore();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
onPress={() => router.push(`/course/${item.id}` as any)}    >
      <Image
        source={{ uri: item.thumbnail }}
        style={{ width: 100, height: 100 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, padding: 12 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: COLORS.black,
            marginBottom: 4,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.gray, marginBottom: 8 }}>
          {item.instructor}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            ₹{item.price}
          </Text>
          <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function BookmarksScreen() {
  const { courses, bookmarks } = useCourseStore();
  const bookmarkedCourses = courses.filter((c) => bookmarks.includes(c.id));

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
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: COLORS.black,
          }}
        >
          Bookmarks 🔖
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.gray, marginTop: 4 }}>
          {bookmarkedCourses.length} courses saved 
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={bookmarkedCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookmarkCard item={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>🔖</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.black,
                marginBottom: 8,
              }}
            >
             No Bookmark found
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.gray,
                textAlign: "center",
              }}
            >
            Go to Courses and bookmark them.            
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}