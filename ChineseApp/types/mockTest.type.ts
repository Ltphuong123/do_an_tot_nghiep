export interface IUserAnswerProgress {
  question_id: string;
  user_response: string | string[]; // Đáp án đã chọn
}

export interface IExam {
  id: string;
  exam_type_id: string;
  exam_type_name: string;
  exam_level_id: string;
  exam_level_name: string;
  skills: string[];
  name: string;
  description: {
    html: string;
  };
  instructions: string;
  total_time_minutes: number;
  total_questions: number;
  passing_score_total?: number;
  is_published: boolean;
  created_at: string;
  created_by: string;
}

export interface IExamLevel {
  id: string;
  exam_type_id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  exam_type_name: string;
}

export interface IExamType {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface IHistoryExam {
  attempt_id: string;
  attempt_number: number;
  created_at: string;
  end_time: string;
  exam_id: string;
  exam_level_name: string;
  exam_name: string;
  exam_type_name: string;
  is_passed: boolean;
  score_total: string;
  start_time: string;
}

export interface IResultExam {
  attempt_id: string;
  attempt_number: number;
  created_at: string;
  created_by: string;
  description: {
    html: string;
  };
  end_time: string;
  exam_level_id: string;
  exam_level_name: string;
  exam_type_id: string;
  exam_type_name: string;
  id: string;
  instructions: string;
  is_deleted: boolean;
  is_passed: boolean;
  is_published: boolean;
  name: string;
  passing_score_total: number | null;
  score_total: string;
  section_scores: {
    correct_count: number;
    score: number;
    section_id: string;
    section_name: string;
    total_questions: number;
  }[];
  sections: ISection[];
  start_time: string;
  total_questions: number;
  total_time_minutes: number;
  updated_at: string;
  version_at: string | null;
}

export interface IQuestionResult {
  question_id: string;
  question_order: number;
  question_content: string;
  options: IOption[] | null;
  is_correct: boolean | null;
  explanation: IExplanation | null;
  user_response: string | string[] | null;
  correct_answer_text: string | null;
  correct_answers_list: string[] | null;
}

export interface IOption {
  id: string;
  question_id: string;
  label?: string; // Ví dụ: "A", "B", ...
  content?: string | null; // Nội dung câu trả lời (ví dụ: "Đúng", "Sai", ...)
  image_url?: string | null;
  audio_url?: string | null;
  is_correct?: boolean; // server trả về có thể kèm
  order?: number | null;
  correct_order?: number | null;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
  is_deleted?: boolean;
}

export interface IExplanation {
  id: string;
  question_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface IStartExamResponse {
  attemptId: string;
  startTime: string;
  endTime: string;
  exam: IExamDetail;
}

export interface IExamDetail {
  id: string;
  name: string;
  description: {
    html: string;
  };
  instructions: string;
  total_time_minutes: number;
  total_questions?: number;
  passing_score_total?: number;
  sections: ISection[];
}

export interface ISection {
  id: string;
  exam_id?: string;
  name: string;
  order: number | null;
  time_minutes: number;
  passing_score?: number | null;
  description: {
    html: string;
  };
  audio_url?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  subsections: ISubsection[];
  // thêm fields tóm tắt khi server trả về cấu trúc
  user_score?: number;
  correct_answers_count?: number;
  total_questions_count?: number;
}

export interface ISubsection {
  id: string;
  section_id?: string;
  name: string;
  order: number | null;
  description:
    | {
        html: string;
      }
    | string;
  audio_url?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  questions: IQuestion[];
  prompts: IPrompt[];
}

export interface IQuestion {
  id: string;
  subsection_id?: string;
  question_type_id?: string;
  order: number | null;
  content: string;
  image_url: string | null;
  audio_url: string | null;
  correct_answer?: string | null;
  points: number;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  options: IOption[] | null;
  // bổ sung từ response
  correct_answers?: ICorrectAnswer[] | null; // cho text/ordering type
  explanation?: IExplanation | null;
  user_response: string | string[] | null;
  is_correct: boolean | null;
  correct_answer_text: string | null;
  correct_answers_list: string[] | null;
  prompt_id?: string | null; // ID của prompt nếu câu hỏi thuộc về một prompt
}

export interface IPrompt {
  id: string;
  subsection_id?: string;
  content: {
    html: string;
  };
  image?: {
    url?: string;
    type?: string;
    images?: {
      url: string;
      label: string;
      type: string;
    }[];
  } | null;
  images?: {
    url: string;
    label: string;
    type: string;
  }[];
  type?: string; // e.g., "image_list"
  audio_url?: string;
  order: number | null;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  questions?: IQuestion[];
}

export interface ICorrectAnswer {
  id: string;
  question_id: string;
  answer: string;
  explanation?: string | null;
  created_at: string;
}

export interface IUserTestProgress {
  id: string;
  user_id: string;
  test_id: string;
  attempt_id: string;
  current_section_index: number;
  current_question_index: number;
  answers: IUserAnswerProgress[]; // Key: question_id
  time_remaining: number; // Thời gian còn lại (giây)
  started_at: string;
  last_updated: string;
  status: "in_progress" | "paused" | "submitted";
}

export interface ILeaderboardByExamLevel {
  user_id: string;
  user_name: string;
  username: string;
  avatar_url: string;
  total_score: string; // nếu muốn số thì đổi sang number
  exams_completed: string; // nếu muốn số thì đổi sang number
  exam_level_name: string;
  rank: string;
}

export interface ILeaderboardByExamType {
  user_id: string;
  user_name: string;
  username: string;
  avatar_url: string;
  total_score: string; // hoặc number nếu bạn muốn
  exams_completed: string; // hoặc number
  exam_type_name: string; // trường mới
  rank: string;
}
