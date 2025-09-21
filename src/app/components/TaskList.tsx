"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task";
import TaskCardSkeleton from "./TaskCardSkeleton";
import AdminTaskCard from "./AdminTaskCard";
import StatusFilter from "./StatusFilter";

interface TaskListProps {
  page: number;
  setTotalPage: (val: number) => void;
  setPage: (val: number) => void;
}

export default function TaskList({
  setPage,
  page,
  setTotalPage,
}: TaskListProps) {
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState("");
  const [team, setTeam] = useState("");
  const [date, setDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admintaskList", status, branch, team, date, page],
    queryFn: () => getTasks({ status, branch, team, date, page }),
  });

  useEffect(() => {
    setTotalPage(data?.totalPages ?? 1);
  }, [data]);

  return (
    <div className="space-y-6">
      <StatusFilter
        branch={branch}
        setPage={setPage}
        setBranch={setBranch}
        setStatus={setStatus}
        status={status}
        team={team}
        setTeam={setTeam}
        date={date}
        setDate={setDate}
      />

      {isLoading ? (
        <>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </>
      ) : data?.tasks?.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600">
            {status === "ALL"
              ? "No tasks have been created yet."
              : `No ${status.toLowerCase().replace("_", " ")} tasks found.`}
          </p>
        </div>
      ) : (
        <div className="grid  gap-6">
          {data?.tasks?.map((task) => (
            <AdminTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
