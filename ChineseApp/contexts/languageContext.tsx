import { useUserStore } from "@/store/useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
};

// Translation object - keep original but optimize with memoization
const translations = {
  vi: {
    success: "hành công",
    username: "Tên đăng nhập",
    status: "Trạng thái",
    wordType: "Loại từ",
    add: "Thêm",
    note: "Ghi chú",
    // Navigation & Tabs
    home: "Trang chủ",
    translate: "Dịch",
    mockTest: "Thi thử",
    noteOrAi: "Sổ tay",
    aiLesson: "Bài học AI",
    community: "Cộng đồng",
    vocabularyStatistics: "Thống kê từ vựng",

    // Home Screen
    welcome: "Chào",
    login: "Đăng nhập",
    studyGreeting: "Chúc bạn học tập vui vẻ",
    search: "Tìm kiếm",
    loginRequired: "Vui lòng đăng nhập để sử dụng ứng dụng.",

    // Home Components
    aiLessons: "Bài học AI",
    aiLessonsDesc: "Bật chế độ học siêu tốc",
    unlimitedTopics: "Chủ đề không giới hạn",
    studyWithAI: "Học là ghiền với AI",
    createAILesson: "Tạo bài học AI",

    // Personal Stats
    personal: "Cá nhân",
    maintainStreak: "Tra 1 từ để duy trì streak",
    habitFormed: "Thói quen hình thành!",
    diligenceMakesUpForDiligence: "Cần cù bù siêng năng!",
    diligenceMakesUpForIntelligence: "Cần cù bù thông minh!",
    diligentBlackCat: "Mèo đen siêng năng!",
    catCultivatesIntoSpirit: "Mèo tu thành tinh!",
    youHaveBeenOnline: "Bạn đã online",
    streak: "Chuỗi",
    days: "ngày",
    keepLearning: "Giữ lửa học tập!",
    thisWeek: "Tuần này",
    weekActivity: "Lịch hoạt động tuần",

    // Leaderboard
    leaderboard: "Bảng Xếp Hạng",
    noData: "Chưa có dữ liệu",

    // Q&A Section
    qna: "Hỏi đáp",

    // Tips
    tips: "Mẹo",

    // Utilities
    utilities: "Tiện ích",
    translationHistory: "Lịch sử Dịch",
    vocabularyPackage: "Gói Từ Vựng",
    words: "từ",
    searyToday: "Tra cứu hôm nay",
    comparedToYesterday: "so với hôm qua",
    history: "Lịch sử",
    vocabulary: "Từ vựng",

    // Customization
    customization: "Tùy Chỉnh",
    interfaceMode: "Chế độ giao diện",
    lightDark: "Sáng / Tối",
    systemMode: "Theo thiết bị",
    changeLayout: "Đổi bố cục",
    rearrangeModules: "Sắp xếp lại các module",

    // Banner
    discoverAI: "Khám phá Bài học AI",
    aiDesc:
      "Học tiếng Trung siêu tốc với AI cá nhân hóa. Chủ đề không giới hạn!",
    startNow: "Bắt đầu ngay ✨",
    upgradePro: "Nâng cấp lên Pro",
    proDesc: "Mở khoá tính năng cao cấp, không quảng cáo, nội dung chuyên sâu.",
    subscribeNow: "Đăng ký ngay",
    joinCommunity: "Tham gia cộng đồng",
    communityDesc: "Chia sẻ, thử thách và lên bảng xếp hạng mỗi tuần.",
    explore: "Khám phá",

    // Settings & Profile
    language: "Ngôn ngữ",
    settings: "Thiết Lập Liên Kết & Thời Gian",
    loginWith: "Đăng nhập với",
    createdAt: "Tạo lúc",
    chooseLanguage: "Chọn Ngôn Ngữ",
    languageUpdateSuccess: "Language updated successfully",
    languageUpdateFailed: "Cập nhật ngôn ngữ thất bại",
    personalProfile: "Trang cá nhân",
    profile: "Hồ sơ",
    editProfile: "Chỉnh sửa hồ sơ",
    changePasswordNotAllowed:
      "Tài khoản đăng nhập bằng bên thứ 3 không thể đổi mật khẩu!",
    userAccount: "Tên tài khoản",
    badge: "Huy hiệu",
    communityPoints: "Điểm cộng đồng",
    level: "Cấp độ",
    password: "Mật khẩu",
    changePassword: "Thay đổi mật khẩu",

    // AI Lesson
    vocabularies: "Từ vựng",
    phrases: "Cụm từ",
    dialogues: "Hội thoại",
    conversation: "Hội thoại",
    seller: "Người bán",
    buyer: "Người mua",
    startRevision: "Bắt đầu ôn tập",
    hideMeaning: "Ẩn nghĩa",
    showMeaning: "Xem nghĩa",

    // Community
    myPosts: "Đã đăng",
    interactedPosts: "Đã tương tác",

    // Community (components)
    createPostPlaceholder: "Bạn đang nghĩ gì?",
    feedAll: "Tất cả",
    feedFollowing: "Quan tâm",
    feedLiked: "Yêu thích",
    feedFeatured: "BTV lựa chọn",
    editPost: "Sửa bài",
    deletePost: "Xóa bài",
    report: "Báo cáo",
    reportPost: "Báo cáo bài viết",
    reportUser: "Báo cáo người dùng",
    reportReason: "Lý do",
    reportDetails: "Chi tiết",
    reportErrorMissingReason: "Vui lòng nhập lý do báo cáo.",
    reportSuccess: "Báo cáo đã được gửi thành công.",
    attachImage: "Đính kèm ảnh",
    selectImage: "Chọn ảnh",
    changeImage: "Thay đổi ảnh",
    permissionDenied: "Không có quyền truy cập thư viện ảnh.",
    imagePickError: "Lỗi khi chọn ảnh.",
    imagesAttached: "ảnh đã đính kèm",
    enterReportReason: "Nhập lý do báo cáo...",
    enterReportDetails: "Nhập chi tiết báo cáo...",
    errorLoadingUsersLikes: "Lỗi khi tải danh sách người thích",
    errorLoadingUsersViews: "Lỗi khi tải danh sách người xem",
    deletePostTitle: "Xóa bài viết",
    deletePostConfirmMessage: "Bạn có chắc chắn muốn xóa bài viết này không?",
    deletePostSuccess: "Xóa bài viết thành công",
    deletePostFailed: "Xóa bài viết thất bại",
    likesLabel: "Lượt thích",
    viewsLabel: "Lượt xem",
    noOneLikedPost: "Chưa có ai thích bài viết này",
    noOneViewedPost: "Chưa có ai xem bài viết này",
    createPostPlaceholderShort: "Bạn đang nghĩ gì?",
    like: "Thích",
    comment: "Bình luận",
    send: "Gửi",
    youHaventPostedAnyArticlesYet: "Bạn chưa đăng bài viết nào.",
    youHaventInteractedWithAnyPostsYet: "Bạn chưa tương tác với bài viết nào.",

    // Create Post
    createPostTitle: "Tạo bài viết",
    publish: "Đăng",
    createPostSuccess: "Đăng bài viết thành công",
    createPostFailed: "Đăng bài viết thất bại",
    postTitleLabel: "Tiêu đề",
    postTitlePlaceholder: "Nhập tiêu đề...",
    topicLabel: "Chủ đề",
    addImage: "Thêm ảnh",
    guidelinesPost:
      "Hãy chia sẻ nội dung có giá trị và tôn trọng cộng đồng. Bài viết sẽ được kiểm duyệt trước khi hiển thị.",
    contentLabel: "Nội dung",
    contentPlaceholder: "Chia sẻ điều gì đó với cộng đồng...",
    galleryPermissionRequired: "Quyền truy cập thư viện ảnh là bắt buộc!",

    // Topics
    topic_mechanics: "Cơ khí",
    topic_it: "CNTT",
    topic_translation: "Dịch",
    topic_study_abroad: "Du học",
    topic_travel: "Du lịch",
    topic_sharing: "Góc chia sẻ",
    topic_find_study_buddy: "Tìm bạn học chung",
    topic_study_chinese: "Học tiếng Trung",
    topic_find_tutor: "Tìm gia sư",
    topic_jobs: "Việc làm",
    topic_culture: "Văn hóa",
    topic_sports: "Thể thao",
    topic_construction: "Xây dựng",
    topic_health: "Y tế",
    topic_confessions: "Tâm sự",
    topic_other: "Khác",

    // Vocab Status
    mastered: "Đã thuộc",
    notMastered: "Chưa thuộc",
    uncertain: "Không chắc",
    favorite: "Yêu thích",
    vocabularyStats: "Thống kê từ vựng",
    noVocabToStats: "Không có từ để thống kê",

    // Time
    justNow: "Vừa xong",
    minutesAgo: "phút trước",
    hoursAgo: "giờ trước",
    daysAgo: "ngày trước",

    // Audio & Recording
    startSpeaking: "Bắt đầu nói!",
    micPermissionDenied: "Quyền Micro bị từ chối",
    micPermissionMessage:
      "Vui lòng cấp quyền Micro trong Cài đặt để sử dụng tính năng nhận diện giọng nói.",
    cancel: "Hủy",
    openSettings: "Mở Cài đặt",
    cannotStartRecording: "Không thể bắt đầu nhận diện giọng nói",
    pressToRecordYourAnswer: "Nhấn để ghi âm câu trả lời của bạn",

    // General Actions
    confirm: "Xác nhận",
    back: "Trở lại",
    save: "Lưu",
    delete: "Xóa",
    edit: "Chỉnh sửa",
    close: "Đóng",
    choose: "Chọn",
    share: "Chia sẻ",

    // Content unavailable
    contentNotAvailable: "Nội dung không khả dụng",

    // Tip categories
    allTips: "Tất cả",
    cultureTips: "Văn hóa",
    grammarTips: "Ngữ pháp",
    vocabularyTips: "Từ vựng",
    pronunciationTips: "Phát âm",
    slangTips: "Khẩu ngữ",
    listeningSkillTips: "Kỹ năng nghe",
    readingSkillTips: "Kỹ năng đọc",
    writingSkillTips: "Kỹ năng viết",

    // Tip levels
    basicLevel: "Sơ cấp",
    intermediateLevel: "Trung cấp",
    advancedLevel: "Cao cấp",
    // Home/Profile - Achievements & Support
    achievementsTitle: "Thành tích",
    achievementsLoadFailed: "Không thể tải danh sách thành tích",
    genericErrorTryAgain: "Đã xảy ra lỗi. Vui lòng thử lại.",
    achievementLocked: "Thành tích này chưa được mở khóa",
    navigateToAchievements: "Đi tới danh sách thành tích",

    // Notebook
    notebooksEmptyTitle: "Bạn chưa tạo sổ tay",
    notebooksEmptyDesc: "Tạo sổ tay để lưu trữ và quản lý từ vựng của bạn",
    createNotebook: "Tạo sổ tay mới",

    // Other / Devices / Logout
    otherTitle: "Khác",
    manageDevices: "Quản lý thiết bị",
    logout: "Đăng xuất",
    devicesTitle: "Thiết bị đang đăng nhập",
    loggingOut: "Đang đăng xuất...",
    logoutFailed: "Đăng xuất thất bại",

    // Support
    supportTitle: "Hỗ trợ cộng đồng & Đánh giá",
    shareWithFriends: "Chia sẻ với bạn bè",
    sendFeedback: "Góp ý với chúng tôi",
    rateApp: "Đánh giá ứng dụng",
    shareMessage:
      "Mình đang dùng ứng dụng này để học tiếng Trung, hãy tải về và cùng học nhé: https://your-app-link.com",

    // Charts / Stats
    translationStatsTitle: "Thống Kê Lượt Dịch",
    todayLabel: "Hôm nay",
    thisMonth: "Tháng này",
    dailyActivity: "Hoạt động theo ngày",
    activityReportChart: "Biểu đồ hoạt động",
    activityTimeline: "Chuỗi hoạt động",

    // Additional keys for profile components
    loggedInDevices: "Thiết bị đang đăng nhập",
    noDevices: "Không có thiết bị nào",
    logoutFromDevice: "Đăng xuất khỏi thiết bị",
    confirmLogout: "Xác nhận đăng xuất",
    logoutConfirmMessage: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này?",
    lastLogin: "Lần đăng nhập",
    translationStatistics: "Thống Kê Lượt Dịch",
    today: "Hôm nay",
    supportAndRating: "Hỗ trợ cộng đồng & Đánh giá",
    shareAppMessage:
      "Mình đang dùng ứng dụng này để học tiếng Trung, hãy tải về và cùng học nhé: https://your-app-link.com",
    notebooksLoadError: "Lỗi khi tải sổ tay",
    notebookDetailsTitle: "Thông Tin Chi Tiết Sổ Tay",
    viewDetails: "Xem chi tiết",

    // Change Password
    oldPassword: "Mật khẩu cũ",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu",
    passwordMismatch: "Mật khẩu không khớp",
    changePasswordSuccess: "Đổi mật khẩu thành công",
    changePasswordFailed: "Đổi mật khẩu thất bại",
    genericError: "Đã có lỗi xảy ra",

    // Register
    register: "Đăng ký",
    fullName: "Tên đầy đủ",
    emailOptional: "Email (tùy chọn)",
    forgotPassword: "Quên mật khẩu",
    or: "Hoặc",
    google: "Google",
    facebook: "Facebook",
    alreadyHaveAccount: "Đã có tài khoản?",
    loginNow: "Đăng nhập ngay",
    nameRequired: "Tên không được để trống",
    usernameRequired: "Username không được để trống",
    passwordRequired: "Mật khẩu không được để trống",
    passwordsDoNotMatch: "Mật khẩu không khớp",
    registrationSuccess: "Đăng ký thành công! Vui lòng đăng nhập.",
    registrationFailed: "Đăng ký thất bại. Vui lòng thử lại.",
    processing: "Đang xử lý...",
    creatingAccount: "Đang tạo tài khoản...",

    // Login
    loggingIn: "Đang đăng nhập...",
    loginSuccess: "Đăng nhập thành công",
    loginFailed: "Đăng nhập thất bại",
    noAccount: "Chưa có tài khoản?",
    registerNow: "Đăng ký ngay",

    // Basic Info Card
    basicInfo: "Thông Tin Cơ Bản",
    role: "Vai trò",
    updateNameSuccess: "Cập nhật tên tài khoản thành công",
    updateNameFailed: "Cập nhật tên tài khoản thất bại",

    // Contact Info Card
    contactInfo: "Thông Tin Liên Lạc & Phiên Bản",
    email: "Email",
    notLinked: "Chưa liên kết",
    version: "Phiên bản",
    free: "Miễn phí",
    id: "ID",

    // Email Verification
    notVerified: "Chưa xác thực",
    emailRequired: "Email là bắt buộc",
    addEmail: "Thêm Email",
    emailVerificationRequired: "Yêu cầu xác thực Email",
    emailVerificationRequiredMessage:
      "Bạn cần liên kết email để tiếp tục sử dụng đầy đủ tính năng của ứng dụng. Email giúp bảo mật tài khoản và khôi phục mật khẩu khi cần.",
    emailVerificationDescription:
      "Vui lòng nhập địa chỉ email hợp lệ của bạn để xác thực tài khoản.",
    enterEmail: "Nhập địa chỉ email",
    emailInvalid: "Email không hợp lệ",
    emailVerificationSuccess: "Xác thực email thành công",
    emailVerificationFailed: "Xác thực email thất bại",

    // Translate
    error: "Lỗi",
    pleaseEnterText: "Vui lòng nhập văn bản cần dịch",
    translationFailed: "Dịch thất bại",
    saveToNotebook: "Lưu vào sổ tay",
    selectNotebook: "Chọn sổ tay để lưu bản dịch này",
    tryAgain: "Vui lòng thử lại",
    noTranslationHistory: "Chưa có lịch sử dịch",
    noNormalTranslation: "Chưa có bản dịch thường",
    noAITranslation: "Chưa có bản dịch AI",
    startTranslating: "Hãy bắt đầu dịch để xem lịch sử tại đây",
    tryNormal: "Thử dịch bằng phương pháp thường",
    tryAI: "Thử dịch bằng AI để có kết quả thông minh hơn",
    startTranslate: "Bắt đầu dịch",
    loadingHistory: "Đang tải lịch sử dịch...",
    savedToNotebook: "Đã lưu vào sổ tay",
    copiedText: "Đã sao chép văn bản",
    cannotSpeak: "Không thể phát âm thanh",
    enterText: "Nhập văn bản cần dịch...",
    translating: "Đang dịch...",
    copiedTranslation: "Đã sao chép bản dịch",
    translateTo: "Dịch sang",
    normal: "Thường",
    ai: "AI",
    deleteHistory: "Xóa lịch sử dịch",
    confirmDelete: "Bạn có chắc chắn muốn xóa bản dịch này không?",
    deletedHistory: "Đã xóa lịch sử dịch thành công",
    cannotDeleteHistory: "Không thể xóa lịch sử dịch",
    errorDeleting: "Có lỗi xảy ra khi xóa lịch sử dịch",
    copiedToClipboard: "Đã sao chép vào clipboard",
    shareDeveloping: "Chức năng chia sẻ đang được phát triển",
    speechError: "Lỗi",
    cannotPronounce: "Không thể phát âm thanh",
    // Mock Test
    examType: "Loại bài thi",
    selectExamType: "Chọn loại bài thi",
    loadingLevels: "Đang tải cấp độ...",
    exam: "Bài thi",
    loadingExams: "Đang tải bài thi...",
    noExams: "Không có bài thi nào",
    startTest: "Bắt đầu làm bài",
    confirmStartTest: "Bạn có chắc chắn muốn bắt đầu làm bài thi: ",
    start: "Bắt đầu",
    errorLoadingTests: "Lỗi khi tải danh sách bài thi",
    errorLoadingLevels: "Lỗi khi tải danh sách cấp độ bài thi",
    errorLoadingExamTypes: "Lỗi khi tải danh sách loại bài thi",
    errorLoadingLeaderboard: "Lỗi khi tải bảng xếp hạng",
    // Tips
    errorLoadingTips: "Lỗi khi tải danh sách mẹo",
    seeAll: "Xem tất cả",
    loadingTests: "Đang tải bài thi...",
    noTestsForLevel: "Không có bài thi nào cho cấp độ này",
    loadingLeaderboard: "Đang tải bảng xếp hạng...",
    selectTestForLeaderboard: "Hãy chọn bài thi để xem bảng xếp hạng",
    questions: "câu",
    minutes: "phút",
    // Downloaded Tests
    errorFetchingDownloadedTests: "Có lỗi xảy ra khi tải danh sách bài thi",
    deleteTest: "Xóa bài thi",
    confirmDeleteTest: "Bạn có chắc muốn xóa",
    fromDevice: "khỏi thiết bị?",
    deletedTestSuccess: "Đã xóa bài thi khỏi thiết bị",
    errorDeletingTest: "Lỗi khi xóa bài thi",
    startTestTitle: "Bắt đầu làm bài",
    confirmStartTestMessage: "Bạn có chắc chắn muốn bắt đầu làm bài thi: ",
    startTestButton: "Bắt đầu",
    cancelButton: "Hủy",
    startTestCardButton: "Bắt đầu làm bài",
    noDownloadedTests: "Chưa có bài thi nào",
    downloadTestsDescription: "Tải xuống các bài thi để có thể làm bài offline",
    downloadedTestsTitle: "Bài thi đã tải xuống",
    // History
    errorLoadingHistory: "Lỗi tải lịch sử làm bài",
    errorFetchingHistory: "Lỗi khi tải lịch sử làm bài thi",
    scoreLabel: "Điểm",
    passedHistory: "Đã đạt",
    failedHistory: "Không đạt",
    timeLabel: "Thời gian",
    historyTitle: "Lịch sử làm bài thi",
    noHistory: "Không có lịch sử",
    // Mock Test Result
    loadingResult: "Đang tải kết quả...",
    errorFetchingResult: "Lỗi khi tải kết quả",
    question: "Câu",
    correct: "✓ Đúng",
    wrong: "✗ Sai",
    notAnswered: "- Chưa trả lời",
    questionContent: "📝 Nội dung câu hỏi:",
    options: "📋 Các lựa chọn:",
    you: "Bạn",
    correctAnswer: "✅ Đáp án đúng:",
    yourAnswer: "✍️ Câu trả lời của bạn:",
    detailedExplanation: "💡 Giải thích chi tiết:",
    passed: "ĐẠT",
    failed: "KHÔNG ĐẠT",
    score: "Điểm số",
    correctPercentage: "Tỷ lệ đúng",
    correctQuestions: "Câu đúng",
    testDuration: "Thời gian làm bài",
    completedAt: "Hoàn thành lúc",
    sectionScores: "Điểm từng phần",
    questionDetails: "Chi tiết câu hỏi",
    totalQuestions: "Tổng số câu hỏi",
    time: "Thời gian",
    explanation: "Giải thích:",
    // See All Exam
    noExamTypeInfo: "Không có thông tin loại bài thi",
    listening: "Nghe",
    speaking: "Nói",
    reading: "Đọc",
    writing: "Viết",
    // Take Test
    gradingTest: "Đang chấm bài...",
    submitError: "Lỗi khi nộp bài. Vui lòng thử lại.",
    submitTest: "Nộp bài",
    submitConfirmMessage:
      "Bạn có chắc muốn nộp bài? Hãy kiểm tra lại tất cả các câu hỏi trước khi nộp.",
    checkAgain: "Kiểm tra lại",
    timeUp: "Hết giờ",
    timeUpMessage: "Thời gian làm bài đã hết. Bài thi sẽ được nộp tự động.",
    sectionTimeUp: "Hết giờ phần thi",
    sectionTimeUpMessage:
      "Thời gian làm phần này đã hết. Chuyển sang phần tiếp theo?",
    continue: "Tiếp tục",
    exitTest: "Thoát bài thi",
    exitConfirmMessage: "Bạn có chắc muốn thoát?",
    exit: "Thoát",
    // Test Timer
    part: "Phần",
    paused: "Tạm dừng",
    // Test Overview
    noContent: "Không có nội dung",
    testInformation: "Thông tin bài thi",
    instructions: "Hướng dẫn",
    beginTest: "Bắt đầu",
    // Section Overview
    testTime: "Thời gian làm bài",
    sectionStructure: "Cấu trúc phần thi",
    stopAudioGuide: "Dừng audio hướng dẫn",
    listenAudioGuide: "Nghe audio hướng dẫn",
    startThisSection: "Bắt đầu phần này",
    skipThisSection: "Bỏ qua phần này",
    // Subsection Overview
    description: "Mô tả",
    information: "Thông tin",
    numberOfQuestions: "Số câu hỏi",
    // Test Bottom Actions
    previousQuestion: "Câu trước",
    submitting: "Đang nộp...",
    submitTestBottom: "Nộp bài",
    nextSection: "Phần tiếp theo",
    nextQuestion: "Câu sau",
    // Question Display
    questionWithPoints: "Câu",
    points: "điểm",
    // Question Navigation
    chooseQuestion: "Chọn câu hỏi",
    current: "Hiện tại",
    done: "Đã làm",
    notDone: "Chưa làm",
    // Ordering Question
    chooseWordsCorrectOrder: "Chọn các từ theo thứ tự đúng:",
    chooseSentencesCorrectOrder: "Chọn các câu theo thứ tự đúng:",
    chooseWordsCreateAnswer: "Chọn các từ để tạo câu trả lời",
    chooseSentencesOrder: "Chọn các câu theo thứ tự",
    wordsLabel: "Các từ:",
    sentencesLabel: "Các câu:",
    // Text Input Question
    enterYourAnswer: "Nhập câu trả lời của bạn...",
    yourAnswerLabel: "Câu trả lời của bạn:",
    characters: "ký tự",
    // AI Lesson Creator
    notification: "Thông báo",
    selectLevelRequired: "Vui lòng chọn cấp độ học tập",
    enterThemeRequired: "Vui lòng nhập chủ đề bài học",
    creatingAILesson: "Đang tạo bài học AI...",
    aiLessonCreatedSuccess: "Tạo bài học AI thành công",
    aiLessonCreatedFailed: "Tạo bài học AI thất bại",
    aiLessonCreationFailedRetry: "Tạo bài học AI thất bại. Vui lòng thử lại.",
    aiLessonTitle: "Tạo bài học AI",
    aiDescription:
      "AI sẽ tự động tạo bài học phù hợp với cấp độ và chủ đề bạn chọn",
    selectLevel: "Chọn cấp độ",
    basic: "Cơ bản",
    intermediate: "Trung cấp",
    advanced: "Cao cấp",
    enterTheme: "Nhập chủ đề",
    themePlaceholder: "Ví dụ: Du lịch, Thương mại, Chăm sóc sức khỏe...",
    suggestions: "Gợi ý:",
    travel: "Du lịch",
    shopping: "Mua sắm",
    commerce: "Thương mại",
    cuisine: "Ẩm thực",
    health: "Sức khỏe",
    education: "Giáo dục",
    creatingLesson: "Đang tạo bài học...",
    createAILessonButton: "Tạo bài học AI",
    aiLessonRevision: "Ôn tập bài học AI",
    phrase: "Cụm từ",
    complete: "Hoàn thành",
    switching: "Đang chuyển...",
    loadingNotebooks: "Đang tải sổ tay...",
    cannotLoadNotebooks: "Không thể tải sổ tay. Vui lòng thử lại sau.",
    errorLoadingNotebooks: "Đã xảy ra lỗi khi tải sổ tay",
    searchError: "Lỗi tìm kiếm. Vui lòng thử lại.",
    loginToContinue: "Đăng nhập để tiếp tục",
    notebookTitle: "Sổ tay học tập",
    // Sync Notebooks
    noNotebooksToSync: "Không có sổ tay nào để đồng bộ",
    syncNotebookSuccess: "Đồng bộ sổ tay thành công",
    syncNotebookError: "Đã xảy ra lỗi khi đồng bộ",
    seeAllTitle: "Xem tất cả",
    aiLessonResultTitle: "Kết quả bài học AI",
    aiLessonRevisionTitle: "Ôn tập bài học AI",
    // Modal Create Notebook
    enterNotebookName: "Vui lòng nhập tên sổ tay",
    notebookNameMinLength: "Tên sổ tay phải có ít nhất 2 ký tự",
    notebookNameMaxLength: "Tên sổ tay không được vượt quá 50 ký tự",
    creatingNotebook: "Đang tạo sổ tay...",
    notebookCreatedSuccess: "Tạo sổ tay thành công",
    errorCreatingNotebook: "Có lỗi xảy ra khi tạo sổ tay",
    createNewNotebook: "Tạo sổ tay mới",
    creating: "Đang tạo...",
    create: "Tạo",
    notebookNamePlaceholder: "Tên sổ tay *",
    // Modal Delete Notebook
    deletingNotebook: "Đang xóa sổ tay...",
    notebookDeletedSuccess: "Xóa sổ tay thành công",
    notebookDeletedFailed: "Xóa sổ tay thất bại",
    deleteNotebookTitle: "Xóa sổ tay",
    confirmDeleteNotebook: "Bạn có chắc chắn muốn xóa sổ tay này?",
    // Notebook Header
    searchNotebooks: "Tìm kiếm sổ tay...",
    // Notebook Section
    personalSection: "Cá nhân",
    freeSection: "Miễn phí",
    premiumSection: "Cao cấp",
    seeAllNotebooks: "Xem tất cả",
    allNotebooksTitle: "Tất cả sổ tay",
    noNotebooksInCategory: "Chưa có sổ tay nào trong danh mục này",
    noNotebooks: "Không có sổ tay nào",
    vocabularyCount: "từ vựng",
    noNotebooksCreate: "Chưa có sổ tay nào. Nhấn + để tạo mới.",
    // Home Components
    loading: "Đang tải...",
    noExamsYet: "Chưa có bài thi",
    errorLoadingDailyTranslation: "Lỗi khi tải dữ liệu so sánh dịch hàng ngày",
    // Notification Screen
    notificationTitle: "Thông báo",
    notificationDetail: "Chi tiết thông báo",
    loadingNotification: "Đang tải thông báo...",
    notificationNotFound: "Không tìm thấy thông báo",
    markAllAsRead: "Đánh dấu tất cả đã đọc",
    markAsReadSuccess: "Thông báo đã được đánh dấu là đã đọc",
    noNotifications: "Không có thông báo nào",
    notificationHighPriority: "Ưu tiên cao",
    readAt: "Đã đọc lúc",
    postNotFound: "Bài viết không tồn tại hoặc đã bị xóa",
    // Post Detail
    postDetail: "Chi tiết bài viết",
    cantReadPostData: "Không thể đọc dữ liệu bài viết",
    likePostError: "Lỗi khi thích bài viết",
    loadCommentError: "Lỗi khi tải bình luận",
    noComments: "Chưa có bình luận nào",
    loadingPostContent: "Đang tải nội dung bài viết...",
    replyingTo: "Đang trả lời",
    writeComment: "Viết bình luận...",
    sendCommentFailed: "Gửi bình luận thất bại",
    cantSendComment: "Không gửi được bình luận",
    reportReasonRequired: "Vui lòng nhập lý do báo cáo.",
    reportSentSuccess: "Báo cáo đã được gửi thành công.",
    reportError: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    // Tips Screen
    tipsTitle: "Mẹo",
    noTipsFound: "Chưa có mẹo nào",
    noTipsForLevel:
      "Hiện tại chưa có mẹo nào cho cấp độ này. Hãy thử chọn cấp độ khác!",
    errorParsingTips: "Lỗi khi parse params tips",
    // Notebook Detail Screen
    reviewVocab: "Trắc nghiệm",
    practiceNow: "Điền từ",
    pronunciation: "Phát âm",
    flashcard: "Flashcard",
    emptyNotebookMsg: "Không có từ vựng nào",
    addVocabToNotebook: "Hãy thêm từ vựng vào sổ tay của bạn",
    hskLevelLabel: "Cấp độ HSK *",
    selectAtLeastOneLevel: "Vui lòng chọn ít nhất một cấp độ",
    wordTypeLabel: "Từ loại *",
    selectAtLeastOneType: "Vui lòng chọn ít nhất một từ loại",
    editNotebookName: "Đổi tên sổ tay",
    editNotebookNamePlaceholder: "Nhập tên sổ tay mới",
    renameNotebookLoading: "Đang cập nhật tên sổ tay...",
    renameSuccess: "Cập nhật tên sổ tay thành công!",
    renameFailed: "Không thể cập nhật tên sổ tay",
    cannotRename: "Có lỗi xảy ra khi cập nhật tên sổ tay",
    saveButtonLabel: "Lưu",
    cancelButtonLabel: "Hủy",
    noVocabFound: "Không có từ vựng nào",
    soundError: "Lỗi",
    cannotPlayAudio: "Không thể phát âm thanh",
    nounLabel: "Danh từ",
    pronounLabel: "Đại từ",
    verbLabel: "Động từ",
    adjectiveLabel: "Tính từ",
    adverbLabel: "Trạng từ",
    prepositionLabel: "Giới từ",
    conjunctionLabel: "Liên từ",
    auxiliaryLabel: "Trợ từ",
    interjectionLabel: "Thán từ",
    numeralLabel: "Số từ",
    measureLabel: "Lượng từ",
    phraseLabel: "Cụm từ",
    completed: "Hoàn thành",
    correctAnswers: "Số câu đúng",
    tryAgainButton: "Làm lại",
    goBackButton: "Quay lại",
    goNextButton: "Tiếp tục",
    noVocabToReview: "Đã hết từ ôn tập",
    goBack: "Quay lại",

    //create Vocab
    createVocab: "Tạo từ vựng mới",
    hideButton: "Ẩn",
    vocabInfo: "Thông tin từ vựng",
    hanziLabel: "Ký tự Hán *",
    pinyinLabel: "Phiên âm Pinyin *",
    meaningLabel: "Nghĩa tiếng Việt *",
    notesLabel: "Ghi chú (tùy chọn)",
    imageUrlLabel: "URL hình ảnh (tùy chọn)",
    classification: "Phân loại",
    submitButton: "Tạo từ vựng",
    submittingButton: "Đang tạo...",
    searchVocabulary: "Tìm kiếm từ vựng...",
    addVocab: "Thêm từ vựng",
    searchResultsLabel: "Kết quả tìm kiếm",
    createNewVocabButton: "Tạo từ vựng mới",
    searching: "Đang tìm kiếm...",
    addToNotebookErrorMsg: "Lỗi khi thêm từ vào sổ tay",
    creatingVocab: "Đang tạo từ vựng...",
    createVocabSuccess: "Tạo từ vựng thành công!",
    createVocabError: "Không thể tạo từ vựng",
    addVocabSuccess: "Thêm từ vào sổ tay thành công!",
    addVocabToNotebookTitle: "Thêm từ vào sổ tay",
    pleaseCheckVocabInfo: "Vui lòng kiểm tra lại thông tin",
    hanziRequired: "Vui lòng nhập ký tự Hán",
    pinyinRequired: "Vui lòng nhập phiên âm Pinyin",
    meaningRequired: "Vui lòng nhập nghĩa tiếng Việt",
    wordTypesRequired: "Vui lòng chọn ít nhất một từ loại",
    levelsRequired: "Vui lòng chọn ít nhất một cấp độ HSK",

    // Notebook detail screens
    loadingVocab: "Đang tải từ vựng...",
    vocabListError: "Không thể lấy danh sách từ vựng",
    youSaid: "Bạn nói:",
    noDataMsg: "Chưa có dữ liệu",
    questionNum: "Câu",
    correctMsg: "Đúng",
    wrongMsg: "Sai — đáp án:",
    tryAgainBtn: "Thử lại",
    backBtn: "Về trước",
    noImageAvailable: "Không có ảnh",
    enterAnswer: "Nhập câu trả lời...",
    checkBtn: "Kiểm tra",
    copiedMsg: "Đã sao chép vào clipboard",
    statusUpdateSuccess: "Cập nhật trạng thái thành công",
    statusUpdateError: "Không thể cập nhật trạng thái",
    syncError:
      "Trạng thái đã được cập nhật, nhưng có lỗi khi đồng bộ một số sổ tay học",
    vocabNotFound: "Không tìm thấy thông tin từ vựng.",
    vocabDetails: "Chi tiết từ vựng",
    deleting: "Đang xóa từ vựng...",
    deleteSuccess: "Xóa từ vựng khỏi sổ tay thành công!",
    deleteError: "Có lỗi xảy ra khi xóa từ vựng khỏi sổ tay",
    deleteVocabMessage: "Bạn có chắc chắn muốn xóa từ vựng này?",
    nextWord: "Tiếp từ mới",
    wordFill: "Nghe và điền từ",

    // AI Translation
    aiTranslation: "Dịch AI",
    wordBreakdown: "Phân tích từ vựng",
    exampleSentences: "Câu ví dụ",

    // Subscription History
    subscriptionHistory: "Lịch sử gói đăng ký",
    currency: "đ",
    bankTransfer: "Chuyển khoản",
    confirmed: "Đã xác nhận",
    refund: "Hoàn tiền",
    refundRequest: "Yêu cầu hoàn tiền",
    confirmRefundMessage: "Bạn có chắc chắn muốn hoàn tiền cho gói",
    sendRequest: "Gửi yêu cầu",
    enterRefundReason: "Nhập lý do hoàn tiền...",
    refundReasonRequired: "Vui lòng nhập lý do hoàn tiền",
    refundRequestSuccess:
      "Đã gửi yêu cầu hoàn tiền thành công. Vui lòng đợi xử lý",
    errorOccurred: "Có lỗi xảy ra",
    refundError: "Có lỗi xảy ra khi hoàn tiền",

    // Subscriptions
    currentlyUsing: "đang sử dụng",
    pendingProcessing: "đang chờ xử lý",

    // Subscription History
    subscriptionList: "Danh sách Gói Đăng Ký",
    active: "Đang hoạt động",
    inactive: "Không hoạt động",
    startDate: "Bắt đầu:",
    expiryDate: "Hết hạn:",
    unlimited: "Không giới hạn",
    autoRenew: "Tự động gia hạn",
    autoRenewEnabled: "Đã bật tự động gia hạn",
    autoRenewDisabled: "Đã tắt tự động gia hạn",
    autoRenewChangeFailed: "Không thể thay đổi tự động gia hạn",

    // Payment History
    paymentHistory: "Lịch sử thanh toán",
    paymentRequestFailed: "Không thể yêu cầu thanh toán",
    paymentRequestError: "Có lỗi xảy ra khi yêu cầu thanh toán",
    subscriptionPurchaseSuccess: "Mua gói đăng ký thành công!",
    subscriptionPurchaseError: "Có lỗi xảy ra khi mua gói đăng ký",
    examDownloading: "Bài thi đang được tải xuống",
    examAlreadyDownloaded: "Bài thi đã được tải xuống",
    downloadingExam: "Đang tải bài thi xuống...",
    examDownloadSuccess: "Tải bài thi thành công!",
    examDeletedSuccess: "Đã xóa bài thi khỏi thiết bị",

    // Refund History
    refundHistory: "Lịch sử hoàn tiền",
    approved: "Đã duyệt",
    pending: "Đang chờ",
    rejected: "Đã từ chối",
    reason: "Lý do",

    // Violations
    violations: "Vi phạm",
    appeal: "Khiếu nại",
    appealReason: "Lý do khiếu nại",
    rules: "Quy tắc vi phạm",
    resolution: "Giải quyết",
    handled: "Đã xử lý",
    required: "bắt buộc",
    appealReasonRequired: "Vui lòng nhập lý do khiếu nại",
    appeals: "Khiếu nại",
    appealDate: "Ngày khiếu nại",
    violationDetails: "Chi tiết vi phạm",
    statusPending: "Đang chờ",
    statusResolved: "Đã giải quyết",
    statusRejected: "Đã từ chối",
    severity: "Mức độ nghiêm trọng",
    targetType: "Loại mục tiêu",
    resolvedAt: "Đã giải quyết lúc",
    notes: "Ghi chú",

    // Banned account messages
    accountBanned: "Tài khoản của bạn đang bị cấm",
    appealHere: "Nhấn vào đây để khiếu nại",
    sevenDaysBan:
      "Sau 7 ngày nếu không khiếu nại tài khoản của bạn sẽ bị cấm vĩnh viễn",
    appealSent: "Đã gửi khiếu nại",
    waitAppeal: "Vui lòng đợi kết quả khiếu nại",
    accountPermanentlyBanned: "Tài khoản của bạn đã bị cấm vĩnh viễn",
    appealRejected: "Khiếu nại bị từ chối",

    // Post Card
    seeMore: "Xem thêm",
    collapse: "Thu gọn",
    historyLessonAi: "Lịch sử bài học AI",
    testNotSubmitted: "Bài thi chưa được nộp",

    // Milestone Messages
    catStart: "Mèo bắt đầu",
    catWashFace: "Mèo khởi động học tập",
    catHamHoc: "Mèo ham học",
    catThichHoc: "Mèo yêu thích học",
    catTapTrung: "Mèo tập trung cao độ",
    catCanCu: "Mèo chăm học",
    catTienBo: "Mèo tiến bộ vượt bậc",
    catSiengNang: "Mèo rất siêng năng",
    catChamChi: "Mèo học chăm chỉ",
    catHocXuatSac: "Mèo học xuất sắc",
    catThaoTinhThong: "Mèo tinh thông tiếng Trung",
    catBacThayNgonNgu: "Mèo bậc thầy ngôn ngữ",
    catSieuThongThai: "Mèo siêu thông thái",
  },
  en: {
    success: "success",
    username: "Username",
    wordType: "Word Type",
    status: "Status",
    add: "Add",
    note: "Note",
    vocabularyStatistics: "Vocabulary Statistics",
    // Navigation & Tabs
    home: "Home",
    translate: "Translate",
    mockTest: "Mock Test",
    noteOrAi: "Notebook",
    aiLesson: "AI Lesson",
    community: "Community",

    // Home Screen
    welcome: "Hello",
    login: "Login",
    studyGreeting: "Have a great time studying",
    search: "Search",
    loginRequired: "Please log in to use the app.",

    // Home Components
    aiLessons: "AI Lessons",
    aiLessonsDesc: "Enable super-speed learning mode",
    unlimitedTopics: "Unlimited topics",
    studyWithAI: "Learn addictively with AI",
    createAILesson: "Create AI Lesson",

    // Personal Stats
    personal: "Personal",
    maintainStreak: "Translate 1 word to maintain streak",
    habitFormed: "Habit formed!",
    diligenceMakesUpForDiligence: "Diligence makes up for diligence!",
    diligenceMakesUpForIntelligence: "Diligence makes up for intelligence!",
    diligentBlackCat: "Diligent black cat!",
    catCultivatesIntoSpirit: "Cat cultivates into a spirit!",
    streak: "Streak",
    days: "days",
    keepLearning: "Keep the learning fire!",
    thisWeek: "This week",
    weekActivity: "Weekly activity calendar",

    // Leaderboard
    leaderboard: "Leaderboard",
    noData: "No data available",

    // Q&A Section
    qna: "Q&A",

    // Tips
    tips: "Tips",

    // Utilities
    utilities: "Utilities",
    translationHistory: "Translation History",
    vocabularyPackage: "Vocabulary Package",
    words: "words",
    searyToday: "Search today",

    // Customization
    customization: "Customization",
    interfaceMode: "Interface mode",
    lightDark: "Light / Dark",
    systemMode: "System default",
    changeLayout: "Change layout",
    rearrangeModules: "Rearrange modules",

    // Banner
    discoverAI: "Discover AI Lessons",
    aiDesc: "Learn Chinese super fast with personalized AI. Unlimited topics!",
    startNow: "Start now ✨",
    upgradePro: "Upgrade to Pro",
    proDesc: "Unlock premium features, no ads, in-depth content.",
    subscribeNow: "Subscribe now",
    joinCommunity: "Join community",
    communityDesc: "Share, challenge, and climb the weekly leaderboard.",
    explore: "Explore",

    // Settings & Profile
    language: "Language",
    settings: "Link & Time Settings",
    loginWith: "Login with",
    createdAt: "Created at",
    chooseLanguage: "Choose Language",
    languageUpdateSuccess: "Cập nhật ngôn ngữ thành công",
    languageUpdateFailed: "Language update failed",
    personalProfile: "Personal Profile",
    profile: "Profile",
    editProfile: "Edit Profile",
    changePasswordNotAllowed:
      "Third-party login accounts cannot change password!",
    userAccount: "User Account",
    badge: "Badge",
    communityPoints: "Community Points",
    level: "Level",
    password: "Password",
    changePassword: "Change Password",

    // AI Lesson
    vocabularies: "Vocabularies",
    phrases: "Phrases",
    dialogues: "Dialogues",
    conversation: "Conversation",
    seller: "Seller",
    buyer: "Buyer",
    startRevision: "Start Revision",
    hideMeaning: "Hide meaning",
    showMeaning: "Show meaning",

    // Community
    myPosts: "Posted",
    interactedPosts: "Interacted",

    // Community (components)
    createPostPlaceholder: "What's on your mind?",
    feedAll: "All",
    feedFollowing: "Following",
    feedLiked: "Liked",
    feedFeatured: "Featured",
    editPost: "Edit post",
    deletePost: "Delete post",
    report: "Report",
    reportPost: "Report post",
    reportUser: "Report user",
    reportReason: "Reason",
    reportDetails: "Details",
    reportErrorMissingReason: "Please enter a report reason.",
    reportSuccess: "Report sent successfully.",
    attachImage: "Attach Image",
    selectImage: "Select Image",
    changeImage: "Change Image",
    permissionDenied: "Permission denied for photo library.",
    imagePickError: "Error picking image.",
    imagesAttached: "images attached",
    enterReportReason: "Enter report reason...",
    enterReportDetails: "Enter report details...",
    errorLoadingUsersLikes: "Failed to load likes list",
    errorLoadingUsersViews: "Failed to load views list",
    deletePostTitle: "Delete post",
    deletePostConfirmMessage: "Are you sure you want to delete this post?",
    deletePostSuccess: "Post deleted successfully",
    deletePostFailed: "Failed to delete post",
    likesLabel: "Likes",
    viewsLabel: "Views",
    noOneLikedPost: "No one liked this post yet",
    noOneViewedPost: "No one viewed this post yet",
    createPostPlaceholderShort: "What's on your mind?",
    like: "Like",
    comment: "Comment",
    send: "Send",
    youHaventPostedAnyArticlesYet: "You haven't posted any articles yet.",
    youHaventInteractedWithAnyPostsYet:
      "You haven't interacted with any posts yet.",
    // Create Post
    createPostTitle: "Create Post",
    publish: "Publish",
    createPostSuccess: "Post created successfully",
    createPostFailed: "Failed to create post",
    postTitleLabel: "Title",
    postTitlePlaceholder: "Enter title...",
    topicLabel: "Topic",
    addImage: "Add image",
    guidelinesPost:
      "Share valuable content and respect the community. Posts may be moderated before being displayed.",
    contentLabel: "Content",
    contentPlaceholder: "Share something with the community...",
    galleryPermissionRequired: "Permission to access gallery is required!",

    // Topics
    topic_mechanics: "Mechanics",
    topic_it: "IT",
    topic_translation: "Translation",
    topic_study_abroad: "Study abroad",
    topic_travel: "Travel",
    topic_sharing: "Share corner",
    topic_find_study_buddy: "Find study buddy",
    topic_study_chinese: "Study Chinese",
    topic_find_tutor: "Find tutor",
    topic_jobs: "Jobs",
    topic_culture: "Culture",
    topic_sports: "Sports",
    topic_construction: "Construction",
    topic_health: "Health",
    topic_confessions: "Confessions",
    topic_other: "Other",

    // Vocab Status
    mastered: "Mastered",
    notMastered: "Not mastered",
    uncertain: "Uncertain",
    favorite: "Favorite",
    vocabularyStats: "Vocabulary Statistics",
    noVocabToStats: "No vocabulary to show statistics",

    // Time
    justNow: "Just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",

    // Audio & Recording
    startSpeaking: "Start speaking!",
    micPermissionDenied: "Microphone permission denied",
    micPermissionMessage:
      "Please grant microphone permission in Settings to use speech recognition.",
    cancel: "Cancel",
    openSettings: "Open Settings",
    cannotStartRecording: "Cannot start speech recognition",
    pressToRecordYourAnswer: "Press to record your answer",

    // General Actions
    confirm: "Confirm",
    back: "Back",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",

    postNotFound: "Post not found or has been deleted",

    // Content unavailable
    contentNotAvailable: "Content not available",

    // Tip categories
    allTips: "All",
    cultureTips: "Culture",
    grammarTips: "Grammar",
    vocabularyTips: "Vocabulary",
    pronunciationTips: "Pronunciation",
    slangTips: "Slang",
    listeningSkillTips: "Listening Skills",
    readingSkillTips: "Reading Skills",
    writingSkillTips: "Writing Skills",

    // Tip levels
    basicLevel: "Basic",
    intermediateLevel: "Intermediate",
    advancedLevel: "Advanced",

    // Home/Profile - Achievements & Support
    achievementsTitle: "Achievements",
    achievementsLoadFailed: "Failed to load achievements list",
    genericErrorTryAgain: "An error occurred. Please try again.",
    achievementLocked: "This achievement is locked",
    navigateToAchievements: "Go to achievements list",
    choose: "Choose",
    share: "Share",

    // Notebook
    notebooksEmptyTitle: "No notebooks created yet",
    notebooksEmptyDesc: "Create notebooks to store and manage your vocabulary",
    createNotebook: "Create new notebook",

    // Other / Devices / Logout
    otherTitle: "Other",
    manageDevices: "Manage devices",
    logout: "Logout",
    devicesTitle: "Logged in devices",
    loggingOut: "Logging out...",
    logoutFailed: "Logout failed",

    // Support
    supportTitle: "Community support & Rating",
    shareWithFriends: "Share with friends",
    sendFeedback: "Send us feedback",
    rateApp: "Rate app",
    shareMessage:
      "I'm using this app to learn Chinese, download it and learn with me: https://your-app-link.com",

    // Charts / Stats
    translationStatsTitle: "Translation Statistics",
    todayLabel: "Today",
    thisMonth: "This month",
    dailyActivity: "Daily activity",
    activityReportChart: "Activity Report Chart",
    activityTimeline: "Activity Timeline",

    // Additional keys for profile components
    loggedInDevices: "Logged in devices",
    noDevices: "No devices",
    logoutFromDevice: "Logout from device",
    confirmLogout: "Confirm logout",
    logoutConfirmMessage: "Are you sure you want to logout from this account?",
    lastLogin: "Last login",
    translationStatistics: "Translation Statistics",
    today: "Today",
    supportAndRating: "Community support & Rating",
    shareAppMessage:
      "I'm using this app to learn Chinese, download it and learn with me: https://your-app-link.com",
    notebooksLoadError: "Error loading notebooks",
    notebookDetailsTitle: "Notebook Details",
    viewDetails: "View details",

    // Change Password
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    passwordMismatch: "Passwords do not match",
    changePasswordSuccess: "Password changed successfully",
    changePasswordFailed: "Password change failed",
    genericError: "An error occurred",

    // Register
    register: "Register",
    fullName: "Full name",
    emailOptional: "Email (optional)",
    forgotPassword: "Forgot password",
    or: "Or",
    google: "Google",
    facebook: "Facebook",
    alreadyHaveAccount: "Already have an account?",
    loginNow: "Login now",
    nameRequired: "Name is required",
    usernameRequired: "Username is required",
    passwordRequired: "Password is required",
    passwordsDoNotMatch: "Passwords do not match",
    registrationSuccess: "Registration successful! Please log in.",
    registrationFailed: "Registration failed. Please try again.",
    processing: "Processing...",
    creatingAccount: "Creating account...",

    // Login
    loggingIn: "Logging in...",
    loginSuccess: "Login successful",
    loginFailed: "Login failed",
    noAccount: "Don't have an account?",
    registerNow: "Register now",

    // Basic Info Card
    basicInfo: "Basic Information",
    role: "Role",
    updateNameSuccess: "Account name updated successfully",
    updateNameFailed: "Failed to update account name",

    // Contact Info Card
    contactInfo: "Contact Information & Version",
    email: "Email",
    notLinked: "Not linked",
    version: "Version",
    free: "Free",
    id: "ID",

    // Email Verification
    notVerified: "Not Verified",
    emailRequired: "Email is required",
    addEmail: "Add Email",
    emailVerificationRequired: "Email Verification Required",
    emailVerificationRequiredMessage:
      "You need to link your email to continue using all app features. Email helps secure your account and recover your password when needed.",
    emailVerificationDescription:
      "Please enter your valid email address to verify your account.",
    enterEmail: "Enter email address",
    emailInvalid: "Invalid email address",
    emailVerificationSuccess: "Email verified successfully",
    emailVerificationFailed: "Email verification failed",

    // Translate
    error: "Error",
    pleaseEnterText: "Please enter text to translate",
    translationFailed: "Translation failed",
    saveToNotebook: "Save to notebook",
    selectNotebook: "Select notebook to save this translation",
    tryAgain: "Please try again",
    noTranslationHistory: "No translation history yet",
    noNormalTranslation: "No normal translations yet",
    noAITranslation: "No AI translations yet",
    startTranslating: "Start translating to see history here",
    tryNormal: "Try translating with normal method",
    tryAI: "Try AI for smarter results",
    startTranslate: "Start translating",
    loadingHistory: "Loading translation history...",
    savedToNotebook: "Saved to notebook",
    copiedText: "Text copied",
    cannotSpeak: "Cannot speak",
    enterText: "Enter text...",
    translating: "Translating...",
    copiedTranslation: "Translation copied",
    translateTo: "Translate to",
    normal: "Normal",
    ai: "AI",
    deleteHistory: "Delete translation history",
    confirmDelete: "Are you sure you want to delete this translation?",
    deletedHistory: "Translation history deleted successfully",
    cannotDeleteHistory: "Cannot delete translation history",
    errorDeleting: "Error occurred while deleting translation history",
    copiedToClipboard: "Copied to clipboard",
    shareDeveloping: "Share feature is under development",
    speechError: "Error",
    cannotPronounce: "Cannot pronounce",
    // Mock Test
    examType: "Exam Type",
    selectExamType: "Select exam type",
    loadingLevels: "Loading levels...",
    exam: "Exam",
    loadingExams: "Loading exams...",
    noExams: "No exams available",
    startTest: "Start taking test",
    confirmStartTest: "Are you sure you want to start the test: ",
    start: "Start",
    errorLoadingTests: "Error loading test list",
    errorLoadingLevels: "Error loading exam level list",
    errorLoadingExamTypes: "Error loading exam type list",
    errorLoadingLeaderboard: "Error loading leaderboard",
    // Tips
    errorLoadingTips: "Error loading tips list",
    seeAll: "See all",
    loadingTests: "Loading tests...",
    noTestsForLevel: "No tests for this level",
    loadingLeaderboard: "Loading leaderboard...",
    selectTestForLeaderboard: "Please select a test to view the leaderboard",
    questions: "questions",
    minutes: "minutes",
    // Downloaded Tests
    errorFetchingDownloadedTests: "Error occurred while loading test list",
    deleteTest: "Delete test",
    confirmDeleteTest: "Are you sure you want to delete",
    fromDevice: "from device?",
    deletedTestSuccess: "Test deleted from device",
    errorDeletingTest: "Error deleting test",
    startTestTitle: "Start test",
    confirmStartTestMessage: "Are you sure you want to start the test: ",
    startTestButton: "Start",
    cancelButton: "Cancel",
    startTestCardButton: "Start test",
    noDownloadedTests: "No tests downloaded yet",
    downloadTestsDescription: "Download tests to be able to take them offline",
    downloadedTestsTitle: "Downloaded Tests",
    // History
    errorLoadingHistory: "Error loading history",
    errorFetchingHistory: "Error fetching test history",
    scoreLabel: "Score",
    passedHistory: "Passed",
    failedHistory: "Failed",
    timeLabel: "Time",
    historyTitle: "Test History",
    noHistory: "No history",
    testNotSubmitted: "Test not submitted",
    // Mock Test Result
    loadingResult: "Loading results...",
    errorFetchingResult: "Error fetching result",
    question: "Question",
    correct: "✓ Correct",
    wrong: "✗ Wrong",
    notAnswered: "- Not answered",
    questionContent: "📝 Question content:",
    options: "📋 Options:",
    you: "You",
    correctAnswer: "✅ Correct answer:",
    yourAnswer: "✍️ Your answer:",
    detailedExplanation: "💡 Detailed explanation:",
    passed: "PASSED",
    failed: "FAILED",
    score: "Score",
    correctPercentage: "Correct percentage",
    correctQuestions: "Correct questions",
    testDuration: "Test duration",
    completedAt: "Completed at",
    sectionScores: "Section scores",
    questionDetails: "Question details",
    totalQuestions: "Total questions",
    time: "Time",
    explanation: "Explanation:",
    // See All Exam
    noExamTypeInfo: "No exam type information",
    listening: "Listening",
    speaking: "Speaking",
    reading: "Reading",
    writing: "Writing",
    // Take Test
    gradingTest: "Grading test...",
    submitError: "Error submitting test. Please try again.",
    submitTest: "Submit test",
    submitConfirmMessage:
      "Are you sure you want to submit? Please check all questions before submitting.",
    checkAgain: "Check again",
    timeUp: "Time's up",
    timeUpMessage: "Time is up. The test will be submitted automatically.",
    sectionTimeUp: "Section time's up",
    sectionTimeUpMessage: "Time for this section is up. Move to next section?",
    continue: "Continue",
    exitTest: "Exit test",
    exitConfirmMessage: "Are you sure you want to exit?",
    exit: "Exit",
    // Test Timer
    part: "Part",
    paused: "Paused",
    // Test Overview
    noContent: "No content",
    testInformation: "Test information",
    instructions: "Instructions",
    beginTest: "Begin",
    // Section Overview
    testTime: "Test time",
    sectionStructure: "Section structure",
    stopAudioGuide: "Stop guide audio",
    listenAudioGuide: "Listen to guide audio",
    startThisSection: "Start this section",
    skipThisSection: "Skip this section",
    // Subsection Overview
    description: "Description",
    information: "Information",
    numberOfQuestions: "Number of questions",
    // Test Bottom Actions
    previousQuestion: "Previous question",
    submitting: "Submitting...",
    submitTestBottom: "Submit test",
    nextSection: "Next section",
    nextQuestion: "Next question",
    // Question Display
    questionWithPoints: "Question",
    points: "points",
    // Question Navigation
    chooseQuestion: "Choose question",
    current: "Current",
    done: "Done",
    notDone: "Not done",
    // Ordering Question
    chooseWordsCorrectOrder: "Choose the words in the correct order:",
    chooseSentencesCorrectOrder: "Choose the sentences in the correct order:",
    chooseWordsCreateAnswer: "Choose words to create an answer",
    chooseSentencesOrder: "Choose sentences in order",
    wordsLabel: "Words:",
    sentencesLabel: "Sentences:",
    // Text Input Question
    enterYourAnswer: "Enter your answer...",
    yourAnswerLabel: "Your answer:",
    characters: "characters",
    // AI Lesson Creator
    notification: "Notification",
    selectLevelRequired: "Please select learning level",
    enterThemeRequired: "Please enter lesson topic",
    creatingAILesson: "Creating AI lesson...",
    aiLessonCreatedSuccess: "AI lesson created successfully",
    aiLessonCreatedFailed: "AI lesson creation failed",
    aiLessonCreationFailedRetry: "AI lesson creation failed. Please try again.",
    aiLessonTitle: "Create AI Lesson",
    aiDescription:
      "AI will automatically create a lesson suitable for the level and topic you choose",
    selectLevel: "Select level",
    basic: "Basic",
    intermediate: "Intermediate",
    advanced: "Advanced",
    enterTheme: "Enter topic",
    themePlaceholder: "Example: Travel, Commerce, Health care...",
    suggestions: "Suggestions:",
    travel: "Travel",
    shopping: "Shopping",
    commerce: "Commerce",
    cuisine: "Cuisine",
    health: "Health",
    education: "Education",
    creatingLesson: "Creating lesson...",
    createAILessonButton: "Create AI Lesson",
    aiLessonRevision: "AI Lesson Revision",
    vocabulary: "Vocabulary",
    phrase: "Phrase",
    complete: "Complete",
    switching: "Switching...",
    loadingNotebooks: "Loading notebooks...",
    cannotLoadNotebooks: "Cannot load notebooks. Please try again later.",
    errorLoadingNotebooks: "An error occurred while loading notebooks",
    searchError: "Search error. Please try again.",
    loginToContinue: "Login to continue",
    notebookTitle: "Learning Notebook",
    // Sync Notebooks
    noNotebooksToSync: "No notebooks to sync",
    syncNotebookSuccess: "Notebooks synced successfully",
    syncNotebookError: "An error occurred while syncing",
    seeAllTitle: "See all",
    aiLessonResultTitle: "AI Lesson Result",
    aiLessonRevisionTitle: "AI Lesson Revision",
    // Modal Create Notebook
    enterNotebookName: "Please enter notebook name",
    notebookNameMinLength: "Notebook name must have at least 2 characters",
    notebookNameMaxLength: "Notebook name must not exceed 50 characters",
    creatingNotebook: "Creating notebook...",
    notebookCreatedSuccess: "Notebook created successfully",
    errorCreatingNotebook: "Error occurred when creating notebook",
    createNewNotebook: "Create new notebook",
    creating: "Creating...",
    create: "Create",
    notebookNamePlaceholder: "Notebook name *",
    // Modal Delete Notebook
    deletingNotebook: "Deleting notebook...",
    notebookDeletedSuccess: "Notebook deleted successfully",
    notebookDeletedFailed: "Notebook deletion failed",
    deleteNotebookTitle: "Delete notebook",
    confirmDeleteNotebook: "Are you sure you want to delete this notebook?",
    // Notebook Header
    searchNotebooks: "Search notebooks...",
    // Notebook Section
    personalSection: "Personal",
    freeSection: "Free",
    premiumSection: "Premium",
    seeAllNotebooks: "See all",
    allNotebooksTitle: "All Notebooks",
    noNotebooksInCategory: "No notebooks in this category yet",
    noNotebooks: "No notebooks",
    vocabularyCount: "vocabulary",
    noNotebooksCreate: "No notebooks yet. Press + to create new.",
    // Home Components
    loading: "Loading...",
    noExamsYet: "No exams yet",
    errorLoadingDailyTranslation:
      "Error loading daily translation comparison data",
    // Notification Screen
    notificationTitle: "Notifications",
    notificationDetail: "Notification Details",
    loadingNotification: "Loading notification...",
    notificationNotFound: "Notification not found",
    markAllAsRead: "Mark all as read",
    markAsReadSuccess: "Notification marked as read",
    noNotifications: "No notifications",
    notificationHighPriority: "High priority",
    readAt: "Read at",
    // Post Detail
    postDetail: "Post Details",
    cantReadPostData: "Cannot read post data",
    likePostError: "Error liking post",
    loadCommentError: "Error loading comments",
    noComments: "No comments yet",
    loadingPostContent: "Loading post content...",
    replyingTo: "Replying to",
    writeComment: "Write a comment...",
    sendCommentFailed: "Failed to send comment",
    cantSendComment: "Cannot send comment",
    reportReasonRequired: "Please enter a report reason.",
    reportSentSuccess: "Report sent successfully.",
    reportError: "An error occurred. Please try again.",
    // Tips Screen
    tipsTitle: "Tips",
    noTipsFound: "No tips found",
    noTipsForLevel: "No tips for this level yet. Try selecting another level!",
    errorParsingTips: "Error parsing tips parameters",
    // Notebook Detail Screen
    reviewVocab: "Multiple choice",
    practiceNow: "Fill Words",
    pronunciation: "Pronunciation",
    flashcard: "Flashcard",
    emptyNotebookMsg: "No vocabulary yet",
    addVocabToNotebook: "Add vocabulary to your notebook",
    hskLevelLabel: "HSK Level *",
    selectAtLeastOneLevel: "Please select at least one level",
    wordTypeLabel: "Word Type *",
    selectAtLeastOneType: "Please select at least one word type",
    editNotebookName: "Edit notebook name",
    editNotebookNamePlaceholder: "Enter new notebook name",
    renameNotebookLoading: "Updating notebook name...",
    renameSuccess: "Notebook name updated successfully!",
    renameFailed: "Failed to update notebook name",
    cannotRename: "An error occurred while updating notebook name",
    saveButtonLabel: "Save",
    cancelButtonLabel: "Cancel",
    noVocabFound: "No vocabulary found",
    soundError: "Error",
    cannotPlayAudio: "Cannot play audio",
    nounLabel: "Noun",
    pronounLabel: "Pronoun",
    verbLabel: "Verb",
    adjectiveLabel: "Adjective",
    adverbLabel: "Adverb",
    prepositionLabel: "Preposition",
    conjunctionLabel: "Conjunction",
    auxiliaryLabel: "Auxiliary",
    interjectionLabel: "Interjection",
    numeralLabel: "Numeral",
    measureLabel: "Measure word",
    phraseLabel: "Phrase",
    completed: "Completed",
    correctAnswers: "Correct answers",
    tryAgainButton: "Try again",
    goBackButton: "Go back",
    goNextButton: "Go next",
    noVocabToReview: "No vocabulary to review",
    goBack: "Go back",

    //create Vocab
    createVocab: "Create New Vocabulary",
    hideButton: "Hide",
    vocabInfo: "Vocabulary Information",
    hanziLabel: "Hanzi Character *",
    pinyinLabel: "Pinyin *",
    meaningLabel: "Vietnamese Meaning *",
    notesLabel: "Notes (optional)",
    imageUrlLabel: "Image URL (optional)",
    classification: "Classification",
    submitButton: "Create Vocabulary",
    submittingButton: "Creating...",
    searchVocabulary: "Search vocabulary...",
    addVocab: "Add vocabulary",
    searchResultsLabel: "Search Results",
    createNewVocabButton: "Create New Vocabulary",
    searching: "Searching...",
    addToNotebookErrorMsg: "Error adding vocabulary to notebook",
    creatingVocab: "Creating vocabulary...",
    createVocabSuccess: "Vocabulary created successfully!",
    createVocabError: "Cannot create vocabulary",
    addVocabSuccess: "Vocabulary added to notebook successfully!",
    addVocabToNotebookTitle: "Add vocabulary to notebook",
    pleaseCheckVocabInfo: "Please check the information again",
    hanziRequired: "Please enter Hanzi character",
    pinyinRequired: "Please enter Pinyin",
    meaningRequired: "Please enter Vietnamese meaning",
    wordTypesRequired: "Please select at least one word type",
    levelsRequired: "Please select at least one HSK level",

    // Notebook detail screens
    loadingVocab: "Loading vocabulary...",
    vocabListError: "Cannot get vocabulary list",
    youSaid: "You said:",
    noDataMsg: "No data yet",
    questionNum: "Question",
    correctMsg: "Correct",
    wrongMsg: "Wrong — answer:",
    tryAgainBtn: "Try again",
    backBtn: "Go back",
    noImageAvailable: "No image",
    enterAnswer: "Enter your answer...",
    checkBtn: "Check",
    copiedMsg: "Copied to clipboard",
    statusUpdateSuccess: "Status updated successfully",
    statusUpdateError: "Cannot update status",
    syncError:
      "Status updated, but there was an error syncing some learning notebooks",
    vocabNotFound: "Vocabulary information not found.",
    vocabDetails: "Vocabulary Details",
    deleting: "Deleting vocabulary...",
    deleteSuccess: "Vocabulary deleted from notebook successfully!",
    deleteError: "Error deleting vocabulary from notebook",
    deleteVocabMessage: "Are you sure you want to delete this vocabulary?",
    nextWord: "Next word",
    wordFill: "Listen and fill",

    // AI Translation
    aiTranslation: "AI Translation",
    wordBreakdown: "Word Breakdown",
    exampleSentences: "Example Sentences",

    // Subscription History
    subscriptionHistory: "Subscription History",
    currency: "VND",
    bankTransfer: "Bank Transfer",
    confirmed: "Confirmed",
    refund: "Refund",
    refundRequest: "Refund Request",
    confirmRefundMessage: "Are you sure you want to refund for package",
    sendRequest: "Send Request",

    enterRefundReason: "Enter refund reason...",
    refundReasonRequired: "Please enter refund reason",
    refundRequestSuccess:
      "Refund request sent successfully. Please wait for processing",
    errorOccurred: "An error occurred",
    refundError: "An error occurred during refund",

    // Subscriptions
    currentlyUsing: "currently using",
    pendingProcessing: "pending processing",

    // Subscription History
    subscriptionList: "Subscription List",
    active: "Active",
    inactive: "Inactive",
    startDate: "Start:",
    expiryDate: "Expiry:",
    unlimited: "Unlimited",
    autoRenew: "Auto Renew",
    autoRenewEnabled: "Auto renew enabled",
    autoRenewDisabled: "Auto renew disabled",
    autoRenewChangeFailed: "Cannot change auto renew",

    // Payment History
    paymentHistory: "Payment History",
    paymentRequestFailed: "Cannot request payment",
    paymentRequestError: "Error occurred when requesting payment",
    subscriptionPurchaseSuccess: "Subscription purchased successfully!",
    subscriptionPurchaseError: "Error occurred when buying subscription",
    examDownloading: "Exam is being downloaded",
    examAlreadyDownloaded: "Exam has been downloaded",
    downloadingExam: "Downloading exam...",
    examDownloadSuccess: "Exam downloaded successfully!",
    examDeletedSuccess: "Exam deleted from device",

    // Refund History
    refundHistory: "Refund History",
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    reason: "Reason",

    // Violations
    violations: "Violations",
    appeal: "Appeal",
    appealReason: "Appeal reason",
    rules: "Violation rules",
    resolution: "Resolution",
    handled: "Handled",
    required: "required",
    appealReasonRequired: "Please enter appeal reason",
    appeals: "Appeals",
    appealDate: "Appeal date",
    violationDetails: "Violation details",
    statusPending: "Pending",
    statusResolved: "Resolved",
    statusRejected: "Rejected",
    severity: "Severity",
    targetType: "Target type",
    resolvedAt: "Resolved at",
    notes: "Notes",

    // Banned account messages
    accountBanned: "Your account is banned",
    appealHere: "Click here to appeal",
    sevenDaysBan:
      "After 7 days if you don't appeal, your account will be permanently banned",
    appealSent: "Appeal sent",
    waitAppeal: "Please wait for appeal result",
    accountPermanentlyBanned: "Your account has been permanently banned",
    appealRejected: "Appeal rejected",

    // Post Card
    seeMore: "See more",
    collapse: "Collapse",
    historyLessonAi: "AI Lesson History",

    // Milestone Messages
    catStart: "Cat starts",
    catWashFace: "Cat starts learning journey",
    catHamHoc: "Cat loves learning",
    catThichHoc: "Cat enjoys studying",
    catTapTrung: "Cat focuses intensely",
    catCanCu: "Cat studies diligently",
    catTienBo: "Cat makes excellent progress",
    catSiengNang: "Cat is very hardworking",
    catChamChi: "Cat studies diligently",
    catHocXuatSac: "Cat excels in studies",
    catThaoTinhThong: "Cat masters Chinese",
    catBacThayNgonNgu: "Cat is language master",
    catSieuThongThai: "Cat is super intelligent",
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("vi");
  const { user } = useUserStore();

  // Cache for translation lookups to improve performance
  const translationCache = useRef(new Map<string, string>());

  // Memoize translations to prevent unnecessary recalculations
  const memoizedTranslations = useMemo(() => {
    translationCache.current.clear(); // Clear cache when language changes
    return translations[language];
  }, [language]);

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      // Update local state immediately for better UX
      setLanguageState(lang);

      // Save to AsyncStorage as backup
      await AsyncStorage.setItem("app_language", lang);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const cacheKey = `${language}.${key}`;
      if (translationCache.current.has(cacheKey)) {
        return translationCache.current.get(cacheKey)!;
      }

      const keys = key.split(".");
      let value: any = memoizedTranslations;

      for (const k of keys) {
        value = value?.[k];
      }

      const result = value || key; // Fallback to key if translation not found
      translationCache.current.set(cacheKey, result);
      return result;
    },
    [memoizedTranslations, language]
  );

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Priority 1: Use user's language from server if available
        if (user.language) {
          const userLang = user.language.toLowerCase();
          if (
            userLang.includes("english") ||
            userLang.includes("en") ||
            userLang.includes("tiếng anh")
          ) {
            setLanguageState("en");
          } else {
            setLanguageState("vi");
          }
          return;
        }

        // Priority 2: Use saved language from AsyncStorage
        const savedLanguage = await AsyncStorage.getItem("app_language");
        if (
          savedLanguage &&
          (savedLanguage === "vi" || savedLanguage === "en")
        ) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.error("Failed to load language preference:", error);
      }
    };

    initializeLanguage();
  }, [user.language]); // Re-run when user language changes

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
