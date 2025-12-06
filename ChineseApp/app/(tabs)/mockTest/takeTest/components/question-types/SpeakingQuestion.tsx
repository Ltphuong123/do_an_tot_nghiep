import MicButton from "@/components/shared/micButton";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface SpeakingQuestionProps {
  selectedAnswer?: string | string[];
  onAnswerSelect: (answer: string | string[]) => void;
  colors: any;
}

const SpeakingQuestion: React.FC<SpeakingQuestionProps> = ({
  selectedAnswer,
  onAnswerSelect,
  colors,
}) => {
  const { t } = useLanguageContext();
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const [transcribedText, setTranscribedText] = useState<string>("");

  useEffect(() => {
    // Reset transcribed text when question changes
    setTranscribedText((selectedAnswer as string) || "");
  }, [selectedAnswer]);

  const handleTextChange = (text: string) => {
    setTranscribedText(text);
    onAnswerSelect(text); // Lưu kết quả ghi âm
  };

  return (
    <View style={{ marginTop: 16, alignItems: "center" }}>
      <Text
        style={{
          fontSize: 16,
          color: colors.text,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {transcribedText || t("pressToRecordYourAnswer")}
      </Text>

      <MicButton
        theme={theme}
        onChangeText={handleTextChange}
        showSnackbar={showSnackbar}
        language="zh-CN"
        size={80}
      />
    </View>
  );
};

export default SpeakingQuestion;
