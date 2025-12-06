import { IUserAnswerProgress } from "@/types/mockTest.type";
import { create } from "zustand";

interface ITestState {
  // detailTest: IMockTestSection[];
  detailTest: any[];
  userAnswers: IUserAnswerProgress[];
  // setDetailTest: (details: IMockTestSection[]) => void;
  setDetailTest: (details: any[]) => void;
  setUserAnswers: (answers: IUserAnswerProgress[]) => void;
}

export const useTestStore = create<ITestState>((set) => ({
  detailTest: [],
  userAnswers: [],
  setDetailTest: (details) => set({ detailTest: details }),
  setUserAnswers: (answers) => set({ userAnswers: answers }),
}));
