"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StatsCards from "./StatsCard";
import TaskList from "./TaskList";
import Header from "./Header";
import { NewTaskModal } from "./NewTask";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 text-gray-900 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold capitalize text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600">
              {user?.role === "ADMIN" &&
                "Monitor all tasks across all branches."}
            </p>
          </div>
          <div className="flex gap-2 h-10">
            <button
              onClick={() => setShowModal(true)}
              className=" p-2 cursor-pointer text-xs md:text-base bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
            >
              + New Task
            </button>
          </div>
        </div>

        <StatsCards />

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        </div>

        <TaskList />
      </main>
      {showModal && <NewTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
