import { Colors } from "@/constants/theme";

type ThemeType = keyof typeof Colors;

export const getRankColor = (rank: number, theme: ThemeType) => {
  if (rank === 1) return "#FFD700"; // Gold
  if (rank === 2) return "#C0C0C0"; // Silver
  if (rank === 3) return "#CD7F32"; // Bronze
  return Colors[theme].text;
};
