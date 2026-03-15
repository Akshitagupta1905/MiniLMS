import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useState } from "react";
import { Course } from "../types";
import { COLORS } from "../constants";

interface Props {
  course: Course;
  onBack: () => void;
}

export default function CourseWebView({ course, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Course ka HTML content banao
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #F8F9FA;
          padding: 20px;
          color: #1A1A2E;
        }
        .header {
          background: linear-gradient(135deg, #6C63FF, #9C94FF);
          color: white;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 20px;
        }
        .header h1 { font-size: 20px; margin-bottom: 8px; }
        .header p { font-size: 14px; opacity: 0.9; }
        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .card h2 {
          font-size: 16px;
          color: #6C63FF;
          margin-bottom: 12px;
        }
        .card p {
          font-size: 14px;
          color: #6C757D;
          line-height: 1.6;
        }
        .badge {
          display: inline-block;
          background: #6C63FF20;
          color: #6C63FF;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: capitalize;
        }
        .lesson {
          background: #F8F9FA;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          font-size: 14px;
        }
        .lesson::before {
          content: "▶";
          color: #6C63FF;
          margin-right: 10px;
        }
        .price-tag {
          background: #28A74520;
          color: #28A745;
          font-size: 22px;
          font-weight: bold;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
        }
        .notify-btn {
          background: #6C63FF;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 16px;
          width: 100%;
          cursor: pointer;
          margin-top: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="badge" style="background: rgba(255,255,255,0.2); color: white;">
          ${course.category}
        </span>
        <h1>${course.title}</h1>
        <p>By ${course.instructor}</p>
      </div>

      <div class="card">
        <h2>📖 Course Description</h2>
        <p>${course.description}</p>
      </div>

      <div class="card">
        <h2>📚 Course Content</h2>
        <div class="lesson">Introduction to ${course.category}</div>
        <div class="lesson">Core Concepts & Fundamentals</div>
        <div class="lesson">Hands-on Practice</div>
        <div class="lesson">Advanced Topics</div>
        <div class="lesson">Final Project</div>
      </div>

      <div class="card">
        <h2>⭐ Rating</h2>
        <p>${'⭐'.repeat(Math.round(course.rating))} (${course.rating}/5)</p>
      </div>

      <div class="card">
        <div class="price-tag">₹${course.price}</div>
        <button class="notify-btn" onclick="notifyApp()">
          🔔 App Ko Notify Karo
        </button>
      </div>

      <script>
        function notifyApp() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'NOTIFY',
            message: 'WebView se message aaya!'
          }));
        }

        // Native app se message receive karo
        window.addEventListener('message', function(event) {
          try {
            var data = JSON.parse(event.data);
            if (data.type === 'ENROLLED') {
              document.querySelector('.header').style.background =
                'linear-gradient(135deg, #28A745, #5CB85C)';
            }
          } catch(e) {}
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "NOTIFY") {
        alert("WebView se message: " + data.message);
      }
    } catch (e) {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingTop: 52,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.lightGray,
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          style={{
            marginRight: 12,
            padding: 8,
            backgroundColor: COLORS.lightGray,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 16 }}>← </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: COLORS.black,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {course.title}
        </Text>
      </View>

      {/* Loading */}
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 8, color: COLORS.gray }}>
           Loading Content...
          </Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Text style={{ fontSize: 40, marginBottom: 12 }}>😕</Text>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.gray,
              textAlign: "center",
            }}
          >
            Content not load
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: COLORS.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
            onPress={() => setError(false)}
          >
            <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
              Dobara Try Karo
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* WebView */}
      {!error && (
        <WebView
          source={{ html: htmlContent }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          onMessage={handleMessage}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}