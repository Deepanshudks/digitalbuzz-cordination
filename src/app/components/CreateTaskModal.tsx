"use client";

import { useState, useEffect } from "react";
import { X, User, Calendar, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  username: string;
  role: string;
  branch: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
}: CreateTaskModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [opsUsers, setOpsUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientName: "",
    priority: "MEDIUM",
    assignedToId: "",
    deadline: "",
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchOpsUsers();
      // Set default deadline to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({
        ...prev,
        deadline: tomorrow.toISOString().split("T")[0],
      }));
    }
  }, [isOpen, user]);

  const fetchOpsUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/branch/${user?.branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const users = await response.json();
        const ops = users.filter((u: User) => u.role === "OPS");
        setOpsUsers(ops);
        if (ops.length > 0) {
          setFormData((prev) => ({ ...prev, assignedToId: ops[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching ops users:", error);
      toast.error("Failed to load team members");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onTaskCreated();
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      clientName: "",
      priority: "MEDIUM",
      assignedToId: opsUsers[0]?.id || "",
      deadline: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Create New Task
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Client Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  required
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter client/channel partner name"
                />
              </div>
            </div>

            {/* Task Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., Update pricing banner with 5% discount"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
                placeholder="Describe the task in detail, including any specific requirements or changes needed..."
              />
            </div>

            {/* Priority and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="select-field pl-10"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Deadline *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Assign To */}
            <div>
              <label
                htmlFor="assignedToId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assign To *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="assignedToId"
                  name="assignedToId"
                  required
                  value={formData.assignedToId}
                  onChange={handleInputChange}
                  className="select-field pl-10"
                >
                  <option value="">Select team member</option>
                  {opsUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.branch} Operations)
                    </option>
                  ))}
                </select>
              </div>
              {opsUsers.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  No operations team members found in your branch.
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || opsUsers.length === 0}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-digitalbuzz-black"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
