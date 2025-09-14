import { CreateTaskInput } from "@/types";
import { Task, TaskUpdate } from "@prisma/client";
import axios from "axios";

export async function getTasks(params?: {
  status?: string;
  priority?: string;
  branch?: string;
}): Promise<Task[]> {
  try {
    const response = await axios.get<Task[]>(`/api/tasks`, {
      params,
      withCredentials: true,
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to fetch tasks"
    );
  }
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  try {
    const response = await axios.post<Task>("/api/tasks", input, {
      withCredentials: true,
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),

        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to create task"
    );
  }
}

interface TaskUpdatesResponse {
  tasks: TaskUpdate[];
}

export async function getTaskUpdates(id: string): Promise<TaskUpdatesResponse> {
  try {
    const response = await axios.get<TaskUpdatesResponse>(`/api/tasks/${id}`, {
      withCredentials: true,
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),

        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to create task"
    );
  }
}

interface TaskUpdateReqProps {
  id: string;
  remarks: string;
  status: string;
}

export async function TaskUpdateFn({
  id,
  remarks,
  status,
}: TaskUpdateReqProps): Promise<TaskUpdatesResponse> {
  try {
    const response = await axios.put<TaskUpdatesResponse>(
      `/api/tasks/${id}`,
      { remarks, status },
      {
        withCredentials: true,
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),

          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to create task"
    );
  }
}

export async function deleteTaskFn({
  id,
}: {
  id: string;
}): Promise<TaskUpdatesResponse> {
  try {
    const response = await axios.delete<TaskUpdatesResponse>(
      `/api/tasks/${id}`,
      {
        withCredentials: true,
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to create task"
    );
  }
}
