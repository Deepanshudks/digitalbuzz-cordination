import React from "react";
import { Dialog, Button, CircularProgress } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskFn } from "@/services/task";
import toast from "react-hot-toast";

interface ConfirmDeleteProps {
  open: boolean;
  taskId: string;
  setDeleteModalOpen: (val: boolean) => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  open,
  taskId,
  setDeleteModalOpen,
}) => {
  const queryClient = useQueryClient();

  const { mutate: DeleteTask, isPending } = useMutation({
    mutationFn: () => deleteTaskFn({ id: taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskList"] });
      queryClient.invalidateQueries({ queryKey: ["admintaskList"] });
      toast.success("Task has been deleted");
    },
    onError: (error: any) => {
      alert(error.message || "Failed to create task");
    },
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        setDeleteModalOpen(false);
      }}
      aria-labelledby="delete-task-title"
      aria-describedby="delete-task-description"
      PaperProps={{
        className:
          "rounded-xl shadow-lg bg-white dark:bg-zinc-900 transition-all duration-300",
      }}
    >
      <p
        id="delete-task-title"
        className="
          text-lg font-semibold text-zinc-800 
          border-b  p-2 px-4
        "
      >
        Confirm Delete
      </p>

      <div id="delete-task-description" className="px-4 py-5">
        <p className="text-gray-700 text-base leading-relaxed">
          Are you sure you want to delete?
        </p>
        <p className="text-gray-500 dark:text-zinc-400 text-sm">
          This action is permanent and will remove all associated information
          from the system.
        </p>
      </div>

      <div className="flex gap-4 p-2 justify-end">
        <Button
          onClick={() => {
            setDeleteModalOpen(false);
          }}
          variant="outlined"
          disabled={isPending}
          className="
            capitalize rounded-lg px-5
            border-gray-300 text-gray-700 hover:bg-gray-100
            dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800
          "
        >
          Cancel
        </Button>
        <Button
          onClick={() => DeleteTask()}
          variant="contained"
          color="error"
          disabled={isPending}
          className="capitalize rounded-lg px-5 font-medium shadow-sm flex items-center gap-2"
        >
          {isPending && <CircularProgress size={18} color="inherit" />}
          {isPending ? "Deleting…" : "Delete Task"}
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmDelete;
