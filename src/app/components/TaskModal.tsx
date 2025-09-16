"use client";
import { getTaskUpdates, TaskUpdateFn } from "@/services/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import DropDownInput from "./utils/DropDownInput";
import CustomInput from "./utils/CustonInput";
import { Button, CircularProgress, Divider, Skeleton } from "@mui/material";
import toast from "react-hot-toast";
import { CancelOutlined } from "@mui/icons-material";
import { statusOption } from "../static";

interface TaskModalProps {
  open: boolean;
  setModalOpen: (boolean: boolean) => void;
  taskId: string;
  title: string;
  clientName: string;
  defaultStatus?: string;
}

interface ReqBody {
  id: string;
  status: string;
  remarks: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  setModalOpen,
  taskId,
  title,
  clientName,
  defaultStatus = "PENDING",
}) => {
  const [status, setStatus] = useState(defaultStatus);
  const [remark, setRemark] = useState("");
  const queryClient = useQueryClient();

  const { mutate: updateTask, isPending } = useMutation({
    mutationFn: (values: ReqBody) => TaskUpdateFn(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admintaskList"] });
      toast.success("Task Updated Successfully");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  const { data, isPending: isHistoryPending } = useQuery({
    queryFn: () => getTaskUpdates(taskId),
    queryKey: ["taskUpdates", taskId],
    enabled: Boolean(taskId && open),
  });

  const taskUpdates = data?.tasks;

  if (!open) return null;

  const handleClose = () => {
    setModalOpen(false);
    setRemark("");
    setStatus(defaultStatus);
  };

  const handleUpdate = () => {
    updateTask({
      id: taskId,
      status: status,
      remarks: remark,
    });
  };

  const statusOp = statusOption.filter((e) => e.label !== "All");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <CancelOutlined />
        </button>

        <h2 className="text-xl py-2 font-semibold">{title}</h2>
        <p className="text-sm text-gray-500 capitalize">Client: {clientName}</p>

        <div className="mt-4">
          <DropDownInput
            options={statusOp}
            name="status"
            className="w-40"
            label="Update Status"
            value={status}
            setValue={setStatus}
          />
        </div>

        <div className="mt-4">
          <CustomInput
            name="remark"
            multiline
            value={remark}
            required
            label="Add Remark"
            rows={4}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Provide status update, progress details, or any questions..."
            className="w-full border rounded-lg p-2 text-sm min-h-[80px]"
          />
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={Boolean(!status || !remark)}
            className="bg-blue-600 w-36 text-white justify-center items-center px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            {isPending ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Update Task"
            )}
          </Button>
          <button
            onClick={handleClose}
            className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
          >
            Cancel
          </button>
        </div>

        <Divider className="py-2" />

        <div className="py-4">
          <h3 className="text-sm font-semibold">Task History</h3>
          <div className="flex flex-col py-2 gap-2 max-h-32 overflow-y-scroll">
            {isHistoryPending ? (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>
            ) : (
              taskUpdates?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-xs text-gray-500 bg-zinc-100 rounded-xl p-4"
                >
                  <p>
                    <span>Updated by:</span>{" "}
                    <span className="capitalize">{item.updatedByUser}</span>
                  </p>

                  <p>{new Date(item?.updatedAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
