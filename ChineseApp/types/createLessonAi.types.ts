export type NullableString = string | null;

export interface VocabularyItem {
  hanzi: string;
  pinyin: string;
  meaning: string;
  notes: NullableString;
  audio_url: NullableString;
}

export interface PhraseItem {
  text: string;
  pinyin: string;
  meaning: string;
  notes: NullableString;
  audio_url: NullableString;
}

export interface TipItem {
  vietnamese: string;
  chinese: string;
}

export interface DialogueMessage {
  speaker: string;
  text: string;
  pinyin: string;
  vietnamese: string;
  audio_url: NullableString;
}

export interface Dialogue {
  messages: DialogueMessage[];
}

export interface CreateLessonAiPayload {
  vocabularies: VocabularyItem[];
  phrases: PhraseItem[];
  tips: TipItem[];
  dialogues: Dialogue[];
}

export interface HistoryLessonAi {
  id: string;
  user_id: string;
  theme: string;
  level: string;
  model: string;
  created_at: string;
  updated_at: string;
}
