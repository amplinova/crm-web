import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const TasksPage = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "assigned"
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    leadId: "",
    title: "",
    startDate: "",
    endDate: "",
    assignedToUserId: "",
    observerUserId: "",
    priority: "",
    description: "",
  });

  // Get user role and ID from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role || "");
    setUserId(id || "");
    
    // Set default tab based on role
    if (role !== "ADMIN") {
      setActiveTab("assigned");
    }
  }, []);

  /* ---------------------- Load All Leads ---------------------- */
  const getAllLeads = async () => {
    try {
      const res = await api.get("/api/leads");
      setLeads(res.data.data || []);
    } catch {
      Swal.fire("Error", "Failed to load leads", "error");
    }
  };

  /* ---------------------- Load All Users ---------------------- */
  const getAllUsers = async () => {
    try {
      const res = await api.get("/auth");
      setUsers(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  /* ---------------------- Load All Tasks ---------------------- */
  const getAllTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/leads/get-all-tasks");
      setTasks(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- Load Tasks Assigned to Current User ---------------------- */
  const getTasksAssignedToMe = async () => {
    if (!userId) {
      Swal.fire("Error", "User ID not found", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/api/leads/tasks/${userId}`);
      setTasks(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to load assigned tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- Load tasks based on active tab ---------------------- */
  const loadTasks = async () => {
    if (activeTab === "all") {
      await getAllTasks();
    } else {
      await getTasksAssignedToMe();
    }
  };

  /* ---------------------- Handle tab change ---------------------- */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  /* ---------------------- Add Task ---------------------- */
  const handleAddTask = async () => {
    if (!formData.leadId || !formData.title || !formData.priority) {
      Swal.fire("Missing Fields", "Lead, Title & Priority are required", "warning");
      return;
    }

    try {
      await api.post("/api/leads/tasks", formData);

      Swal.fire("Success", "Task created successfully", "success");

      setIsModalOpen(false);
      loadTasks(); // Reload current tab data

      setFormData({
        leadId: "",
        title: "",
        startDate: "",
        endDate: "",
        assignedToUserId: "",
        observerUserId: "",
        priority: "",
        description: "",
      });
    } catch {
      Swal.fire("Error", "Failed to create task", "error");
    }
  };

  /* ---------------------- Delete Task ---------------------- */
  const handleDelete = async (taskId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/leads/0/tasks/${taskId}`);
      Swal.fire("Deleted", "Task removed successfully", "success");
      loadTasks(); // Reload current tab data
    } catch {
      Swal.fire("Error", "Failed to delete task", "error");
    }
  };

  /* ---------------------- Initial Load ---------------------- */
  useEffect(() => {
    getAllLeads();
    getAllUsers();
  }, []);

  useEffect(() => {
    if (userRole && userId) {
      loadTasks();
    }
  }, [activeTab, userRole, userId]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Lead Task Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <span className="font-semibold text-blue-700">Tasks</span>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          + Add Task
        </button>
      </div>

      {/* Tabs - Only show if user is ADMIN */}
      {userRole === "ADMIN" && (
        <div className="mb-6 border-b">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === "all"
                  ? "bg-blue-700 text-white border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("all")}
            >
              All Tasks
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === "assigned"
                  ? "bg-blue-700 text-white border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("assigned")}
            >
              Tasks Assigned to Me
            </button>
          </div>
        </div>
      )}

      {/* Table Header with Tab Info */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {activeTab === "all" ? "All Tasks" : "Tasks Assigned to Me"}
          <span className="ml-2 text-sm text-gray-500">
            ({tasks.length} tasks)
          </span>
        </h2>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No tasks found.</p>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                {activeTab === "all" && <th className="px-4 py-3">Observer</th>}
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="px-4 py-3">{task.id}</td>
                  <td className="px-4 py-3">{task.leadName}</td>
                  <td className="px-4 py-3">{task.title}</td>
                  <td className="px-4 py-3">{task.assignedToName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === "HIGH" 
                        ? "bg-red-100 text-red-800"
                        : task.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">{task.startDate}</td>
                  <td className="px-4 py-3">{task.endDate}</td>
                  {activeTab === "all" && (
                    <td className="px-4 py-3">{task.observerName || "N/A"}</td>
                  )}
                  <td className="px-4 py-3 flex items-center justify-center gap-3">
                    {/* View */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/tasks/view/${task.id}`)}
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>

                    {/* Edit */}
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => navigate(`/tasks/edit/${task.id}`)}
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>

                    {/* Delete */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(task.id)}
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------------------- MODAL ---------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-1/2 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Task</h2>

            {/* Lead */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
            >
              <option value="">Select Lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.customerName}
                </option>
              ))}
            </select>

            {/* Title */}
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            {/* Start & End Date */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="datetime-local"
                className="w-full p-2 border rounded mb-3"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />

              <input
                type="datetime-local"
                className="w-full p-2 border rounded mb-3"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            {/* Assigned */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={formData.assignedToUserId}
              onChange={(e) =>
                setFormData({ ...formData, assignedToUserId: e.target.value })
              }
            >
              <option value="">Assign To</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>

            {/* Observer */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={formData.observerUserId}
              onChange={(e) =>
                setFormData({ ...formData, observerUserId: e.target.value })
              }
            >
              <option value="">Observer</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>

            {/* Priority */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="">Select Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            {/* Description */}
            <textarea
              className="w-full p-2 border rounded mb-3"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;