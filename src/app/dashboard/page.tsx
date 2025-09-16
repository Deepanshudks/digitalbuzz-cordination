"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect } from "react";
import AdminDashboard from "../components/AdminDashboard";
import DashboardPage from "../components/Dashboard";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

const Page = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <Loading />;
  if (!user) return null;

  return <>{user.role !== "ADMIN" ? <AdminDashboard /> : <DashboardPage />}</>;
};

export default Page;
