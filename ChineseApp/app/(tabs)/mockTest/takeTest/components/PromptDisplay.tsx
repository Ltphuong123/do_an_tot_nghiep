import AudioButton from "@/components/shared/audioButton";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { useThemeContext } from "@/contexts/themeContext";
import { IPrompt } from "@/types/mockTest.type";
import { pauseAudio, playRemoteAudio, stopAudio } from "@/utils/play_audio";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";
import { Text } from "react-native-paper";

interface PromptDisplayProps {
  prompt: IPrompt;
  colors: any;
  autoPlayStatus?: {
    isPlaying: boolean;
    durationMs: number;
    positionMs: number;
  };
  autoPlayProgress?: Animated.Value;
}

const PromptDisplay: React.FC<PromptDisplayProps> = React.memo(
  ({ prompt, colors, autoPlayStatus, autoPlayProgress }) => {
    const { theme } = useThemeContext();
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [durationMs, setDurationMs] = useState<number>(0);
    const [positionMs, setPositionMs] = useState<number>(0);
    const animatedProgress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      return () => {
        // cleanup: stop audio when component unmounts
        stopAudio().catch(() => {});
      };
    }, []);

    // Early return after hooks if prompt is completely empty
    const hasContent = prompt.content?.html?.trim();
    const hasSingleImage = prompt.image?.url;
    const hasImageList = prompt.image?.images && prompt.image.images.length > 0;
    const hasAudio = prompt.audio_url;

    if (
      !prompt ||
      (!hasContent && !hasSingleImage && !hasImageList && !hasAudio)
    ) {
      console.log("PromptDisplay: Prompt is empty, not rendering");
      return null;
    }

    const handleAudio = async () => {
      if (autoPlayStatus?.isPlaying) return; // Prevent manual control during auto-play

      if (isPlayingAudio) {
        await pauseAudio();
        setIsPlayingAudio(false);
        animatedProgress.stopAnimation();
        return;
      }

      if (!prompt.audio_url) return;

      // Dừng hoàn toàn âm thanh cũ trước khi phát mới
      await stopAudio();

      // Reset progress state
      setDurationMs(0);
      setPositionMs(0);
      animatedProgress.setValue(0);

      // Set playing state immediately
      setIsPlayingAudio(true);

      // Start playing and subscribe to status updates
      await playRemoteAudio(
        String(prompt.audio_url),
        () => {
          setIsPlayingAudio(false);
          animatedProgress.setValue(1);
          animatedProgress.stopAnimation();
        },
        (status: any) => {
          if (status && status.isLoaded) {
            const dur = status.durationMillis || 0;
            const pos = status.positionMillis || 0;
            setDurationMs(dur);
            setPositionMs(pos);
            setIsPlayingAudio(!!status.isPlaying);

            // sync animated progress to playback position
            if (dur > 0 && status.isPlaying) {
              const ratio = Math.min(1, pos / dur);
              animatedProgress.setValue(ratio);
            }
          }
        }
      );
    };

    return (
      <View
        style={{
          marginBottom: 20,
          padding: 16,
          borderRadius: 12,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Prompt content */}
        {prompt.content?.html && prompt.content.html.trim() && (
          <View style={{ marginBottom: 12 }}>
            <HtmlRenderer htmlContent={prompt.content.html} theme={theme} />
          </View>
        )}

        {/* Prompt images - handle both single image and image list */}
        {prompt.image?.url && (
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Image
              source={{ uri: prompt.image.url }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 8,
                backgroundColor: colors.border,
              }}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Handle images array for image_list type prompts */}
        {prompt.image?.images && prompt.image.images.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent:
                  prompt.image.images.length === 1 ? "center" : "space-between",
                gap: 8,
              }}
            >
              {prompt.image.images.map(
                (
                  img: { url: string; label: string; type: string },
                  index: number
                ) => {
                  const itemWidth =
                    prompt.image!.images!.length === 1
                      ? "80%"
                      : prompt.image!.images!.length === 2
                      ? "48%"
                      : prompt.image!.images!.length === 3
                      ? "30%"
                      : prompt.image!.images!.length === 4
                      ? "48%"
                      : "30%";

                  return (
                    <View
                      key={index}
                      style={{
                        width: itemWidth,
                        marginBottom: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: colors.text,
                          marginBottom: 4,
                        }}
                      >
                        {img.label}
                      </Text>
                      <Image
                        source={{ uri: img.url }}
                        style={{
                          width: "100%",
                          height:
                            prompt.image!.images!.length === 1 ? 200 : 120,
                          borderRadius: 8,
                          backgroundColor: colors.border,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* Handle legacy images array (fallback) */}
        {!prompt.image?.images && prompt.images && prompt.images.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent:
                  prompt.images.length === 1 ? "center" : "space-between",
                gap: 8,
              }}
            >
              {prompt.images.map(
                (
                  img: { url: string; label: string; type: string },
                  index: number
                ) => {
                  const itemWidth =
                    prompt.images!.length === 1
                      ? "80%"
                      : prompt.images!.length === 2
                      ? "48%"
                      : prompt.images!.length === 3
                      ? "30%"
                      : prompt.images!.length === 4
                      ? "48%"
                      : "30%";

                  return (
                    <View
                      key={index}
                      style={{
                        width: itemWidth,
                        marginBottom: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: colors.text,
                          marginBottom: 4,
                        }}
                      >
                        {img.label}
                      </Text>
                      <Image
                        source={{ uri: img.url }}
                        style={{
                          width: "100%",
                          height: prompt.images!.length === 1 ? 200 : 120,
                          borderRadius: 8,
                          backgroundColor: colors.border,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* Audio button for prompt */}
        {prompt.audio_url && (
          <AudioButton
            onPress={handleAudio}
            isPlaying={autoPlayStatus?.isPlaying || false || isPlayingAudio}
            durationMs={autoPlayStatus?.durationMs || durationMs}
            positionMs={autoPlayStatus?.positionMs || positionMs}
            size={56}
            showDuration={true}
            strokeDashoffset={(
              autoPlayProgress || animatedProgress
            ).interpolate({
              inputRange: [0, 1],
              outputRange: [2 * Math.PI * 28, 0],
            })}
            colors={{
              border: colors.border,
              primary: colors.primary,
              optionBg: colors.optionBg,
              onPrimary: colors.onPrimary,
              text: colors.text,
            }}
          />
        )}
      </View>
    );
  }
);

PromptDisplay.displayName = "PromptDisplay";

export default PromptDisplay;
