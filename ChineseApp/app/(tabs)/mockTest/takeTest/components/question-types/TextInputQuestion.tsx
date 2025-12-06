import { InputCustom } from "@/components/shared/inputCustom";
import { useLanguageContext } from "@/contexts/languageContext";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface TextInputQuestionProps {
  selectedAnswer?: string | string[] | null;
  onAnswerSelect: (answer: string) => void;
  placeholder?: string;
  colors: any;
}

const TextInputQuestion: React.FC<TextInputQuestionProps> = React.memo(
  ({
    selectedAnswer,
    onAnswerSelect,
    placeholder = "Enter your answer",
    colors,
  }) => {
    const { t } = useLanguageContext();

    // Use selectedAnswer directly as controlled value
    const text = typeof selectedAnswer === "string" ? selectedAnswer : "";

    const handleTextChange = React.useCallback(
      (newText: string) => {
        onAnswerSelect(newText);
      },
      [onAnswerSelect]
    );

    return (
      <View style={{ marginTop: 8 }}>
        <Text
          style={{
            fontSize: 14,
            color: colors.text,
            marginBottom: 12,
            opacity: 0.8,
          }}
        >
          Your Answer
        </Text>

        <InputCustom
          value={text}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          numberOfLines={4}
          multiline
        />

        {text.length > 0 && (
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
              opacity: 0.6,
              marginTop: 4,
              textAlign: "right",
            }}
          >
            {text.length} characters
          </Text>
        )}
      </View>
    );
  }
);

TextInputQuestion.displayName = "TextInputQuestion";

export default TextInputQuestion;
