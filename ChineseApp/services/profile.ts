import { IResponseSuccess } from "@/types/common.type";
import { IUser } from "@/types/user.type";
import axios from "./index";

//call api thật

export const getMe = async (): Promise<IResponseSuccess<IUser>> => {
  const res = await axios.get("/users/profile", { requireAuth: true });
  return res.data;
};

export const editProfile = async (
  updateData: Record<string, any>
): Promise<IResponseSuccess<IUser>> => {
  console.log("Updating profile with data:", updateData);
  const res = await axios.put("/users/profile", updateData, {
    requireAuth: true,
  });
  return res.data;
};

export const forgotPassword = async (
  email: string
): Promise<IResponseSuccess<{ newPassword: string }>> => {
  const res = await axios.post("/auth/forgot-password", { email });
  return res.data;
};
