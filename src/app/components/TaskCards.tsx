"use client";
import React, { ReactNode, useState } from "react";
import {
  Calendar,
  User,
  MessageSquare,
  Loader,
  Clock,
  OctagonPause,
  Check,
  Trash,
} from "lucide-react";
import { TaskItem } from "./Dashboard";
import { Status, Task } from "@prisma/client";
import { TaskModal } from "./TaskModal";
import ConfirmDelete from "./ConfirmDelete";

interface TaskCardProps {
  task: Task;
}

const priorityColors: Record<TaskItem["priority"], string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

const statusColors: Record<Status, string> = {
  ON_HOLD: "text-red-700",
  PENDING: "text-yellow-700",
  IN_PROGRESS: "text-blue-700",
  COMPLETED: "text-green-700",
};

const StatusIcon: Record<Status, ReactNode> = {
  PENDING: <Loader />,
  IN_PROGRESS: <Clock />,
  ON_HOLD: <OctagonPause />,
  COMPLETED: <Check />,
};

export const TaskCards: React.FC<TaskCardProps> = ({ task }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow p-5 w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="flex gap-1 justify-center items-center">
            <span className={`${statusColors[task.status]}`}>
              {StatusIcon[task.status]}
            </span>{" "}
            <span>
              <span className="text-lg font-semibold">{task?.title}</span>
            </span>{" "}
          </p>

          <p className="text-sm text-gray-500 ">{task?.clientName}</p>
        </div>
        <p className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </p>
      </div>

      <p className=" text-gray-600 py-2">{task.description}</p>

      <div className=" space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User size={16} className="!text-gray-600" />
          <span className="text-gray-600">
            Assigned to:{" "}
            <span className="font-medium text-gray-800">{task.assignedTo}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-gray-500">Due:</span>
          <span className="text-gray-600">
            {new Date(task.deadline).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MessageSquare size={16} className="text-gray-500" />
          <span className="capitalize">Created by:</span>
          <span className="capitalize text-gray-900">{task.createdByUser}</span>
        </div>
      </div>

      {/* Last update */}
      <p className="mt-4 text-xs text-gray-400">
        Last update: {new Date(task.updatedAt).toLocaleString()}
      </p>

      {/* Button */}
      <div className="mt-3 ">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-50 w-full hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg text-sm"
        >
          View Details
        </button>
      </div>

      <TaskModal
        open={modalOpen}
        setModalOpen={setModalOpen}
        taskId={task.id}
        title={task.title}
        clientName={task.clientName}
        defaultStatus={task.status}
      />
    </div>
  );
};
