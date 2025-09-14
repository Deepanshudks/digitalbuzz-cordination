"use client";

import React, { useState } from "react";

// -------- ICONS --------
const Plus: React.FC = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

// add others as needed, same style…

// -------- TYPES --------
type UpdateType = "created" | "progress" | "done";

interface TaskUpdate {
  time: string;
  message: string;
  type: UpdateType;
}

interface Task {
  id: number;
  title: string;
  description: string;
  clientName: string;
  priority: "Low" | "Medium" | "High";
  assignedTo: string;
  createdBy: string;
  status: "Pending" | "In Progress" | "Done";
  dueDate: string;
  createdAt: string;
  attachments: string[];
  updates: TaskUpdate[];
}

// -------- MAIN PAGE --------
const TaskCoordinationPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Update pricing for Godrej campaign",
      description:
        "Client wants 15% discount on premium units, update landing page",
      clientName: "Prestige Developers",
      priority: "High",
      assignedTo: "Johnson",
      createdBy: "Rajesh RM",
      status: "Pending",
      dueDate: "2025-09-15",
      createdAt: "2025-09-12 10:30 AM",
      attachments: [],
      updates: [
        {
          time: "2025-09-12 10:30 AM",
          message: "Task created by Rajesh RM",
          type: "created",
        },
      ],
    },
    {
      id: 2,
      title: "Change hero image for Sobha campaign",
      description:
        "Client prefers exterior view instead of interior, needs urgent change",
      clientName: "Sobha Ltd",
      priority: "Medium",
      assignedTo: "Akshay",
      createdBy: "Kavya RM",
      status: "In Progress",
      dueDate: "2025-09-13",
      createdAt: "2025-09-11 03:45 PM",
      attachments: [],
      updates: [
        {
          time: "2025-09-11 03:45 PM",
          message: "Task created by Kavya RM",
          type: "created",
        },
        {
          time: "2025-09-12 09:15 AM",
          message: "Started working on design changes - Akshay",
          type: "progress",
        },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-black to-gray-800 text-white px-4 py-2 rounded-lg">
                <span className="font-bold text-lg">digital</span>
                <span className="font-bold text-lg text-yellow-400">buzz</span>
                <span className="text-xs align-top">™</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  RM-Operations Task Coordination
                </h1>
                <p className="text-gray-600">
                  Manage client requests and operation tasks efficiently
                </p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus />
              New Task
            </button>
          </div>
        </div>

        {/* Task Cards */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-sm border p-6 mb-4"
          >
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="text-xs text-gray-500 mt-1">
              Due: {task.dueDate} | Status: {task.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCoordinationPage;
