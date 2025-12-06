/**
 * Test Helper Utilities
 * Các hàm tiện ích cho hệ thống bài thi
 * - Tính điểm
 * - Format câu hỏi
 * - Xử lý audio (phát số câu + nội dung)
 * - Timer utilities
 */

/**
 * Format giây thành string (MM:SS hoặc HH:MM:SS)
 * @param seconds - Số giây
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Kiểm tra thời gian còn lại có sắp hết không
 * @param seconds - Số giây còn lại
 * @param warningThreshold - Ngưỡng cảnh báo (giây)
 * @returns true nếu sắp hết giờ
 */
export const isTimeRunningOut = (
  seconds: number,
  warningThreshold: number = 300
): boolean => {
  return seconds <= warningThreshold && seconds > 0;
};
