/**
 * Take Test Screen - Màn hình làm bài thi (Refactored)
 * Features:
 * - Hiển thị câu hỏi theo từng phần (Section)
 * - Chuyển câu mượt mà với animation
 * - Đếm ngược thời gian
 * - Lưu tiến trình tự động
 * - Đánh dấu câu hỏi
 * - Điều hướng nhanh
 */

import ConfirmModal from "@/components/shared/confirmModal";
import { getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  saveTestProgress,
  startExam,
  submitAnswers,
  submitExam,
} from "@/services/mockTest";
import {
  IExam,
  IExamDetail,
  IUserAnswerProgress,
  IUserTestProgress,
} from "@/types/mockTest.type";
import {
  FlatQuestion,
  getSectionQuestions,
  getTotalExamQuestions,
  getTotalQuestionsBeforeSection,
} from "@/utils/exam-helper";
import { stopAudio } from "@/utils/play_audio";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BackHandler, View } from "react-native";
import QuestionNavigation from "./components/QuestionNavigation";
import SectionOverview from "./components/SectionOverview";
import SubsectionOverview from "./components/SubsectionOverview";
import TestBottomActions from "./components/TestBottomActions";
import TestContent from "./components/TestContent";
import TestHeader from "./components/TestHeader";
import TestOverview from "./components/TestOverview";
import TestProgress from "./components/TestProgress";

export default function TakeTestScreen() {
  const params = useLocalSearchParams();
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const { showSnackbar } = useSnackbar();
  const textColor = getTextColor(theme, "primary");
  const bgColor = theme === "dark" ? "#0f0f1e" : "#f8f9fa";
  const id = params.id as string;
  const test: IExam = params.test ? JSON.parse(params.test as string) : null;

  // Modal states for different confirmations
  const errorModal = useConfirmModal();
  const timeUpModal = useConfirmModal();
  const sectionTimeUpModal = useConfirmModal();
  const exitModal = useConfirmModal();
  const submitModal = useConfirmModal();
  const validationModal = useConfirmModal();

  // Progress state
  const [answers, setAnswers] = useState<IUserAnswerProgress[]>([]);

  // UI state (consolidated into single view state)
  const [viewState, setViewState] = useState<
    "testOverview" | "sectionOverview" | "subsectionOverview" | "takingTest"
  >("testOverview");
  const [showNavigation, setShowNavigation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowingSubmitModal, setIsShowingSubmitModal] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [sectionIndex, setSectionIndex] = useState<number>(0);
  const [timeRemainingSection, setTimeRemainingSection] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [examDetail, setExamDetail] = useState<IExamDetail>();

  // Additional state for new structure
  const [currentFlatQuestion, setCurrentFlatQuestion] =
    useState<FlatQuestion | null>(null);
  const [sectionQuestions, setSectionQuestions] = useState<FlatQuestion[]>([]);
  const [attemptId, setAttemptId] = useState<string>("");
  const [visitedSubsections, setVisitedSubsections] = useState<Set<string>>(
    new Set()
  );

  const router = useRouter();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTimerActiveRef = useRef(false);

  // Handler để lưu đáp án
  const handleAnswerSelect = useCallback(
    (questionId: string, answer: string | string[]) => {
      setAnswers((prev) => {
        // Remove existing answer for this question if any
        const filteredAnswers = prev.filter(
          (a) => a.question_id !== questionId
        );
        // Add new answer
        const newAnswer: IUserAnswerProgress = {
          question_id: questionId,
          user_response: answer,
        };
        return [...filteredAnswers, newAnswer];
      });
    },
    []
  );

  const handleSaveProgress = useCallback(async () => {
    if (!examDetail || !isTestStarted) return;

    const progress: IUserTestProgress = {
      id: `progress-${id}`,
      user_id: "user-123", // TODO: Get from auth context
      test_id: id,
      attempt_id: `attempt-${Date.now()}`,
      current_section_index: sectionIndex,
      current_question_index: currentQuestion,
      answers,
      time_remaining: timeRemainingSection, // Use section time remaining
      started_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      status: "in_progress",
    };

    await saveTestProgress(progress);
  }, [
    examDetail,
    isTestStarted,
    id,
    sectionIndex,
    currentQuestion,
    answers,
    timeRemainingSection,
  ]);

  const confirmSubmit = useCallback(async () => {
    if (!examDetail || !attemptId) return;

    // Stop timer immediately
    isTimerActiveRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    try {
      setIsSubmitting(true);
      startLoading(t("gradingTest"));
      const res1 = await submitAnswers(attemptId, answers);
      console.log("Submit answers response:", res1);
      const res = await submitExam(attemptId);
      console.log("Submit exam response:", res);

      submitModal.hideConfirm(); // đóng modal xác nhận nếu còn mở
      stopAudio();

      if (res?.success) {
        router.replace({
          pathname: "/mockTest/result" as any,
          params: { id: res.data.attemptId },
        });
      } else {
        throw new Error(t("submitError"));
      }
    } catch (error: any) {
      showSnackbar(error.message || t("submitError"), "error");
    } finally {
      setIsSubmitting(false);
      setIsShowingSubmitModal(false);
      stopLoading();
    }
  }, [
    attemptId,
    answers,
    examDetail,
    showSnackbar,
    startLoading,
    stopLoading,
    router,
    submitModal,
    t,
  ]);

  const handleSubmit = useCallback(async () => {
    // Dừng timer ngay khi hiện modal xác nhận
    isTimerActiveRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsShowingSubmitModal(true);

    submitModal.showConfirm({
      title: t("submitTest"),
      message: t("submitConfirmMessage"),
      confirmText: t("submitTest"),
      cancelText: t("checkAgain"),
      icon: "file-send",
      iconColor: "#4CAF50",
      onConfirm: confirmSubmit,
    });
  }, [submitModal, confirmSubmit, t]);

  // Handle next section
  const handleNextSection = useCallback(async () => {
    if (!examDetail) return;

    // Stop any playing audio when moving to next section
    try {
      await stopAudio();
      // Add delay to ensure audio system is fully reset
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error stopping audio:", error);
    }

    const nextSectionIndex = sectionIndex + 1;
    if (nextSectionIndex < examDetail.sections.length) {
      // Move to next section
      setSectionIndex(nextSectionIndex);
      // Reset to section overview for new section
      setCurrentQuestion(0);
      setCurrentFlatQuestion(null);
      setSectionQuestions([]);
      setVisitedSubsections(new Set()); // Reset visited subsections for new section
      setViewState("sectionOverview");
      setIsTestStarted(false); // Stop current test to show section overview
      // Timer sẽ được reset khi bắt đầu section mới
    } else {
      // No more sections, submit test
      handleSubmit();
    }
  }, [examDetail, sectionIndex, handleSubmit]);

  const handleTimeUp = useCallback(() => {
    // Dừng timer ngay lập tức
    isTimerActiveRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timeUpModal.showConfirm({
      title: t("timeUp"),
      message: t("timeUpMessage"),
      confirmText: t("confirm"),
      icon: "clock-alert",
      iconColor: "#FF9800",
      onConfirm: confirmSubmit,
    });
  }, [timeUpModal, confirmSubmit, t]);

  const handleSectionTimeUp = useCallback(() => {
    // Dừng timer ngay lập tức
    isTimerActiveRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    sectionTimeUpModal.showConfirm({
      title: t("sectionTimeUp"),
      message: t("sectionTimeUpMessage"),
      confirmText: t("continue"),
      icon: "clock-alert",
      iconColor: "#FF9800",
      onConfirm: handleNextSection,
    });
  }, [sectionTimeUpModal, handleNextSection, t]);

  const handleExit = useCallback(async () => {
    exitModal.showConfirm({
      title: t("exitTest"),
      message: t("exitConfirmMessage"),
      confirmText: t("exit"),
      cancelText: t("cancel"),
      icon: "exit-to-app",
      iconColor: "#F44336",
      onConfirm: async () => {
        await handleSaveProgress();
        await stopAudio();
        router.back();
      },
    });
  }, [exitModal, handleSaveProgress, router, t]);

  const handleFetchExamDetail = async () => {
    startLoading();
    try {
      const res = await startExam(id);
      if (res.success) {
        console.log("Fetched exam detail:", res.data);
        setExamDetail(res.data.exam);
        setAttemptId(res.data.attemptId);
      }
    } catch (error: any) {
      console.error("Error fetching exam detail:", error);
    } finally {
      stopLoading();
    }
  };

  // Helper function to get total questions in current section
  const getCurrentSectionTotalQuestions = useMemo(() => {
    return sectionQuestions.length;
  }, [sectionQuestions.length]);

  // Helper function to get total questions in entire exam
  const getTotalExamQuestionsCount = useMemo(() => {
    return examDetail ? getTotalExamQuestions(examDetail) : 0;
  }, [examDetail]);

  // Helper function to get question IDs for navigation
  const getSectionQuestionIds = useMemo(() => {
    return sectionQuestions.map((q) => q.id);
  }, [sectionQuestions]);

  // Helper function to get answer for current question
  const getCurrentQuestionAnswer = useMemo(() => {
    if (!currentFlatQuestion?.id) return undefined;
    return answers.find((a) => a.question_id === currentFlatQuestion.id)
      ?.user_response;
  }, [currentFlatQuestion?.id, answers]);

  const handleStartTest = async () => {
    await handleFetchExamDetail();
    setViewState("sectionOverview");
  };

  const handleStartSection = () => {
    console.log("Starting section");
    setViewState("subsectionOverview");

    if (examDetail?.sections?.[sectionIndex]) {
      const section = examDetail.sections[sectionIndex];

      // Set section timing
      const minutes = section.time_minutes ?? 0;
      setTimeRemainingSection(minutes * 60);

      // Calculate starting question number for continuous numbering
      const questionsBeforeSection = getTotalQuestionsBeforeSection(
        examDetail,
        sectionIndex
      );
      const startingQuestionNumber = questionsBeforeSection + 1;

      // Initialize flat questions for current section with continuous numbering
      const flatQuestions = getSectionQuestions(
        section,
        sectionIndex,
        startingQuestionNumber
      );
      setSectionQuestions(flatQuestions);

      // Reset question navigation
      setCurrentQuestion(0);
      if (flatQuestions.length > 0) {
        setCurrentFlatQuestion(flatQuestions[0]);
      }
    }

    setIsTestStarted(true);
  };
  const handleStartSubsection = () => {
    setViewState("takingTest");

    // Questions should already be initialized in handleStartSection
    // Just ensure we're starting from the first question if not already set
    if (sectionQuestions.length > 0 && !currentFlatQuestion) {
      setCurrentFlatQuestion(sectionQuestions[0]);
      setCurrentQuestion(0);
    }
    // Timer đã được set trong handleStartSection, không cần set lại
  };

  // Helper function to ensure question has answer before navigation
  const ensureQuestionAnswered = useCallback(
    (question: FlatQuestion) => {
      if (!question.id) return;

      // Check if question already has an answer
      const existingAnswer = answers.find((a) => a.question_id === question.id);
      if (existingAnswer) return; // Already answered

      // Determine question type and set default answer
      const questionTypeId = question.question_type_id;
      let defaultAnswer: string = "";

      if (questionTypeId === "text_input" || questionTypeId === "fill_blank") {
        // Text input questions: empty string
        defaultAnswer = "";
      } else if (questionTypeId === "ordering") {
        // Ordering questions: default order as content string (joined)
        const contentString =
          question.options?.map((o) => o.content || "").join("") || "";
        defaultAnswer = contentString;
      }
      // Multiple choice and other types don't need default answers

      if (
        defaultAnswer !== "" ||
        questionTypeId === "text_input" ||
        questionTypeId === "fill_blank"
      ) {
        // Submit default answer
        handleAnswerSelect(question.id, defaultAnswer);
      }
    },
    [answers, handleAnswerSelect]
  );

  const handlePreviousQuestion = async () => {
    // Stop audio and wait for it to complete
    try {
      await stopAudio();
      // Add small delay to ensure audio system is ready
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error("Error stopping audio:", error);
    }

    // Ensure current question has answer before leaving
    if (currentFlatQuestion) {
      ensureQuestionAnswered(currentFlatQuestion);
    }

    if (currentQuestion > 0) {
      // Move to previous question in current section
      const newCurrentQuestion = currentQuestion - 1;
      const prevQuestion = sectionQuestions[newCurrentQuestion];

      // Check if we're moving to a different subsection
      if (
        currentFlatQuestion &&
        prevQuestion &&
        currentFlatQuestion.subsectionIndex !== prevQuestion.subsectionIndex
      ) {
        // Moving to different subsection
        console.log(
          "Moving to previous subsection:",
          prevQuestion.subsectionIndex,
          "from:",
          currentFlatQuestion.subsectionIndex
        );

        const subsectionKey = `${sectionIndex}-${prevQuestion.subsectionIndex}`;
        const isReturningToVisitedSubsection =
          visitedSubsections.has(subsectionKey);

        setCurrentQuestion(newCurrentQuestion);
        setCurrentFlatQuestion(prevQuestion);

        // Skip subsection overview if returning to visited subsection
        if (!isReturningToVisitedSubsection) {
          setViewState("subsectionOverview");
        }
      } else {
        // Same subsection - continue normally
        setCurrentQuestion(newCurrentQuestion);
        setCurrentFlatQuestion(prevQuestion);
      }
    }
    // If we're at question 0, can't go back further in current section
  };

  const handleNextQuestion = async () => {
    console.log("Next question");

    // Stop audio and wait for it to complete
    try {
      await stopAudio();
      // Add small delay to ensure audio system is ready
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error("Error stopping audio:", error);
    }

    // Ensure current question has answer before leaving
    if (currentFlatQuestion) {
      ensureQuestionAnswered(currentFlatQuestion);
    }

    // Check if we're at the last question in current section
    if (currentQuestion === sectionQuestions.length - 1) {
      // No more questions in current section, move to next section
      handleNextSection();
    } else {
      // Move to next question in current section
      const newCurrentQuestion = currentQuestion + 1;
      const nextQuestion = sectionQuestions[newCurrentQuestion];

      // Check if we're moving to a different subsection
      if (
        currentFlatQuestion &&
        nextQuestion &&
        currentFlatQuestion.subsectionIndex !== nextQuestion.subsectionIndex
      ) {
        // Moving to new subsection
        console.log(
          "Moving to new subsection:",
          nextQuestion.subsectionIndex,
          "from:",
          currentFlatQuestion.subsectionIndex
        );

        const subsectionKey = `${sectionIndex}-${nextQuestion.subsectionIndex}`;
        const isReturningToVisitedSubsection =
          visitedSubsections.has(subsectionKey);

        setCurrentQuestion(newCurrentQuestion);
        setCurrentFlatQuestion(nextQuestion);

        // Mark current subsection as visited
        const currentSubsectionKey = `${sectionIndex}-${currentFlatQuestion.subsectionIndex}`;
        setVisitedSubsections((prev) =>
          new Set(prev).add(currentSubsectionKey)
        );

        // Skip subsection overview if returning to visited subsection
        if (!isReturningToVisitedSubsection) {
          setViewState("subsectionOverview");
        }
      } else {
        // Same subsection - continue normally
        setCurrentQuestion(newCurrentQuestion);
        setCurrentFlatQuestion(nextQuestion);
      }
    }
  };

  // Handler để chuyển đến câu hỏi cụ thể từ navigation
  const handleQuestionSelect = useCallback(
    async (globalIndex: number) => {
      // globalIndex là index toàn cục trong section (0-based)

      // Stop audio and wait for it to complete
      try {
        await stopAudio();
        // Add small delay to ensure audio system is ready
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        console.error("Error stopping audio:", error);
      }

      // Ensure current question has answer before leaving
      if (currentFlatQuestion) {
        ensureQuestionAnswered(currentFlatQuestion);
      }

      setCurrentQuestion(globalIndex);

      // Update the current flat question
      if (sectionQuestions[globalIndex]) {
        setCurrentFlatQuestion(sectionQuestions[globalIndex]);
      }

      // Close navigation modal
      setShowNavigation(false);
    },
    [sectionQuestions, currentFlatQuestion, ensureQuestionAnswered]
  );

  useEffect(() => {
    // Update timer active state
    const shouldBeActive =
      viewState === "takingTest" &&
      !isSubmitting &&
      !isShowingSubmitModal &&
      timeRemainingSection > 0;
    isTimerActiveRef.current = shouldBeActive;

    if (!shouldBeActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start timer if not already running
    if (!timerRef.current) {
      const runTimer = () => {
        if (!isTimerActiveRef.current) return;

        const newTime = timeRemainingSection - 1;
        if (newTime <= 0) {
          const sectionsCount = examDetail?.sections?.length ?? 0;
          if (sectionIndex < sectionsCount - 1) {
            handleSectionTimeUp();
          } else {
            handleTimeUp();
          }
        } else {
          setTimeRemainingSection(newTime);
          timerRef.current = setTimeout(runTimer, 1000);
        }
      };

      timerRef.current = setTimeout(runTimer, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    timeRemainingSection,
    sectionIndex,
    examDetail,
    handleSectionTimeUp,
    handleTimeUp,
    viewState,
    isSubmitting,
    isShowingSubmitModal,
  ]);

  // Cleanup timer khi component unmount (thoát màn hình)
  useEffect(() => {
    return () => {
      // Cleanup timer khi unmount
      isTimerActiveRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // Dừng audio nếu đang phát
      stopAudio();
    };
  }, []);

  // Chặn gesture back và hardware back button khi đang làm bài
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Nếu đang làm bài (không phải overview), ngăn chặn back và hiện modal xác nhận
        if (viewState === "takingTest") {
          handleExit();
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior for overview screens
      };

      // Add event listener for Android hardware back button
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // For iOS gesture back, we need to use navigation options
      // This is handled automatically by preventing the default behavior

      return () => backHandler.remove();
    }, [viewState, handleExit])
  );

  // Show Test Overview
  if (viewState === "testOverview" && test) {
    return <TestOverview test={test} onStart={handleStartTest} />;
  }

  // Show Section Overview
  if (viewState === "sectionOverview" && examDetail?.sections?.[sectionIndex]) {
    return (
      <SectionOverview
        section={examDetail.sections[sectionIndex]}
        sectionIndex={sectionIndex}
        totalSections={examDetail?.sections?.length || 0}
        onStart={handleStartSection}
        theme={theme}
      />
    );
  }

  // Show Subsection Overview
  if (
    viewState === "subsectionOverview" &&
    examDetail?.sections?.[sectionIndex] &&
    currentFlatQuestion
  ) {
    const currentSubsectionIndex = currentFlatQuestion.subsectionIndex;
    const currentSubsection =
      examDetail.sections[sectionIndex].subsections?.[currentSubsectionIndex];

    return (
      <SubsectionOverview
        subsection={currentSubsection}
        sectionName={examDetail.sections[sectionIndex].name}
        onStart={handleStartSubsection}
        theme={theme}
      />
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: bgColor, width: "100%" }}>
        {/* Header */}
        <TestHeader
          textColor={textColor}
          timeRemaining={timeRemainingSection}
          onTimeUp={handleTimeUp}
          isPaused={isSubmitting}
          onExit={handleExit}
          onOpenNavigation={() => setShowNavigation(true)}
          sectionName={examDetail?.sections[sectionIndex]?.name || ""}
          sectionIndex={sectionIndex}
          totalSections={examDetail?.sections.length || 0}
        />

        {/* Progress */}
        <TestProgress
          currentQuestionIndex={currentQuestion}
          totalQuestions={getTotalExamQuestionsCount}
          currentQuestionNumber={currentFlatQuestion?.questionNumber}
        />

        {/* Question Content */}
        <TestContent
          currentQuestion={currentFlatQuestion || undefined}
          selectedAnswer={getCurrentQuestionAnswer}
          onAnswerSelect={handleAnswerSelect}
          onAutoNext={() => {
            // Nếu không có câu hiện tại hoặc chưa load questions thì dừng
            if (!sectionQuestions || sectionQuestions.length === 0) return;

            const atLastQuestionInSection =
              currentQuestion === sectionQuestions.length - 1;
            const atLastSection =
              sectionIndex === (examDetail?.sections?.length ?? 0) - 1;

            if (atLastQuestionInSection) {
              if (atLastSection) {
                // Không tự động nộp khi người dùng trả lời câu cuối cùng.
                // Giữ người dùng ở câu cuối; họ sẽ nhấn nút "Nộp bài" để xác nhận.
                // (Không gọi handleSubmit hoặc submitModal ở đây)
                return;
              } else {
                handleNextSection();
              }
            } else {
              handleNextQuestion();
            }
          }}
          sectionName={examDetail?.sections[sectionIndex]?.name}
        />

        {/* Bottom Actions */}
        <TestBottomActions
          currentQuestion={currentQuestion}
          sectionTotalQuestions={getCurrentSectionTotalQuestions}
          currentSection={sectionIndex}
          totalSections={examDetail?.sections?.length || 0}
          isSubmitting={isSubmitting}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onSubmit={handleSubmit}
        />

        {/* Question Navigation Modal */}
        <QuestionNavigation
          visible={showNavigation}
          onClose={() => setShowNavigation(false)}
          totalQuestions={getCurrentSectionTotalQuestions}
          currentQuestionIndex={currentQuestion}
          questionIds={getSectionQuestionIds}
          answeredQuestions={answers.reduce((acc, answer) => {
            if (
              answer.user_response !== undefined &&
              answer.user_response !== ""
            ) {
              acc[answer.question_id] = answer.user_response;
            }
            return acc;
          }, {} as Record<string, string | string[]>)}
          onQuestionSelect={handleQuestionSelect}
          questionNumbers={sectionQuestions.map((q) => q.questionNumber)}
        />
      </View>

      <ConfirmModal
        visible={exitModal.modalState.visible}
        onRequestClose={exitModal.hideConfirm}
        onConfirm={exitModal.handleConfirm}
        title={exitModal.modalState.title}
        message={exitModal.modalState.message}
        confirmText={exitModal.modalState.confirmText}
        cancelText={exitModal.modalState.cancelText}
        icon={exitModal.modalState.icon}
        iconColor={exitModal.modalState.iconColor}
        variant="confirm"
      />

      {/* Confirm Modals */}
      <ConfirmModal
        visible={errorModal.modalState.visible}
        onRequestClose={errorModal.hideConfirm}
        onConfirm={errorModal.handleConfirm}
        title={errorModal.modalState.title}
        message={errorModal.modalState.message}
        confirmText={errorModal.modalState.confirmText}
        icon={errorModal.modalState.icon}
        iconColor={errorModal.modalState.iconColor}
        variant="confirm"
      />

      <ConfirmModal
        visible={timeUpModal.modalState.visible}
        onRequestClose={timeUpModal.hideConfirm}
        onConfirm={timeUpModal.handleConfirm}
        title={timeUpModal.modalState.title}
        message={timeUpModal.modalState.message}
        confirmText={timeUpModal.modalState.confirmText}
        icon={timeUpModal.modalState.icon}
        iconColor={timeUpModal.modalState.iconColor}
        hideCancel={true}
        disableClose={true}
        variant="confirm"
      />

      <ConfirmModal
        visible={sectionTimeUpModal.modalState.visible}
        onRequestClose={sectionTimeUpModal.hideConfirm}
        onConfirm={sectionTimeUpModal.handleConfirm}
        title={sectionTimeUpModal.modalState.title}
        message={sectionTimeUpModal.modalState.message}
        confirmText={sectionTimeUpModal.modalState.confirmText}
        icon={sectionTimeUpModal.modalState.icon}
        iconColor={sectionTimeUpModal.modalState.iconColor}
        hideCancel={true}
        disableClose={true}
        variant="confirm"
      />

      <ConfirmModal
        visible={submitModal.modalState.visible}
        onRequestClose={() => {
          submitModal.hideConfirm();
          setIsShowingSubmitModal(false); // Reset state khi đóng modal
        }}
        onConfirm={submitModal.handleConfirm}
        title={submitModal.modalState.title}
        message={submitModal.modalState.message}
        confirmText={submitModal.modalState.confirmText}
        cancelText={submitModal.modalState.cancelText}
        icon={submitModal.modalState.icon}
        iconColor={submitModal.modalState.iconColor}
        variant="confirm"
      />

      <ConfirmModal
        visible={validationModal.modalState.visible}
        onRequestClose={validationModal.hideConfirm}
        onConfirm={validationModal.handleConfirm}
        title={validationModal.modalState.title}
        message={validationModal.modalState.message}
        confirmText={validationModal.modalState.confirmText}
        icon={validationModal.modalState.icon}
        iconColor={validationModal.modalState.iconColor}
        variant="confirm"
      />
    </>
  );
}
