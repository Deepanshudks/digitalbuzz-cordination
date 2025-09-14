// components/TaskList.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Rocket,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task";
import { Task } from "@prisma/client";

export default function TaskList() {
  const { user } = useAuth();
  const [status, setStatus] = useState("");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["admintaskList", status],
    queryFn: () => getTasks({ status }),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Rocket className="h-4 w-4" />;
      case "DONE":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DONE":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isOverdue = (deadline?: string | Date): boolean => {
    if (!deadline) return false;

    const taskDeadline =
      typeof deadline === "string" ? new Date(deadline) : deadline;
    const now = new Date();

    return taskDeadline < now;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-digitalbuzz-yellow"></div>
      </div>
    );
  }

  console.log(tasks);

  return (
    <div className="space-y-6">
      {/* status Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg w-fit">
        {["", "PENDING", "IN_PROGRESS", "DONE", "ON_HOLD"].map((status) => (
          <button
            key={status}
            onClick={() => setStatus(status)}
            className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md transition-colors ${
              status === status
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {status === "" ? "All Tasks" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {tasks?.length === 0 ? (
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
        <div className="grid gap-6">
          {tasks?.map((task, index) => (
            <div
              key={task.id}
              className={`bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition-all duration-300 animate-slide-up ${
                isOverdue(task.deadline?.toLocaleString()) &&
                task.status !== "COMPLETED"
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isOverdue(task.deadline?.toLocaleString()) &&
                task.status !== "COMPLETED" && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm font-medium">
                    ⚠️ This task is overdue!
                  </div>
                )}

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex-1 mb-2 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {task?.title}
                      </h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {task?.title}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {getStatusIcon(task.status)}
                        <span>{task.status.replace("_", " ")}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span>
                        <strong>Client:</strong> {task?.clientName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>
                        <strong>Deadline:</strong>
                        <span
                          className={
                            isOverdue(task.deadline?.toLocaleString()) &&
                            task.status !== "COMPLETED"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {task.deadline?.toLocaleString()}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span>
                        <strong>Created by:</strong> {task.createdByUser}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span>
                        <strong>Assigned to:</strong> {task.assignedTo}
                      </span>
                    </div>
                  </div>

                  {task.title && (
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Remarks:
                          </p>
                          <p className="text-sm text-gray-600">{task.title}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 border-t pt-2">
                    <p>Created: {task.createdAt?.toLocaleString()}</p>
                  </div>
                </div>

                {user?.role === "OPS" &&
                  task.assignedTo === user.username &&
                  task.status !== "COMPLETED" && (
                    <div className="lg:ml-6 mt-4 lg:mt-0 flex-shrink-0">
                      <div className="flex flex-col gap-2">
                        {task.status === "PENDING" && (
                          <button
                            onClick={
                              () => {}
                              // updateTaskStatus(task.id, "IN_PROGRESS")
                            }
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Rocket className="h-4 w-4" />
                            Start Task
                          </button>
                        )}

                        {task.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => {
                              const remarks = prompt(
                                "Add completion remarks (optional):"
                              );
                              // updateTaskStatus(
                              //   task.id,
                              //   "DONE",
                              //   remarks || undefined
                              // );
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Complete
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const currentRemarks = task.title || "";
                            const remarks = prompt(
                              "Add/Update remarks:",
                              currentRemarks
                            );
                            if (remarks !== null) {
                              // updateTaskStatus(task.id, task.status, remarks);
                            }
                          }}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Add Remarks
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
