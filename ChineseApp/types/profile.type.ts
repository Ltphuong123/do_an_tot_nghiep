export type TimeRange = "day" | "week" | "month";

export interface TranslationData {
  value: number;
  label: string;
  date?: string;
}

export interface StatisticCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
  trend?: number;
}

export interface StatisticsPeriod {
  total: number;
  trend: number;
  data: TranslationData[];
  average: number;
  peak: number;
  peakTime: string;
}

export interface TranslationStatistics {
  today: number;
  week: number;
  month: number;
}
