import { UserListResponse } from "@/types";
import axios from "axios";

export async function getOpList(): Promise<UserListResponse> {
  try {
    const response = await axios.get<UserListResponse>("/api/oplist", {
      withCredentials: true,
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to fetch list"
    );
  }
}
