export interface Metadata {
  ai: boolean;
  word_breakdown?: WordBreakdown[];
  translation_type?: string;
}

export interface ITranslateHistory {
  id: string;
  source_text: string;
  translated_text: string;
  source_lang: string;
  target_lang: string;
  model: string;
  metadata: Metadata | null;
  created_at: string;
  is_ai_translation: boolean;
  user_id?: string; // optional for backward compatibility
}

export interface TranslationResponse {
  success: boolean;
  data: TranslationData;
  usage: UsageInfo;
}

export interface TranslationData {
  id: string;
  source_text: string;
  translated_text: string;
  source_lang: string;
  target_lang: string;
  word_breakdown: WordBreakdown[];
  model: string;
  created_at: string;
}

export interface WordBreakdown {
  analyzed_word: string;
  word_meaning: string;
  pinyin: string;
  word_type: string;
  usage_note: string;
  example_sentences: ExampleSentence[];
}

export interface ExampleSentence {
  example_zh: string;
  example_vi: string;
  pinyin: string;
  context: string;
}

export interface UsageInfo {
  current_usage: number;
  daily_limit: number;
  remaining: number;
}
