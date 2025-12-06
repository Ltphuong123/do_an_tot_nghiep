import AudioButton from "@/components/shared/audioButton";
import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { getColorAtived } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { ISubsection } from "@/types/mockTest.type";
import { pauseAudio, playRemoteAudio, stopAudio } from "@/utils/play_audio";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface SubsectionOverviewProps {
  subsection: ISubsection;
  sectionName: string;
  onStart: () => void;
  theme: "light" | "dark";
}

const SubsectionOverview: React.FC<SubsectionOverviewProps> = ({
  subsection,
  sectionName,
  onStart,
  theme,
}) => {
  const { t } = useLanguageContext();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [positionMs, setPositionMs] = useState<number>(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  console.log("subsection overview render: ", subsection);

  const handleAudio = async () => {
    if (isPlayingAudio) {
      await pauseAudio();
      setIsPlayingAudio(false);
      // pause animation
      animatedProgress.stopAnimation();
      return;
    }

    if (!subsection.audio_url) return;

    // Stop any current audio first to prevent overlap
    await stopAudio();

    // Reset progress state
    setDurationMs(0);
    setPositionMs(0);
    animatedProgress.setValue(0);

    // Set playing state immediately
    setIsPlayingAudio(true);

    // Start playing and subscribe to status updates
    await playRemoteAudio(
      subsection.audio_url,
      () => {
        setIsPlayingAudio(false);
        animatedProgress.setValue(1);
        animatedProgress.stopAnimation();
      },
      (status) => {
        if (status && (status as any).isLoaded) {
          const s = status as any;
          const dur = s.durationMillis || 0;
          const pos = s.positionMillis || 0;
          setDurationMs(dur);
          setPositionMs(pos);
          setIsPlayingAudio(!!s.isPlaying);

          // sync animated progress to playback position
          if (dur > 0) {
            const ratio = Math.min(1, pos / dur);
            animatedProgress.setValue(ratio);
          }
        }
      }
    );
  };

  useEffect(() => {
    return () => {
      // cleanup: stop audio when component unmounts
      stopAudio().catch(() => {});
    };
  }, []);

  // Stop any playing audio when component mounts
  useEffect(() => {
    stopAudio().catch(() => {});
  }, []);

  // Auto-play subsection audio when component mounts
  useEffect(() => {
    if (subsection.audio_url) {
      handleAudio();
    }
  }, []); // Empty dependency to run only on mount

  return (
    <ContainerCustom variant="background" scrollable={true}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Ionicons name="document-text" size={48} color="#2196F3" />
          <Text
            style={{
              fontSize: 30,
              fontWeight: "600",
              marginTop: 16,
              textAlign: "center",
              color: theme === "dark" ? "#ffffff" : "#000000",
            }}
          >
            {sectionName}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#2196F3",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            {subsection.name}
          </Text>
        </View>

        {/* Mô tả */}
        {subsection.description && (
          <CardCustom variant="card" style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              {t("description")}
            </Text>
            <HtmlRenderer
              htmlContent={
                typeof subsection.description === "string"
                  ? (() => {
                      try {
                        const parsed = JSON.parse(subsection.description);
                        return parsed.html || subsection.description;
                      } catch {
                        return subsection.description;
                      }
                    })()
                  : subsection.description.html
              }
              theme={theme}
              forceThemeColors={true}
            />
          </CardCustom>
        )}

        {/* Thông tin */}
        <CardCustom variant="card" style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 12,
            }}
          >
            {t("information")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon source="clipboard-list-outline" size={20} />
            <Text style={{ fontSize: 14, marginLeft: 8 }}>
              {t("numberOfQuestions")}: {subsection.questions.length}
            </Text>
          </View>
        </CardCustom>

        {/* Nút nghe hướng dẫn */}
        {subsection.audio_url && (
          <AudioButton
            onPress={handleAudio}
            isPlaying={isPlayingAudio}
            durationMs={durationMs}
            positionMs={positionMs}
            size={56}
            showDuration={true}
            strokeDashoffset={animatedProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [2 * Math.PI * 28, 0],
            })}
            colors={{
              border: isPlayingAudio ? "#FF9800" : "#2196F3",
              primary: "#2196F3",
              optionBg: "#E3F2FD",
              onPrimary: "#FFFFFF",
              text: "#666",
            }}
          />
        )}
      </View>

      {/* Start Button */}
      <View style={{ marginTop: 20 }}>
        <ButtonCustom
          startColors={getColorAtived(theme)}
          endColors={getColorAtived(theme)}
          title={t("startThisSection")}
          onPress={() => {
            stopAudio();
            onStart();
          }}
          textStyle={{ color: "#fff" }}
        />
      </View>
    </ContainerCustom>
  );
};

export default SubsectionOverview;
