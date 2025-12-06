export interface IResponseSuccess<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface DataSuccess<T> {
  data: T;
  message?: string;
  code: number;
  status: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export type NotebookVocabItemStatus =
  | "đã thuộc"
  | "chưa thuộc"
  | "yêu thích"
  | "không chắc";

export type ProviderType = "google" | "facebook" | "local";
export type RoleType = "user" | "admin" | "superadmin";

export type LevelHSK =
  | "HSK1"
  | "HSK2"
  | "HSK3"
  | "HSK4"
  | "HSK5"
  | "HSK6"
  | "HSK7-9";

export enum EsearchNull {
  SEARCH_NULL = "jioujeiorujwieoujrfiosdjfsdjfklsdjflksdjlfks",
}
