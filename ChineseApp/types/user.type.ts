import { ProviderType, RoleType } from "./common.type";

export interface IUser {
  id: string;
  username: string | null;
  name: string;
  avatar_url: string;
  email: string | null;
  role: RoleType;
  provider: ProviderType;
  is_active: boolean;
  isVerify: boolean;
  community_points: number;
  level: string;
  badge_level: number;
  badge: {
    level: number;
    name: string;
    icon: string;
    min_points: number;
  };
  subscription: {
    id: string | null;
    name: string | null;
    description: string | null;
    start_date: string | null;
    expiry_date: string | null;
    auto_renew: boolean | null;
    daily_quota_ai_lesson: number | null;
    daily_quota_translate: number | null;
  };
  language: string;
  last_login: string | null;
  created_at: string;
  achievements: IAchieventments[];
  updated_at: string;
}

export interface IAchieventments {
  name: string;
  achieved_at: string;
  criteria: string;
}
