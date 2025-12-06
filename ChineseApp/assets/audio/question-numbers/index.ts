/**
 * Audio Question Numbers
 * Quản lý file audio cho số câu hỏi từ 1-100
 * Mỗi file audio chứa âm thanh đọc số câu hỏi bằng tiếng Trung
 *
 * Ví dụ:
 * - 1.mp3: "第一题" (Đệ nhất đề)
 * - 2.mp3: "第二题" (Đệ nhị đề)
 * - ...
 *
 * NOTE: Audio files are optional. If not present, the system will skip playing question numbers.
 * To add audio files:
 * 1. Generate audio files using TTS (see README.md)
 * 2. Place them in this directory: 1.mp3, 2.mp3, ..., 100.mp3
 * 3. Uncomment the require statements below
 */

// Map số câu hỏi với file audio tương ứng
// Currently disabled - uncomment when audio files are available
export const questionNumberAudio: Record<number, any> = {
  1: require("./1.mp3"),
  2: require("./2.mp3"),
  3: require("./3.mp3"),
  4: require("./4.mp3"),
  5: require("./5.mp3"),
  6: require("./6.mp3"),
  7: require("./7.mp3"),
  8: require("./8.mp3"),
  9: require("./9.mp3"),
  10: require("./10.mp3"),
  11: require("./11.mp3"),
  12: require("./12.mp3"),
  13: require("./13.mp3"),
  14: require("./14.mp3"),
  15: require("./15.mp3"),
  16: require("./16.mp3"),
  17: require("./17.mp3"),
  18: require("./18.mp3"),
  19: require("./19.mp3"),
  20: require("./20.mp3"),
  21: require("./21.mp3"),
  22: require("./22.mp3"),
  23: require("./23.mp3"),
  24: require("./24.mp3"),
  25: require("./25.mp3"),
  26: require("./26.mp3"),
  27: require("./27.mp3"),
  28: require("./28.mp3"),
  29: require("./29.mp3"),
  30: require("./30.mp3"),
  31: require("./31.mp3"),
  32: require("./32.mp3"),
  33: require("./33.mp3"),
  34: require("./34.mp3"),
  35: require("./35.mp3"),
  36: require("./36.mp3"),
  37: require("./37.mp3"),
  38: require("./38.mp3"),
  39: require("./39.mp3"),
  40: require("./40.mp3"),
  41: require("./41.mp3"),
  42: require("./42.mp3"),
  43: require("./43.mp3"),
  44: require("./44.mp3"),
  45: require("./45.mp3"),
  46: require("./46.mp3"),
  47: require("./47.mp3"),
  48: require("./48.mp3"),
  49: require("./49.mp3"),
  50: require("./50.mp3"),
};

/**
 * Lấy file audio cho số câu hỏi
 * @param questionNumber - Số thứ tự câu hỏi (1-100)
 * @returns Audio file hoặc null nếu không tồn tại
 */
export const getQuestionNumberAudio = (questionNumber: number): any | null => {
  if (questionNumber < 1 || questionNumber > 100) {
    console.warn(`Question number ${questionNumber} out of range (1-100)`);
    return null;
  }
  return questionNumberAudio[questionNumber] || null;
};

/**
 * Kiểm tra xem file audio có tồn tại không
 * @param questionNumber - Số thứ tự câu hỏi
 * @returns true nếu file tồn tại
 */
export const hasQuestionNumberAudio = (questionNumber: number): boolean => {
  return (
    questionNumber >= 1 &&
    questionNumber <= 100 &&
    questionNumberAudio[questionNumber] !== undefined
  );
};
