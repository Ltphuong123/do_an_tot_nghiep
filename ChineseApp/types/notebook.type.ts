import { IMeta, IPagination, NotebookVocabItemStatus } from "./common.type";

export interface INoteBookVocabItem extends IVocabulary {
  status: NotebookVocabItemStatus;
  added_at: string;
}

export interface IVocabulary {
  id: string;
  word_types: string[];
  hanzi: string;
  pinyin: string;
  meaning: string;
  notes?: string;
  level: string[];
  image_url: string;
}

export interface IVocabularyReview {
  vocab_id: string;
  word_types: string[];
  hanzi: string;
  pinyin: string;
  meaning: string;
  notes?: string;
  level: string[];
  image_url: string;
}


export interface INoteBook {
  id: string;
  name: string;
  vocab_count: number;
  created_at: string;
  status: string;
  is_premium: boolean;
  user_id: string | null;
  created_by: string | null;
}

export interface IAILessonCreate {
  theme: string;
  level: string;
  content: string;
}

export interface ICreateVocabularyData {
  hanzi: string;
  pinyin: string;
  meaning: string;
  notes?: string;
  levels: string[];
  wordTypes: string[];
  imageUrl?: string;
}

export interface INotebookResponse {
  data: INoteBook[];
  meta: IMeta;
}

export interface INotebookVocabResponse {
  vocabularies: INoteBookVocabItem[];
  pagination: IPagination;
}

export interface IWordType {
  code: string;
  name: string;
}
export interface INotebookVocabularies {
  data: INoteBookVocabItem[];
  pagination: IPagination;
}

export interface INotebookDetail {
  id: string;
  user_id: string;
  name: string;
  options: {};
  is_premium: boolean;
  status: string;
  template_id: string;
  vocab_count: number;
  created_at: string;
  vocabularies: INotebookVocabularies;
}

export interface INotebookDetailFromTempResponse {
  notebook: INotebookDetail;
  isNew: boolean;
  template: {
    id: string;
  };
}
export interface IPendingChange {
  id: string;
  template_id: string;
  vocab_id: string;
  action: string;
  created_at: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  level: string[];
}

export interface ICounts {
  total: number;
  added: number;
  removed: number;
}

export interface INotebookSyncData {
  notebookId: string;
  templateId: string;
  lastSyncedAt: string;
  hasPendingChanges: boolean;
  pendingChanges: IPendingChange[];
  counts: ICounts;
}

export interface INotebookSyncResponse {
  data: INotebookSyncData;
}
