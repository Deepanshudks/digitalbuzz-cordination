import { LoginProps } from "@/types";
import axios from "axios";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface SignupResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
    branch: string;
  };
}

export interface SignupProps {
  username: string;
  password: string;
  role: "RM" | "OPS" | "ADMIN";
  branch: "MUMBAI" | "NOIDA" | "GURGAON" | "PUNE" | "BANGALORE";
}

export const signInFn = async (reqbody: LoginProps): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      "/api/auth/login",
      reqbody
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const signUpFn = async (
  reqBody: SignupProps
): Promise<SignupResponse> => {
  try {
    const response = await axios.post<SignupResponse>(
      "/api/auth/signup",
      reqBody
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
