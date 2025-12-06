import { IResponseSuccess } from "@/types/common.type";
import {
  CreateLessonAiPayload,
  HistoryLessonAi,
} from "@/types/createLessonAi.types";
import axios from "./index";

export const createLessonAi = async (
  theme: string,
  level: string
): Promise<IResponseSuccess<CreateLessonAiPayload>> => {
  console.log("Creating AI lesson with theme:", theme, "and level:", level);
  const res = await axios.post(
    "ai/generate-lesson",
    {
      theme: theme,
      level: level,
    },
    {
      requireAuth: true,
    }
  );
  console.log("Create AI lesson response:", res);
  return res.data;
};

export const getHistoryLessonAi = async (
  page: number,
  limit: number
): Promise<IResponseSuccess<HistoryLessonAi[]>> => {
  const res = await axios.get("ai/lessons", {
    requireAuth: true,
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const getLessonAiById = async (
  id: string
): Promise<IResponseSuccess<{ content: CreateLessonAiPayload }>> => {
  const res = await axios.get(`ai/lessons/${id}`, {
    requireAuth: true,
  });
  return res.data;
};
