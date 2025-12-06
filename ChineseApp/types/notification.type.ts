export interface INotification {
  id: string;
  type: string;
  title: string;
  content: {
    html: string;
  };
  redirect_type: string;
  data: {
    post_id?: string;
    [key: string]: any;
  };
  read_at: string | null;
  created_at: string;
  priority: number; //0: thấp, 1: trung bình, 2: cao
}

export enum ENotificationType {
  SYSTEM = "system",
  REPORT = "report",
  VIOLATION = "violation",
  APPEAL = "appeal",
  SUBS = "subscription",
  COMMUNITY = "community",
  ACH = "achievement",
  REMINDER = "reminder",
  FB = "feedback",
}
