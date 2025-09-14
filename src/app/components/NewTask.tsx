"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createTask } from "@/services/task";
import { Priority, Status, Task } from "@prisma/client";
import { useFormik } from "formik";
import { FC } from "react";
import DropDownInput from "./utils/DropDownInput";
import { priorityOption } from "./Dashboard";
import CustomInput from "./utils/CustonInput";

type FormValues = {
  assignedBy: string;
  title: string;
  clientName: string;
  description: string;
  priority: Priority;
  status: Status;
  deadline: string;
  assignedTo: string;
};

interface NewTaskModalProps {
  onClose: () => void;
}

export const NewTaskModal: FC<NewTaskModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) => createTask(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskList", "admintaskList"],
      });
      onClose();
    },
    onError: (error: any) => {
      alert(error.message || "Failed to create task");
    },
  });

  const teamMember = [
    {
      label: "Johnson",
      value: "Johnson",
    },
    {
      label: "Akshay",
      value: "Akshay",
    },
    {
      label: "Shubham",
      value: "Shubham",
    },
    {
      label: "Rupesh",
      value: "Rupesh",
    },
  ];

  const formik = useFormik<FormValues>({
    initialValues: {
      assignedBy: "",
      title: "",
      clientName: "",
      description: "",
      priority: Priority.MEDIUM,
      status: Status.PENDING,
      deadline: "",
      assignedTo: "",
    },
    onSubmit: (values) => mutate(values),
  });

  console.log(formik.values);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-[90%] max-w-lg rounded-lg shadow-2xl p-6 max-h-[95vh] h-[70%] overflow-y-auto">
          <h2 className="text-xl text-zinc-800 font-bold mb-4">
            Create New Task
          </h2>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <CustomInput
              name="assignedBy"
              formik={formik}
              className="w-full border text-zinc-900 rounded px-3 py-2"
              placeholder="RM Name (e.g., John Doe RM)"
            />

            <CustomInput
              name="title"
              label="Title"
              formik={formik}
              className="w-full border text-zinc-900 rounded px-3 py-2"
              placeholder="Task Title"
            />

            <CustomInput
              name="clientName"
              formik={formik}
              className="w-full border text-zinc-900 rounded px-3 py-2"
              placeholder="Enter Client Name"
              label="Client Name"
            />

            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded text-zinc-900 px-3 py-2"
              placeholder="Detailed description..."
            />

            <div className="flex gap-2">
              <DropDownInput
                options={priorityOption}
                name="priority"
                className="w-40"
                formik={formik}
                label="Priority"
                placeholder="Select Priority"
              />

              <CustomInput
                type="date"
                name="deadline"
                formik={formik}
                className="border rounded text-zinc-900 px-3 py-2 w-1/2"
              />
            </div>

            <DropDownInput
              options={teamMember}
              name="assignedTo"
              className="w-40"
              label="Assign To"
              placeholder="Select team member"
              formik={formik}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-zinc-900 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
