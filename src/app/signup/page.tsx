"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signUpFn, SignupProps } from "@/services/auth";
import { Branch, Role } from "@/types";
import CustomInput from "../components/utils/CustonInput";
import { MenuItem, TextField } from "@mui/material";
import DropDownInput from "../components/utils/DropDownInput";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: signUpFn,
    onSuccess: (data) => {
      toast.success(data.message || "Account created successfully");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Signup failed");
      toast.error(err?.response?.data?.message || "Signup failed");
    },
  });

  const initialValues: SignupProps & { confirmPassword: string } = {
    username: "",
    password: "",
    confirmPassword: "",
    role: "RM",
    branch: "MUMBAI",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setError("");

      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match");
        toast.error("Passwords do not match");
        return;
      }

      const { confirmPassword, ...submitData } = values;
      signUp(submitData);
    },
  });

  const roles = [
    {
      label: "RM",
      value: "RM",
    },
    { label: "OPS", value: "OPS" },
    { label: "ADMIN", value: "ADMIN" },
  ];

  const branches = [
    {
      label: "MUMBAI",
      value: "MUMBAI",
    },
    { label: "NOIDA", value: "NOIDA" },
    { label: "GURGAON", value: "GURGAON" },
    { label: "PUNE", value: "PUNE" },
    { label: "BANGALORE", value: "BANGALORE" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <CustomInput
                id="username"
                name="username"
                type="text"
                required
                label="Username"
                formik={formik}
                placeholder="Enter username"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <CustomInput
                id="password"
                name="password"
                type="password"
                required
                label="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Enter password"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <CustomInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                label="Confirm Password"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                placeholder="Confirm password"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <DropDownInput
                options={roles}
                name="role"
                className="w-full"
                placeholder="Role"
                formik={formik}
              />
            </div>

            <div>
              <DropDownInput
                options={branches}
                name="branch"
                className="w-full"
                placeholder="Branch"
                formik={formik}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
