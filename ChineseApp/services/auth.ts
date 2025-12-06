import {
  ILoginResponse,
  ILogoutResponse,
  IRegisterResponse,
} from "@/types/auth.type";
import { IResponseSuccess } from "@/types/common.type";
import axios from "./index";

export const login = async (
  username: string,
  password: string
): Promise<ILoginResponse> => {
  const response = await axios.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};

export const loginWithGoogle = async (
  email: string,
  name: string,
  avatar_url: string
): Promise<ILoginResponse> => {
  const response = await axios.post("/auth/google-login", {
    email,
    name,
    avatar_url,
  });
  return response.data;
};

export const logout = async (
  refresh_token: string
): Promise<ILogoutResponse> => {
  const res = await axios.post("/auth/logout", {
    refresh_token: refresh_token,
  });
  return res.data;
};

// Logout local - chỉ clear local data mà không gọi API
export const logoutLocal = async (): Promise<void> => {
  // Function này chỉ dùng khi API logout không thể gọi được (token hết hạn)
  // Logic clear tokens sẽ được handle bởi caller
};

export const register = async (
  name: string,
  username: string,
  password: string,
  email: string | null
): Promise<IResponseSuccess<IRegisterResponse>> => {
  console.log("Registering user:", { name, username, email });
  const response = await axios.post("/auth/register", {
    name,
    username,
    password,
    email,
  });
  return response.data;
};

export const changePassword = async (
  old_password: string,
  new_password: string
): Promise<IResponseSuccess<null>> => {
  const res = await axios.post(
    "/auth/reset-password",
    {
      old_password,
      new_password,
    },
    { requireAuth: true }
  );
  return res.data;
};
