import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, ImageBackground } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const CatLight = require("@/assets/images/background2.jpg");
const screenHeight = Dimensions.get("window").height;

interface IntroPage2Props {
  isActive: boolean;
  animationCycle: number;
  animDuration: number;
  animStagger: number;
  baseDelay: number;
}

export const IntroPage2: React.FC<IntroPage2Props> = ({
  isActive,
  animationCycle,
  animDuration,
  animStagger,
  baseDelay,
}) => {
  const slowFadeDown = (delay: number) =>
    FadeInDown.duration(animDuration).delay(delay);
  const slowFadeUp = (delay: number) =>
    FadeInUp.duration(animDuration).delay(delay);

  return (
    <ImageBackground
      source={CatLight}
      resizeMode="cover"
      style={{ 
        flex: 1, 
        width: "100%", 
        backgroundColor: "#000",
        justifyContent: "flex-start" 
      }}
    >
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.85)",
          "rgba(255,255,255,0.6)",
          "rgba(255,255,255,0.9)",
        ]}
        style={{ flex: 1, padding: 24 }}
      >
        {/* Main content */}
        <Animated.View
          key={`p1-content-${animationCycle}`}
          entering={isActive ? slowFadeDown(baseDelay) : undefined}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingTop: screenHeight * 0.3,
          }}
        >
          <Animated.Text
            key={`p1-h1-${animationCycle}`}
            entering={
              isActive ? slowFadeDown(baseDelay + animStagger) : undefined
            }
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#111",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Khai mở tri thức mỗi ngày
          </Animated.Text>
          <Animated.Text
            key={`p1-p-${animationCycle}`}
            entering={
              isActive ? slowFadeDown(baseDelay + animStagger * 2) : undefined
            }
            style={{
              fontSize: 16,
              color: "#333",
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 16,
            }}
          >
            Ôn tập thông minh - Từ vựng chuẩn - Luyện thi dễ dàng
          </Animated.Text>
          <Animated.Text
            key={`p1-cta-${animationCycle}`}
            entering={
              isActive ? slowFadeUp(baseDelay + animStagger * 3) : undefined
            }
            style={{ fontSize: 14, color: "#555", fontStyle: "italic" }}
          >
            Vuốt sang để tiếp tục ➜
          </Animated.Text>
        </Animated.View>

        {/* Bottom branding */}
        <Animated.View
          key={`p1-bottom-${animationCycle}`}
          entering={
            isActive ? slowFadeUp(baseDelay + animStagger * 4) : undefined
          }
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Animated.Text
            key={`p1-brand-${animationCycle}`}
            entering={
              isActive ? slowFadeUp(baseDelay + animStagger * 5) : undefined
            }
            style={{
              fontSize: 42,
              fontWeight: "800",
              color: "#111",
              letterSpacing: 4,
            }}
          >
            ECHINSE
          </Animated.Text>
          <Animated.Text
            key={`p1-bottomLead-${animationCycle}`}
            entering={
              isActive ? slowFadeUp(baseDelay + animStagger * 6) : undefined
            }
            style={{
              fontSize: 16,
              color: "#222",
              marginTop: 6,
              fontWeight: "600",
            }}
          >
            Bắt đầu ngay hôm nay!
          </Animated.Text>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
};
