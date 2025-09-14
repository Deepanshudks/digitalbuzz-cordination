"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "RM":
        return "bg-blue-100 text-blue-800";
      case "OPS":
        return "bg-green-100 text-green-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <header className="bg-digitalbuzz-black  shadow-lg ">
      <div className="px-8">
        <div className="flex gap-4 justify-between items-center py-4">
          <div className="flex items-center gap-4 text-gray-900">
            <div className="flex items-center">
              <div className="bg-gradient-to-r px-2 from-black to-gray-800 text-gray-900 py-2 rounded-lg">
                <span className="font-bold text-white text-lg">Digital</span>
                <span className="font-bold text-lg text-yellow-400">buzz</span>
              </div>
            </div>
            <h1 className="text-gray-900 text-lg font-semibold hidden sm:block">
              Task Management System
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-gray-900 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium !capitalize">
                  {user?.username}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    user?.role || ""
                  )}`}
                >
                  {user?.role}
                </span>
              </div>
              <div className="text-digitalbuzz-yellow text-xs">
                {user?.branch}
              </div>
            </div>
            {user?.role === "ADMIN" && (
              <button
                onClick={() => {
                  router.push("/signup");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-slate-50 cursor-pointer px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-3" />
                <span>User</span>
              </button>
            )}
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="bg-zinc-600 hover:bg-zinc-700 text-slate-50 cursor-pointer px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span onClick={logout}>Logout</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 cursor-pointer p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 pb-4">
            <div className="pt-4 space-y-3">
              <div className="text-gray-900">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium capitalize">
                    {user?.username}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user?.role || ""
                    )}`}
                  >
                    {user?.role}
                  </span>
                </div>
                <div className="text-digitalbuzz-yellow text-sm">
                  {user?.branch}
                </div>
              </div>
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/signup");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-slate-50 px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  <span>User</span>
                </button>
              )}
              <button
                onClick={async () => {
                  await logout();
                  setMobileMenuOpen(false);
                  router.push("/");
                }}
                className="bg-zinc-600 hover:bg-zinc-700 cursor-pointer text-slate-50 px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2 w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
