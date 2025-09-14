// components/Dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import StatsCards from "./StatsCard";
import TaskList from "./TaskList";
import Header from "./Header";
import { NewTaskModal } from "./NewTask";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task";

interface Stats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["admintaskList", status],
    queryFn: () => getTasks({ status }),
  });

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 text-gray-900 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold capitalize text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600">
              {/* {user?.role === "RM" &&
                "Create and manage tasks for your operations team."}
              {user?.role === "OPS" && "View and update tasks assigned to you."} */}
              {user?.role === "ADMIN" &&
                "Monitor all tasks across all branches."}
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className=" p-2 cursor-pointer bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
            >
              + New Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        </div>

        {/* Tasks List */}
        <TaskList />
      </main>
      {showModal && <NewTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
