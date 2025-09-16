"use client";

import { useState } from "react";
import { NewTaskModal } from "../components/NewTask";
import { TaskCards } from "../components/TaskCards";
import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task";
import DropDownInput from "./utils/DropDownInput";
import { Priority, Status, Branch, Role } from "@prisma/client";
import { branches, priorityOption, statusOption } from "../static";
import { useAuth } from "@/context/AuthContext";

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState(user?.branch as Branch);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["taskList", status, priority, branch],
    queryFn: () => getTasks({ priority, status, branch }),
  });

  return (
    <main className={`text-black bg-gray-50 min-h-screen`}>
      <Header />
      <div className="max-w-6xl py-6 md:py-2 mx-auto">
        <div className="px-6 py-5">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col lg:flex-row gap-4 w-full lg:items-end">
              <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                <div className="space-y-2">
                  <DropDownInput
                    options={statusOption}
                    name="status"
                    label="Status"
                    className="w-full"
                    placeholder="All Status"
                    value={status}
                    setValue={setStatus}
                  />
                </div>

                <div className="space-y-2">
                  <DropDownInput
                    options={priorityOption}
                    name="priority"
                    className="w-full"
                    label="Priority"
                    placeholder="All Priorities"
                    value={priority}
                    setValue={setPriority}
                  />
                </div>

                <div className="space-y-2">
                  <DropDownInput
                    options={branches}
                    name="branch"
                    label="Branch"
                    className="w-full"
                    placeholder="All Departments"
                    value={branch}
                    setValue={setBranch}
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-50 bg-gray-500 border border-gray-300 rounded-lg hover:bg-zinc-700 cursor-pointer"
                >
                  + New Task
                </button>
              </div>
            </div>
          </div>
        </div>

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
