/**
 * Test Content Component
 * Hiển thị nội dung câu hỏi với animation
 */

import { FlatQuestion } from "@/utils/exam-helper";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import QuestionDisplay from "./QuestionDisplay";

interface TestContentProps {
  currentQuestion: FlatQuestion | undefined;
  selectedAnswer?: string | string[];
  onAnswerSelect: (questionId: string, answer: string | string[]) => void;
  onAutoNext?: () => void; // <-- thêm prop này
  sectionName?: string;
}

const TestContent = React.memo(
  ({
    currentQuestion,
    selectedAnswer,
    onAnswerSelect,
    onAutoNext, // <-- destructure thêm
    sectionName,
  }: TestContentProps) => {
    const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

    // Scroll to top when question changes
    useEffect(() => {
      if (currentQuestion && scrollViewRef.current) {
        scrollViewRef.current.scrollToPosition(0, 0, true);
      }
    }, [currentQuestion]);

    // Use contentContainerStyle with flexGrow so short content centers vertically.
    if (!currentQuestion) {
      return (
        <Animated.View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 24,
            }}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={20}
          >
            {/* Empty content or loading indicator */}
          </KeyboardAwareScrollView>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={{ flex: 1, width: "100%" }}>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={50}
        >
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestion.questionNumber}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={onAnswerSelect}
            prompt={currentQuestion.prompt}
            onAutoNext={onAutoNext} // <-- truyền xuống
            sectionName={sectionName}
            subsectionIndex={currentQuestion.subsectionIndex}
          />
        </KeyboardAwareScrollView>
      </Animated.View>
    );
  }
);

TestContent.displayName = "TestContent";

export default TestContent;
