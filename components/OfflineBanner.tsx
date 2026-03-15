import { View, Text, Animated, } from "react-native";
import { useNetwork } from "../store/useNetwork";
import { COLORS } from "../constants";
import { useEffect as useReactEffect, useRef as useReactRef } from "react";
import { Animated as RNAnimated } from "react-native";

export default function OfflineBanner() {
  const { isConnected } = useNetwork();
  const slideAnim = useReactRef(new RNAnimated.Value(-60)).current;

  useReactEffect(() => {
    if (!isConnected) {
      RNAnimated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.spring(slideAnim, {
        toValue: -60,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected]);

  return (
    <RNAnimated.View
      style={{
        position: "absolute",
        top: -20,
        left: 0,
        right: 0,
        zIndex: 999,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.error,
          paddingVertical: 10,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 48,
        
        }}
      >
        <Text style={{ fontSize: 16, marginRight: 8 }}>📵</Text>
        <Text
          style={{
            color: COLORS.white,
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          Internet nahi hai - Offline Mode
        </Text>
      </View>
    </RNAnimated.View>
  );
}