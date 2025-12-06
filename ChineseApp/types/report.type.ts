export interface IReportRequest {
  target_type: "post" | "comment" | "user" | "bug" | "other";
  target_id: string;
  reason: string;
  details?: string;
}

export interface IViolationsResponse {
  id: string;
  user_id: string;
  target_type: "post" | "comment" | string; // tùy bạn muốn giới hạn hay mở rộng
  target_id: string;

  severity: "low" | "medium" | "high" | string;
  detected_by: string;

  handled: boolean;

  created_at: string; // hoặc Date nếu bạn convert
  resolved_at: string | null;

  resolution: string | null;

  rules: string[];
}

export interface ViolationSnapshot {
  id: string;
  handled: boolean;
  user_id: string;
  severity: "low" | "medium" | "high";
  target_id: string;
  created_at: string; // ISO date string
  resolution: string | null;
  detected_by: string;
  resolved_at: string | null;
  target_type: string;
}

export interface UserViolation {
  id: string;
  violation_id: string;
  user_id: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  created_at: string; // ISO date string
  resolved_at: string | null;
  resolved_by: string | null;
  notes: string | null;
  violation_snapshot: ViolationSnapshot;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  level: string;
  avatar_url: string;
  badge_level: number;
  community_points: number;
}

export interface ViolationResolution {
  id: string;
  violation_id: string;
  user_id: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  notes: string;
  user: User;
}
