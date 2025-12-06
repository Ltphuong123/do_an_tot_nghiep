export type Names = "Yêu thích" | "Đã thuộc" | "Chưa thuộc" | "Không chắc";

export const statusGradients: Record<Names, string[]> = {
  "Yêu thích": ["#FF5E89", "#A61B45"],
  "Đã thuộc": ["#1A3675", "#0D1C42"],
  "Chưa thuộc": ["#9BB6A8", "#5F7A6E"],
  "Không chắc": ["#F2E6D0", "#C9BCA3"],
};

export interface VocabStats {
  name: Names;
  count: number;
  color: string;
  gradient: string[];
}
