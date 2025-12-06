import { IResponseSuccess } from "@/types/common.type";
import { IAchievements, IBadge, IStreak } from "@/types/home.type";
import axios from "./index";

export const getStreaks = async (): Promise<IResponseSuccess<IStreak>> => {
  const res = await axios.get("/users/me/weekly-activity", {
    requireAuth: true,
  });
  return res.data;
};

export const getAchievements = async (): Promise<
  IResponseSuccess<IAchievements[]>
> => {
  const res = await axios.get("/users/me/achievements/progress", {
    requireAuth: true,
  });
  return res.data;
};

export const getListBadges = async (): Promise<IResponseSuccess<IBadge[]>> => {
  const res = await axios.get("badges", {
    requireAuth: true,
  });
  return res.data;
};
