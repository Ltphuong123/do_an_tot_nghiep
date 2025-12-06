/**
 * Test Timer Component
 * Hiển thị đồng hồ đếm ngược cho bài thi
 */

import { useLanguageContext } from "@/contexts/languageContext";
import { formatTime, isTimeRunningOut } from "@/utils/test-helper";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface TestTimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  textColor: string;
  sectionName?: string;
  sectionIndex?: number;
  totalSections?: number;
}

const TestTimer = React.memo(
  ({
    timeRemaining,
    onTimeUp,
    isPaused = false,
    textColor,
    sectionName,
    sectionIndex,
    totalSections,
  }: TestTimerProps) => {
    const { t } = useLanguageContext();
    const [isWarning, setIsWarning] = useState(false);
    const hasCalledTimeUp = useRef(false);
    // console.log("TestTimer rendered with timeRemaining:", timeRemaining);

    useEffect(() => {
      if (timeRemaining <= 0 && !hasCalledTimeUp.current) {
        hasCalledTimeUp.current = true;
        onTimeUp();
        return;
      }

      if (timeRemaining > 0) {
        hasCalledTimeUp.current = false;
      }

      // Check if time is running out (last 5 minutes)
      setIsWarning(isTimeRunningOut(timeRemaining, 300));
    }, [timeRemaining, onTimeUp]);

    const formattedTime = formatTime(timeRemaining);
    const timerColor = isWarning ? "#ff4444" : textColor;

    return (
      <View style={{ alignItems: "center", marginTop: 25 }}>
        {sectionName && (
          <Text
            style={{
              fontSize: 12,
              color: textColor,
              opacity: 0.8,
              marginBottom: 4,
            }}
          >
            {sectionIndex !== undefined && totalSections !== undefined
              ? `${t("part")} ${sectionIndex + 1}/${totalSections}`
              : sectionName}
          </Text>
        )}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: timerColor,
            fontFamily: "monospace",
          }}
        >
          {formattedTime}
        </Text>
        {isPaused && (
          <Text
            style={{
              fontSize: 12,
              color: textColor,
              opacity: 0.7,
              marginTop: 2,
            }}
          >
            {t("paused")}
          </Text>
        )}
      </View>
    );
  }
);

TestTimer.displayName = "TestTimer";

export default TestTimer;
