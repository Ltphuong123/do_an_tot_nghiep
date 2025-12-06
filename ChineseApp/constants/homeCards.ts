import Banner from "@/app/(tabs)/home/components/banner";
import CreateLessonsAI from "@/app/(tabs)/home/components/createLessonsAi";
import CustomizationBar from "@/app/(tabs)/home/components/customizationBar";
import MockTestLeaderboard from "@/app/(tabs)/home/components/mockTestLeaderboard";
import PersonalStats from "@/app/(tabs)/home/components/personalStats";
import QnASection from "@/app/(tabs)/home/components/qnASection";
import TipsSection from "@/app/(tabs)/home/components/tipsSection";
import UtilitiesSection from "@/app/(tabs)/home/components/utilitiesSection";
import { IHomeCard } from "@/types/home.type";

export const homeCard: IHomeCard[] = [
  { id: "quangcao", title: "Quảng cáo", visible: true },
  { id: "ai", title: "Bài học AI", visible: true },
  { id: "personalStats", title: "Cá nhân", visible: true },
  { id: "utilitiesSection", title: "Tiện ích", visible: true },
  { id: "tipsSection", title: "Mẹo", visible: true },
  { id: "qnASection", title: "Hỏi đáp", visible: true },
  { id: "mockTestLeaderboard", title: "Thi thử", visible: true },
  { id: "customizationBar", title: "Tùy chỉnh", visible: true },
];

export const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  quangcao: Banner,
  ai: CreateLessonsAI,
  personalStats: PersonalStats,
  utilitiesSection: UtilitiesSection,
  tipsSection: TipsSection,
  qnASection: QnASection,
  mockTestLeaderboard: MockTestLeaderboard,
  customizationBar: CustomizationBar,
};
