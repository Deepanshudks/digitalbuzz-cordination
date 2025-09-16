"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { LoginProps } from "@/types";
import CustomInput from "./utils/CustonInput";
import { useMutation } from "@tanstack/react-query";
import { signInFn } from "@/services/auth";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { User } from "@prisma/client";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: signInFn,
    onSuccess: (response) => {
      toast.success(response.message);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response?.user as User);
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Login failed");
    },
  });

  const formik = useFormik<LoginProps>({
    initialValues: { username: "", password: "" },
    onSubmit: (values) => {
      loginMutation(values);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 p-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <div className="mt-1">
                <CustomInput
                  id="username"
                  name="username"
                  type="text"
                  required
                  formik={formik}
                  value={formik.values.username}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <div className="mt-1">
                <CustomInput
                  id="password"
                  name="password"
                  type="password"
                  required
                  formik={formik}
                  value={formik.values.password}
                  className="appearance-none block w-full px-3 py-2 border text-black border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
