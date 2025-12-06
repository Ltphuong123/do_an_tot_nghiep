export interface IDailyTranslationComparison {
  today: number;
  yesterday: number;
}

export interface IAchievements {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {};
  points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  progress: {
    current: number;
  };
}

export interface IStreak {
  streak: number;
  total_minutes: number;
  weekData: IWeekData[];
}

export interface IWeekData {
  day: string;
  completed: boolean;
  minutes: number;
  isToday: boolean;
}

export interface ILeaderboardEntry {
  user_id: string;
  user_name: string;
  user_avatar: string;
  user_level: string;
  max_score: number;
  badge_level: number;
  badge_name: string;
  badge_icon: string;
  badge_min_points: number;
}

export interface IHomeCard {
  id: string;
  title: string;
  visible: boolean;
}

export interface IBadge {
  id: string;
  level: number;
  name: string;
  icon: string;
  min_points: number;
  rule_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
