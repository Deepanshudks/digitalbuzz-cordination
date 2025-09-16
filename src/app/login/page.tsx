"use client";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "../components/Login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null;

  return <LoginPage />;
}
