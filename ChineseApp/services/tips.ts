import { IMeta, IResponseSuccess } from "@/types/common.type";
import { ITip } from "@/types/tips.type";
import axios from "./index";

export const getTipList = async (): Promise<
  IResponseSuccess<{ data: ITip[]; meta: IMeta }>
> => {
  const res = await axios.get("user/tips", {
    requireAuth: true,
  });
  return res.data;
};
