import { Priority, Status } from "@prisma/client";

export interface UserRef {
  username: string;
  role: string;
  branch: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  clientName: string;
  priority: Priority;
  status: Status;
  deadline: Date;
  branch: Branch;
  remarks?: string | null;
  createdById: string;
  assignedToId: string;
  createdAt: Date;
  updatedAt: Date;
  assignedBy: string;
  createdByUser: string;
  createdBy: string;
  assignedTo: string;
  updates?: {
    id: string;
    oldStatus: Status;
    newStatus: Status;
    remarks: string;
    createdAt: Date;
  }[];
}

export interface CreateTaskInput {
  title: string;
  clientName: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  assignedBy: string;
  deadline: string;
  description?: string;
}

export interface LoginProps {
  username: string;
  password: string;
}

export type Role = "RM" | "OPS" | "ADMIN";
export type Branch = "MUMBAI" | "NOIDA" | "GURGAON" | "PUNE" | "BANGALORE";

export interface SignupForm {
  username: string;
  password: string;
  confirmPassword: string;
  role: Role;
  branch: Branch;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  branch: string;
  createdAt: string;
}

export interface UserListResponse {
  list: User[];
}

export interface Meta {
  total: number;
  PENDING?: number;
  IN_PROGRESS?: number;
  COMPLETED?: number;
  ON_HOLD?: number;
}

export interface TaskListResponse {
  tasks: Task[];
  perPage: number;
  currentPage: number;
  totalPages: number;
  meta: Meta;
}
