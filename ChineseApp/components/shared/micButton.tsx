import DesignSystem from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSpeechRecognition } from "@/contexts/speechRecognitionContext";
import { stopAudio } from "@/utils/play_audio";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useState } from "react";
import { Alert, Animated, Linking, Pressable } from "react-native";
import { Icon } from "react-native-paper";

const MicButton = ({
  theme,
  onChangeText,
  showSnackbar,
  language = "vi-VN",
  size = 48,
}: {
  theme: "dark" | "light";
  onChangeText: (text: string) => void;
  showSnackbar: (message: string, type: "success" | "info" | "error") => void;
  language?: string;
  size?: number;
}) => {
  const { t } = useLanguageContext();
  console.log("MicButton render with language:", language);
  const [scaleAnim] = useState(new Animated.Value(1));
  const { isListening, setIsListening } = useSpeechRecognition();

  useSpeechRecognitionEvent("start", () => {
    console.log("Speech recognition started event");
    setIsListening(true);
  });
  useSpeechRecognitionEvent("end", () => {
    console.log("Speech recognition ended event");
    setIsListening(false);
  });
  useSpeechRecognitionEvent("result", (e) =>
    onChangeText(e.results[0]?.transcript ?? "")
  );
  useSpeechRecognitionEvent("error", (e) =>
    showSnackbar(e.message ?? t("cannotStartRecording"), "error")
  );

  const startListening = async () => {
    if (isListening) {
      console.log("Already listening, ignoring start request");
      return;
    }

    try {
      console.log("Checking mic permissions...");
      let perm = await ExpoSpeechRecognitionModule.getPermissionsAsync();
      console.log("Current permission:", perm);

      if (!perm.granted) {
        console.log("Requesting mic permission...");
        perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        console.log("Permission after request:", perm);
      }

      if (!perm.granted) {
        console.log("Permission denied by user");
        Alert.alert(t("micPermissionDenied"), t("micPermissionMessage"), [
          { text: t("cancel"), style: "cancel" },
          { text: t("openSettings"), onPress: () => Linking.openSettings() },
        ]);
        return;
      }

      console.log("Starting speech recognition with language:", language);
      setIsListening(true);
      showSnackbar(t("startSpeaking"), "info");

      // Stop any playing audio before starting recording
      await stopAudio();

      await ExpoSpeechRecognitionModule.start({
        lang: language,
        interimResults: true,
        continuous: true, // Allow longer recording
        maxAlternatives: 1,
      });
      console.log("Speech recognition started successfully");
    } catch (err: any) {
      setIsListening(false);
      console.error("Start listening error:", err);
      showSnackbar(
        err?.message
          ? `${t("cannotStartRecording")}: ${err.message}`
          : t("cannotStartRecording"),
        "error"
      );
    }
  };

  const stopListening = async () => {
    try {
      console.log("Stopping speech recognition...");
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
      console.log("Speech recognition stopped");
    } catch (err) {
      console.error("Stop error:", err);
      setIsListening(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const getButtonColor = () => {
    if (isListening) return "#ff4444"; // Red when listening
    return "#4A90E2"; // Blue default
  };

  const getIconName = () => {
    return isListening ? "stop" : "microphone";
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={
          isListening
            ? stopListening
            : () => {
                try {
                  // Clear the input immediately when user starts recording
                  onChangeText("");
                } catch (err) {
                  console.error(
                    "Error clearing input before startListening:",
                    err
                  );
                }
                startListening();
              }
        }
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: getButtonColor(),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Icon source={getIconName() as any} size={size * 0.5} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
};

export default MicButton;
