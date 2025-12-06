import HomeIMGS from "@/assets/images/home";
import { ButtonCustom } from "@/components/shared/buttonCustom";
import { DesignSystem, getShadow } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { Text } from "react-native-paper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_HEIGHT = 180;
const AUTO_SCROLL_INTERVAL = 4500; // ms

const Banner = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const shadowStyle = getShadow(theme, "lg");

  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouched = useRef(false);
  const [containerWidth, setContainerWidth] = useState<number>(SCREEN_WIDTH);

  const slides = [
    {
      key: "ai",
      type: "image",
      image: HomeIMGS.banner_ai_feature,
      title: t("discoverAI"),
      subtitle: t("aiDesc"),
      cta: t("startNow"),
      onPress: () =>
        router.push({
          pathname: "/noteOrAi" as any,
          params: {
            activeView: "ai-lesson",
            timestamp: Date.now().toString(),
          },
        }),
    },
    {
      key: "sub",
      type: "image",
      title: t("upgradePro"),
      image: HomeIMGS.banner_subscription,
      subtitle: t("proDesc"),
      cta: t("subscribeNow"),
      onPress: () => router.push("/home/subscriptions"),
    },
    {
      key: "community",
      type: "image",
      title: t("joinCommunity"),
      image: HomeIMGS.banner_community,
      subtitle: t("communityDesc"),
      cta: t("explore"),
      onPress: () => router.push("/community" as any),
    },
  ];

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer.current = setTimeout(() => {
      if (isTouched.current) return startAutoScroll();
      const next = (activeIndex + 1) % slides.length;
      scrollToIndex(next);
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current as ReturnType<typeof setTimeout>);
      autoScrollTimer.current = null;
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const w = containerWidth || SCREEN_WIDTH;
    scrollRef.current.scrollTo({ x: index * w, animated: true });
    setActiveIndex(index);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const w = containerWidth || SCREEN_WIDTH;
    const idx = Math.round(x / w);
    setActiveIndex(idx);
  };

  const handleTouchStart = () => {
    isTouched.current = true;
    stopAutoScroll();
  };

  const handleTouchEnd = () => {
    isTouched.current = false;
    startAutoScroll();
  };

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w && w !== containerWidth) setContainerWidth(w);
      }}
      style={{ width: "100%", marginTop: DesignSystem.spacing.md }}
    >
      <View
        style={{
          position: "relative",
          borderRadius: DesignSystem.borderRadius.xl,
          overflow: "hidden",
          ...shadowStyle,
        }}
      >
        <ScrollView
          ref={(r: ScrollView | null) => {
            // assign ref without returning value to satisfy TS
            scrollRef.current = r;
          }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          onScrollBeginDrag={handleTouchStart}
          onScrollEndDrag={handleTouchEnd}
          scrollEventThrottle={16}
        >
          {slides.map((s) => (
            <View
              key={s.key}
              style={{
                width: containerWidth || SCREEN_WIDTH,
                height: SLIDE_HEIGHT,
              }}
            >
              <Image
                source={s.image}
                style={{
                  width: "100%",
                  height: SLIDE_HEIGHT,
                  resizeMode: "cover",
                }}
              />

              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: DesignSystem.spacing.md,
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    fontSize: DesignSystem.typography.fontSize.lg,
                    marginBottom: DesignSystem.spacing.xs,
                  }}
                >
                  {s.title}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: DesignSystem.typography.fontWeight.semibold,
                    fontSize: DesignSystem.typography.fontSize.base,
                    marginBottom: DesignSystem.spacing.md,
                  }}
                >
                  {s.subtitle}
                </Text>

                <ButtonCustom
                  title={s.cta}
                  onPress={s.onPress}
                  size="sm"
                  startColors="#1fc479ff"
                  endColors="#5739a3ff"
                  textStyle={{ color: "#fff" }}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Dots indicator */}
        <View
          style={{
            position: "absolute",
            bottom: DesignSystem.spacing.sm,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: DesignSystem.spacing.sm,
          }}
        >
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: activeIndex === i ? 18 : 8,
                height: 8,
                borderRadius: 8,
                backgroundColor:
                  activeIndex === i
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Banner;
