import { IMeta, IResponseSuccess } from "@/types/common.type";
import { ITranslateHistory, TranslationResponse } from "@/types/translate.type";
import axios from "./index";

export const getTranslateHistory = async (
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data: ITranslateHistory[];
  meta: IMeta;
}> => {
  const res = await axios.get("/ai/translations", {
    requireAuth: true,
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const translate = async (
  text: string,
  direction: string,
  isAI: boolean = false
): Promise<TranslationResponse> => {
  const res = await axios.post(
    "/ai/translate",
    {
      text,
      direction,
      is_ai: isAI,
    },
    {
      requireAuth: true,
    }
  );
  return res.data;
};

export const deleteTranslateHistory = async (
  historyId: string
): Promise<IResponseSuccess<null>> => {
  const response = await axios.delete(`/ai/translations/${historyId}`, {
    requireAuth: true,
  });
  return response.data;
};

export const getTranslateTodayCount = async (): Promise<{
  success: boolean;
  data: number;
}> => {
  const res = await axios.get("/ai/translations/today-count", {
    requireAuth: true,
  });
  return res.data;
};

export const getTranslateStats = async (): Promise<{
  success: boolean;
  data: {
    today: number;
    week: number;
    month: number;
  };
}> => {
  const res = await axios.get("/ai/translations/stats", {
    requireAuth: true,
  });
  return res.data;
};

export const translateWithAI = async (
  text: string,
  direction: string
): Promise<TranslationResponse> => {
  const res = await axios.post(
    "/ai/translate-with-examples",
    {
      text,
      direction,
    },
    {
      requireAuth: true,
    }
  );
  return res.data;
};
