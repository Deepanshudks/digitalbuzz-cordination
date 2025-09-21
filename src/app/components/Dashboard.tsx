"use client";

import { useEffect, useRef, useState } from "react";
import { NewTaskModal } from "../components/NewTask";
import { TaskCards } from "../components/TaskCards";
import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task";
import DropDownInput from "./utils/DropDownInput";
import { Priority, Status, Branch, Role } from "@prisma/client";
import { branches, priorityOption, statusOption, teamMember } from "../static";
import { useAuth } from "@/context/AuthContext";
import TaskCardSkeleton from "./TaskCardSkeleton";
import DashboardSkeleton from "./DashboardSkeleton";
import { Pagination } from "@mui/material";
import CustomInput from "./utils/CustonInput";

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
  const [team, setTeam] = useState("");
  const [page, setPage] = useState(1);
  const [date, setDate] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const [branch, setBranch] = useState(user?.branch as Branch);

  const { data, isLoading } = useQuery({
    queryKey: ["taskList", status, priority, branch, team, page, date],
    queryFn: () => getTasks({ priority, status, branch, team, page, date }),
  });

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    setPage(1);
  }, [priority, status, team]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, priority, status, team, branch]);

  return (
    <main ref={scrollRef} className={`text-black bg-gray-50 min-h-screen`}>
      <Header />
      <div className="max-w-6xl py-6 md:py-2 mx-auto ">
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
                    options={[{ label: "All", value: "" }, ...branches]}
                    name="branch"
                    label="Branch"
                    className="w-full"
                    placeholder="All Departments"
                    value={branch}
                    setValue={setBranch}
                  />
                </div>
                <div className="space-y-2">
                  <DropDownInput
                    options={[{ label: "All", value: "" }, ...teamMember]}
                    name="teamMember"
                    placeholder="Select Team"
                    className="w-full"
                    label="Team"
                    value={team}
                    setValue={setTeam}
                  />
                </div>
                <div className="space-y-2">
                  <CustomInput
                    type="date"
                    label="Date"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    setValue={setDate}
                    value={date}
                    name="date"
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

        <div className="space-y-4 px-4">
          {isLoading ? (
            <>
              <DashboardSkeleton />
            </>
          ) : data?.tasks && data?.tasks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.tasks?.map((task) => (
                <TaskCards key={task.id} task={task} />
              ))}
            </div>
          ) : (
            "No task available"
          )}
        </div>
      </div>
      <div className="flex justify-center py-4">
        <Pagination
          count={data?.totalPages ?? 1}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
      {showModal && <NewTaskModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
