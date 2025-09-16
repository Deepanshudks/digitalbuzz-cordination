import React, { useState } from "react";
import { TaskModal } from "./TaskModal";
import { Task } from "@prisma/client";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Rocket,
  Trash,
  User,
} from "lucide-react";
import ConfirmDelete from "./ConfirmDelete";

interface TaskCardProps {
  task: Task;
}

const AdminTaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [DeletemodalOpen, setDeleteModalOpen] = useState(false);

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
      case "COMPLETED":
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
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "ON_HOLD":
        return "bg-blue-100 text-blue-800 border-blue-200";
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

  return (
    <div
      key={task.id}
      className={`bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition-all duration-300 animate-slide-up ${
        isOverdue(task.deadline?.toLocaleString()) &&
        task.status !== "COMPLETED"
          ? "border-red-300 bg-red-50"
          : "border-gray-200"
      }`}
      style={{ animationDelay: `${2 * 50}ms` }}
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
              <span>
                {" "}
                <Trash
                  onClick={() => {
                    setDeleteModalOpen(true);
                  }}
                  size={20}
                  className="text-red-600 cursor-pointer hover:text-red-900"
                />{" "}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="capitalize">
                <strong>Client:</strong> {task?.clientName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                <strong>Deadline: </strong>
                <span
                  className={
                    isOverdue(task.deadline?.toLocaleString()) &&
                    task.status !== "COMPLETED"
                      ? "text-red-600 font-medium"
                      : ""
                  }
                >
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : ""}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="capitalize">
                <strong>Created by:</strong> {task.createdByUser}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="capitalize">
                <strong>Assigned to:</strong> {task.assignedTo}
              </span>
            </div>
          </div>

          {task.title && (
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <div>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs flex justify-between items-center text-gray-500 border-t py-2">
            <p>
              Created:{" "}
              {task.deadline ? new Date(task.deadline).toLocaleString() : ""}
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-50 w-32 cursor-pointer hover:bg-blue-100 text-blue-600 font-medium p-2 rounded-lg text-sm"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      <TaskModal
        open={modalOpen}
        setModalOpen={setModalOpen}
        taskId={task.id}
        title={task.title}
        clientName={task.clientName}
        defaultStatus={task.status}
      />
      <ConfirmDelete
        open={DeletemodalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        taskId={task.id}
      />
    </div>
  );
};

export default AdminTaskCard;
