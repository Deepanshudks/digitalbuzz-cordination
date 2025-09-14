"use client";

import { getTasks } from "@/services/task";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Clock, Rocket, CheckCircle } from "lucide-react";

export default function StatsCards() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["admintaskList"],
    queryFn: () => getTasks(),
  });

  const totalTasks = tasks?.length;
  const pendingTasks = tasks?.filter((t) => t.status === "PENDING").length;
  const inProgressTasks = tasks?.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const completedTasks = tasks?.filter((t) => t.status === "COMPLETED").length;

  const statCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: BarChart3,
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: Clock,
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Rocket,
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
