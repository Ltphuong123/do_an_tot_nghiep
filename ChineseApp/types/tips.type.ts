export type TTopicTip =
  | "Tất cả"
  | "Văn hóa"
  | "Ngữ pháp"
  | "Từ vựng"
  | "Phát âm"
  | "Khẩu ngữ"
  | "Kỹ năng nghe"
  | "Kỹ năng đọc"
  | "Kỹ năng viết";

export type TLevelTip = "Sơ cấp" | "Trung cấp" | "Cao cấp";

export interface ITip {
  id: string;
  order?: number;
  topic: TTopicTip;
  level: TLevelTip;
  content: {
    html: string;
    ops: { insert: string }[];
  };
  answer?: string;
  is_pinned?: boolean;
  created_by: string;
}
