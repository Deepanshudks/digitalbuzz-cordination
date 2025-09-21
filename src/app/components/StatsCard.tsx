"use client";

import { getTasks } from "@/services/task";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Clock, Rocket, CheckCircle } from "lucide-react";

export default function StatsCards() {
  const { data } = useQuery({
    queryKey: ["admintaskList"],
    queryFn: () => getTasks(),
  });

  const counts = data?.meta;

  const statCards = [
    {
      title: "Total Tasks",
      value: counts?.total ?? 0,
      icon: BarChart3,
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Pending",
      value: counts?.PENDING ?? 0,
      icon: Clock,
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
    },
    {
      title: "In Progress",
      value: counts?.IN_PROGRESS ?? 0,
      icon: Rocket,
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Completed",
      value: counts?.COMPLETED ?? 0,
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
