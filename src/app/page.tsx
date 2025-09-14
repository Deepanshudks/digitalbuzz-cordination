"use client";

import Loading from "@/app/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Loading />
    </>
  );
}
