import {
  IExamDetail,
  IPrompt,
  IQuestion,
  ISection,
} from "@/types/mockTest.type";

/**
 * Flatten all questions from an exam structure
 * Questions can be found in:
 * 1. subsection.questions (direct questions)
 * 2. subsection.prompts[].questions (questions within prompts)
 */
export interface FlatQuestion extends IQuestion {
  sectionIndex: number;
  subsectionIndex: number;
  promptIndex?: number; // undefined if direct question, number if from prompt
  globalIndex: number; // 0-based index across entire section
  questionNumber: number; // 1-based display number
  prompt?: IPrompt; // Associated prompt if any
}

/**
 * Get all questions from a section
 */
export function getSectionQuestions(
  section: ISection,
  sectionIndex: number,
  startingQuestionNumber: number = 1
): FlatQuestion[] {
  const questions: FlatQuestion[] = [];
  let globalIndex = 0;
  let questionNumber = startingQuestionNumber;

  section.subsections?.forEach((subsection, subsectionIndex) => {
    // Create a map of prompts by ID for quick lookup
    const promptMap = new Map<string, IPrompt>();
    subsection.prompts?.forEach((prompt) => {
      promptMap.set(prompt.id, prompt);
    });

    // Add all questions from subsection
    subsection.questions?.forEach((question) => {
      // Check if question has a prompt_id
      const associatedPrompt = question.prompt_id
        ? promptMap.get(question.prompt_id)
        : undefined;

      questions.push({
        ...question,
        sectionIndex,
        subsectionIndex,
        globalIndex,
        questionNumber,
        prompt: associatedPrompt,
      });
      globalIndex++;
      questionNumber++;
    });
  });

  return questions;
}

/**
 * Get total question count for entire exam
 */
export function getTotalExamQuestions(exam: IExamDetail): number {
  let totalQuestions = 0;

  exam.sections?.forEach((section) => {
    totalQuestions += getSectionQuestionCount(section);
  });

  return totalQuestions;
}

/**
 * Get total question count for a section
 */
export function getSectionQuestionCount(section: ISection): number {
  let count = 0;

  section.subsections?.forEach((subsection) => {
    // Count all questions in subsection
    count += subsection.questions?.length || 0;
  });

  return count;
}

/**
 * Get total question count before a specific section (for continuous numbering)
 */
export function getTotalQuestionsBeforeSection(
  exam: IExamDetail,
  sectionIndex: number
): number {
  let totalQuestions = 0;

  for (let i = 0; i < sectionIndex && i < (exam.sections?.length || 0); i++) {
    const section = exam.sections![i];
    totalQuestions += getSectionQuestionCount(section);
  }

  return totalQuestions;
}

/**
 * Get all questions from entire exam
 */
export function getAllExamQuestions(exam: IExamDetail): FlatQuestion[] {
  const allQuestions: FlatQuestion[] = [];
  let currentQuestionNumber = 1;

  exam.sections?.forEach((section, sectionIndex) => {
    const sectionQuestions = getSectionQuestions(
      section,
      sectionIndex,
      currentQuestionNumber
    );
    allQuestions.push(...sectionQuestions);
    currentQuestionNumber += sectionQuestions.length;
  });

  return allQuestions;
}

/**
 * Find question by global index within a section
 */
export function findQuestionByIndex(
  section: ISection,
  globalIndex: number
): FlatQuestion | null {
  const questions = getSectionQuestions(section, 0);
  return questions[globalIndex] || null;
}

/**
 * Get current subsection and question indices for navigation
 */
export function getNavigationIndices(
  section: ISection,
  globalQuestionIndex: number
): {
  subsectionIndex: number;
  questionIndex: number;
  promptIndex?: number;
} | null {
  let currentGlobalIndex = 0;

  for (
    let subsectionIndex = 0;
    subsectionIndex < (section.subsections?.length || 0);
    subsectionIndex++
  ) {
    const subsection = section.subsections![subsectionIndex];

    // Check all questions in subsection
    for (
      let questionIndex = 0;
      questionIndex < (subsection.questions?.length || 0);
      questionIndex++
    ) {
      if (currentGlobalIndex === globalQuestionIndex) {
        return { subsectionIndex, questionIndex };
      }
      currentGlobalIndex++;
    }
  }

  return null;
}

/**
 * Check if we should show subsection overview when moving to next question
 */
export function shouldShowSubsectionOverview(
  section: ISection,
  currentGlobalIndex: number,
  nextGlobalIndex: number
): boolean {
  const currentNav = getNavigationIndices(section, currentGlobalIndex);
  const nextNav = getNavigationIndices(section, nextGlobalIndex);

  if (!currentNav || !nextNav) return false;

  // Show subsection overview if moving to different subsection
  return currentNav.subsectionIndex !== nextNav.subsectionIndex;
}
