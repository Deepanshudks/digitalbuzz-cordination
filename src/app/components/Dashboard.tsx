"use client";

import { useState } from "react";
import { NewTaskModal } from "../components/NewTask";
import { TaskCards } from "../components/TaskCards";
import Header from "../components/Header";
import { Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task";
import DropDownInput from "./utils/DropDownInput";
import { Priority, Status, Branch, Role } from "@prisma/client";

export interface UserRef {
  username: string;
  role: Role;
  branch: Branch;
}

export interface TaskUpdateItem {
  id: string;
  oldStatus: Status;
  newStatus: Status;
  remarks: string;
  createdAt: string;
  updatedBy: UserRef;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  clientName: string;
  assignedBy: string;
  assignedTo: UserRef;
  createdBy: UserRef;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  priority: Priority;
  status: Status;
  remarks?: string | null;
  updates?: TaskUpdateItem[];
  branch?: Branch | null;
}

export const priorityOption = [
  { label: "All", value: "" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

export const statusOption = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "On Hold", value: "ON_HOLD" },
];
export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["taskList", status, priority],
    queryFn: () => getTasks({ priority, status }),
  });

  return (
    <main className={`text-black bg-gray-50 min-h-screen`}>
      {/* Header Section */}
      <Header />
      <div className="max-w-6xl py-6 md:py-2 mx-auto">
        {/* Filters */}
        <div className="flex gap-2 p-2 sm:p-4 justify-between">
          <div className="flex gap-1 md:gap-4">
            <p className="flex justify-center items-center">
              <Filter size={20} />
            </p>

            <DropDownInput
              options={statusOption}
              name="status"
              className="w-32"
              label="Status"
              value={status}
              setValue={setStatus}
            />
            <DropDownInput
              options={priorityOption}
              name="priority"
              className="w-32"
              label="Priority"
              value={priority}
              setValue={setPriority}
            />
          </div>
          <>
            <button
              onClick={() => setShowModal(true)}
              className="p-2 cursor-pointer bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
            >
              + New Task
            </button>
          </>
        </div>

        {/* Tasks */}
        <div className="space-y-4 px-4 ">
          {isLoading ? (
            <p>Loading tasks…</p>
          ) : tasks && tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <TaskCards key={task.id} task={task} />
              ))}
            </div>
          ) : (
            "No task available"
          )}
        </div>
      </div>
      {showModal && <NewTaskModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
