"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task";
import TaskCardSkeleton from "./TaskCardSkeleton";
import AdminTaskCard from "./AdminTaskCard";
import StatusFilter from "./StatusFilter";

export default function TaskList() {
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState("");
  const [team, setTeam] = useState("");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["admintaskList", status, branch, team],
    queryFn: () => getTasks({ status, branch, team }),
  });

  return (
    <div className="space-y-6">
      <StatusFilter
        branch={branch}
        setBranch={setBranch}
        setStatus={setStatus}
        status={status}
        team={team}
        setTeam={setTeam}
      />

      {isLoading ? (
        <>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </>
      ) : tasks?.length === 0 ? (
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
          {tasks?.map((task) => (
            <AdminTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
