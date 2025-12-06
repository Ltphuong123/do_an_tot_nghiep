import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import { IntroPage1 } from "./intro/IntroPage1";
import { IntroPage2 } from "./intro/IntroPage2";
import { IntroPage3 } from "./intro/IntroPage3";
import { PageIndicator } from "./intro/PageIndicator";

// Màu sắc cho page indicator
const DOT_ACTIVE_COLOR = "#2134d8ff";
const DOT_INACTIVE_COLOR = "#0d83de81";

// Animation config
const ANIM_DURATION = 750;
const ANIM_STAGGER = 140;
const BASE_DELAY = 180;

export default function IntroScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [animationCycle, setAnimationCycle] = useState(0);

  const handleStart = async () => {
    router.replace("/auth/register");
  };

  const handleLogin = async () => {
    router.replace("/auth/login");
  };

  const renderPage = (pageIndex: number) => {
    const isActive = pageIndex === currentPage;
    const props = {
      isActive,
      animationCycle,
      animDuration: ANIM_DURATION,
      animStagger: ANIM_STAGGER,
      baseDelay: BASE_DELAY,
    };

    switch (pageIndex) {
      case 0:
        return <IntroPage1 {...props} />;
      case 1:
        return <IntroPage2 {...props} />;
      case 2:
        return (
          <IntroPage3 {...props} onStart={handleStart} onLogin={handleLogin} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <PagerView
        ref={pagerRef}
        style={{
          flex: 1,
          backgroundColor: "#000",
        }}
        initialPage={0}
        onPageSelected={(e) => {
          const newPage = e.nativeEvent.position;
          setCurrentPage(newPage);
          setAnimationCycle((prev) => prev + 1);
        }}
      >
        {renderPage(0)}
        {renderPage(1)}
        {renderPage(2)}
      </PagerView>

      <PageIndicator
        totalPages={3}
        currentPage={currentPage}
        activeColor={DOT_ACTIVE_COLOR}
        inactiveColor={DOT_INACTIVE_COLOR}
      />
    </View>
  );
}
