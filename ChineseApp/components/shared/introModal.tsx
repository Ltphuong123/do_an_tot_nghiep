import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Dimensions, ImageBackground, View } from "react-native";
import PagerView from "react-native-pager-view";
import {
  Button,
  Icon,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const CatDark = require("@/assets/images/background1.jpg");
const CatLight = require("@/assets/images/background2.jpg");

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface IntroModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({
  visible,
  onDismiss,
}) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [animationCycle, setAnimationCycle] = useState(0);

  const ANIM_DURATION = 750; // ms
  const ANIM_STAGGER = 140; // ms between sequential items
  const BASE_DELAY = 180; // initial delay before first element

  // Helper creators for slower fade animations
  const slowFadeDown = (delay: number) =>
    FadeInDown.duration(ANIM_DURATION).delay(delay);
  const slowFadeUp = (delay: number) =>
    FadeInUp.duration(ANIM_DURATION).delay(delay);

  const handleStart = async () => {
    await SecureStore.setItemAsync("hasSeenIntro", "true");
    onDismiss();
    router.replace("/auth/register");
  };

  const handleLogin = async () => {
    await SecureStore.setItemAsync("hasSeenIntro", "true");
    onDismiss();
    router.replace("/auth/login");
  };

  const renderPage = (pageIndex: number) => {
    const isDark = theme.dark;
    const textColor = Colors[isDark ? "dark" : "light"].text;
    const backgroundColor = Colors[isDark ? "dark" : "light"].background;

    switch (pageIndex) {
      case 0:
        return (
          <ImageBackground
            source={CatDark}
            resizeMode="cover"
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "flex-start",
            }}
            imageStyle={{ borderRadius: 12 }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
              style={{ flex: 1, borderRadius: 12 }}
            >
              <Animated.View
                key={`p0-header-${animationCycle}`}
                entering={
                  pageIndex === currentPage
                    ? slowFadeDown(BASE_DELAY)
                    : undefined
                }
                style={{ marginTop: 50, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontSize: 42,
                    fontWeight: "800",
                    color: "#FFFFFF",
                    letterSpacing: 4,
                  }}
                >
                  ECHINSE
                </Text>
              </Animated.View>
              <Animated.View
                key={`p0-lines-${animationCycle}`}
                entering={
                  pageIndex === currentPage
                    ? slowFadeUp(BASE_DELAY + ANIM_STAGGER)
                    : undefined
                }
                style={{ flex: 1, alignItems: "center", marginTop: 70 }}
              >
                {[
                  "Học tiếng Trung thông minh.",
                  "Cá nhân hóa theo bạn.",
                  "Cộng đồng năng động.",
                ].map((line, idx) => (
                  <Animated.Text
                    key={`p0-line-${animationCycle}-${idx}`}
                    entering={
                      pageIndex === currentPage
                        ? slowFadeUp(
                            BASE_DELAY + ANIM_STAGGER * 2 + idx * ANIM_STAGGER
                          )
                        : undefined
                    }
                    style={{
                      fontSize: 18,
                      color: "#FFFFFF",
                      fontWeight: "600",
                      textAlign: "center",
                      marginVertical: 4,
                    }}
                  >
                    {line}
                  </Animated.Text>
                ))}
              </Animated.View>
            </LinearGradient>
          </ImageBackground>
        );
      case 1:
        return (
          <ImageBackground
            source={CatLight}
            resizeMode="cover"
            style={{ flex: 1, width: "100%", justifyContent: "flex-start" }}
            imageStyle={{ borderRadius: 12 }}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.85)",
                "rgba(255,255,255,0.6)",
                "rgba(255,255,255,0.9)",
              ]}
              style={{ flex: 1, padding: 24, borderRadius: 12 }}
            >
              <Animated.View
                key={`p1-content-${animationCycle}`}
                entering={
                  pageIndex === currentPage
                    ? slowFadeDown(BASE_DELAY)
                    : undefined
                }
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingTop: screenHeight * 0.1,
                }}
              >
                <Animated.Text
                  key={`p1-h1-${animationCycle}`}
                  entering={
                    pageIndex === currentPage
                      ? slowFadeDown(BASE_DELAY + ANIM_STAGGER)
                      : undefined
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
                    pageIndex === currentPage
                      ? slowFadeDown(BASE_DELAY + ANIM_STAGGER * 2)
                      : undefined
                  }
                  style={{
                    fontSize: 16,
                    color: "#333",
                    textAlign: "center",
                    lineHeight: 22,
                    marginBottom: 16,
                  }}
                >
                  Ôn tập thông minh • Từ vựng chuẩn • Luyện thi dễ dàng
                </Animated.Text>
                <Animated.Text
                  key={`p1-cta-${animationCycle}`}
                  entering={
                    pageIndex === currentPage
                      ? slowFadeUp(BASE_DELAY + ANIM_STAGGER * 3)
                      : undefined
                  }
                  style={{ fontSize: 14, color: "#555", fontStyle: "italic" }}
                >
                  Vuốt sang để tiếp tục ➜
                </Animated.Text>
              </Animated.View>
              <Animated.View
                key={`p1-bottom-${animationCycle}`}
                entering={
                  pageIndex === currentPage
                    ? slowFadeUp(BASE_DELAY + ANIM_STAGGER * 4)
                    : undefined
                }
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                }}
              >
                <Animated.Text
                  key={`p1-brand-${animationCycle}`}
                  entering={
                    pageIndex === currentPage
                      ? slowFadeUp(BASE_DELAY + ANIM_STAGGER * 5)
                      : undefined
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
                    pageIndex === currentPage
                      ? slowFadeUp(BASE_DELAY + ANIM_STAGGER * 6)
                      : undefined
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
      case 2:
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              backgroundColor,
            }}
          >
            <Animated.View
              key={`p2-icon-${animationCycle}`}
              entering={
                pageIndex === currentPage ? slowFadeDown(BASE_DELAY) : undefined
              }
              style={{ marginBottom: 70 }}
            >
              <Icon source="rocket-launch" size={64} color="#F00" />
            </Animated.View>
            <Animated.Text
              key={`p2-title-${animationCycle}`}
              entering={
                pageIndex === currentPage
                  ? slowFadeUp(BASE_DELAY + ANIM_STAGGER)
                  : undefined
              }
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 16,
                textAlign: "center",
                color: textColor,
              }}
            >
              Bắt đầu hành trình học tập!
            </Animated.Text>
            <Animated.Text
              key={`p2-desc-${animationCycle}`}
              entering={
                pageIndex === currentPage
                  ? slowFadeUp(BASE_DELAY + ANIM_STAGGER * 2)
                  : undefined
              }
              style={{
                fontSize: 16,
                marginBottom: 24,
                textAlign: "center",
                lineHeight: 24,
                color: textColor,
              }}
            >
              Hãy đăng ký tài khoản để trải nghiệm đầy đủ các tính năng của
              ChineseApp.
            </Animated.Text>
            <View style={{ width: "100%", gap: 12 }}>
              <Button
                mode="contained"
                onPress={handleStart}
                style={{ width: "100%" }}
              >
                Bắt đầu
              </Button>
              <Button
                mode="outlined"
                onPress={handleLogin}
                style={{ width: "100%" }}
              >
                Tôi đã có tài khoản
              </Button>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // Indicators inlined in JSX; helper removed.

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{
          padding: 20,
          margin: 20,
          alignItems: "center",
        }}
      >
        <View
          style={[
            {
              borderRadius: 30,
              alignItems: "center",
              elevation: 5,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              backgroundColor: Colors[theme.dark ? "dark" : "light"].background,
              shadowColor: Colors[theme.dark ? "dark" : "light"].text,
              overflow: "hidden",
              width: screenWidth * 0.95,
            },
          ]}
        >
          <PagerView
            style={{ height: 600, width: "100%" }}
            initialPage={0}
            onPageSelected={(e) => {
              const newPage = e.nativeEvent.position;
              setCurrentPage(newPage);
              // Only cycle when active page changes
              setAnimationCycle((prev) => prev + 1);
            }}
          >
            {renderPage(0)}
            {renderPage(1)}
            {renderPage(2)}
          </PagerView>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor:
                  index === currentPage
                    ? Colors[theme.dark ? "dark" : "light"].text
                    : Colors[theme.dark ? "dark" : "light"].text + "40",
              }}
            />
          ))}
        </View>
      </Modal>
    </Portal>
  );
};

// Converted to inline styles; removed StyleSheet usage.
