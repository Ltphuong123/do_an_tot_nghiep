import { IQuestionResult } from "@/types/mockTest.type";

/**
 * Group questions by their order number
 * Questions with the same order belong to the same section/group
 */
export const groupQuestionsByOrder = (questions: IQuestionResult[]) => {
  const grouped: { [key: number]: IQuestionResult[] } = {};

  questions.forEach((question) => {
    const order = question.question_order;
    if (!grouped[order]) {
      grouped[order] = [];
    }
    grouped[order].push(question);
  });

  return grouped;
};

/**
 * Calculate statistics from questions array
 */
export const calculateResultStats = (questions: IQuestionResult[]) => {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter((q) => q.is_correct === true).length;
  const percentage =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return {
    totalQuestions,
    correctAnswers,
    percentage: percentage.toFixed(1),
  };
};

/**
 * Format time duration between two date strings
 */
export const getTestDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = Math.abs(end.getTime() - start.getTime());
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Strip HTML tags from content
 */
export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};
