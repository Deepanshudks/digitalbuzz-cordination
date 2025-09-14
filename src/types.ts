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
  deadline: string;
  branch: string;
  remarks?: string | null;
  createdById: string;
  assignedToId: string;
  createdBy?: UserRef;
  assignedTo?: UserRef;
  updates?: {
    id: string;
    oldStatus: Status;
    newStatus: Status;
    remarks: string;
    createdAt: string;
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
