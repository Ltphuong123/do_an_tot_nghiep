import { IResponseSuccess } from "@/types/common.type";
import {
  IViolationsResponse,
  UserViolation,
  ViolationResolution,
} from "@/types/report.type";
import axios from "./index";

export const reportReasons = async (
  target_type: string,
  target_id: string | null,
  reason: string,
  details: string,
  attachments?: string[]
): Promise<IResponseSuccess<null>> => {
  console.log("data to report:", {
    target_type,
    target_id,
    reason,
    details,
    attachments,
  });
  const res = await axios.post(
    "/reports",
    {
      target_type,
      target_id,
      reason,
      details,
      attachments,
    },
    { requireAuth: true }
  );
  return res.data;
};

export const getviolations = async (): Promise<{
  success: boolean;
  data: IViolationsResponse[];
}> => {
  const res = await axios.get("/users/me/violations", { requireAuth: true });
  return res.data;
};

export const getAppeals = async (): Promise<{
  success: boolean;
  data: UserViolation[];
}> => {
  const res = await axios.get("/users/me/appeals", { requireAuth: true });
  return res.data;
};

export const createAppeal = async (
  violationId: string,
  reason: string
): Promise<IResponseSuccess<null>> => {
  const res = await axios.post(
    "/appeals",
    {
      violation_id: violationId,
      reason,
    },
    { requireAuth: true }
  );
  return res.data;
};

export const getAppealsByViolation = async (
  violationId: string
): Promise<IResponseSuccess<ViolationResolution[]>> => {
  const res = await axios.get(`/users/me/violations/${violationId}/appeals`, {
    requireAuth: true,
  });
  return res.data;
};
