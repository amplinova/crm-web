// ViewLeadPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";

const ViewLeadPage = () => {
  const { id } = useParams();
  const leadId = Number(id);
  const api = useAxios();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [users, setUsers] = useState([]);

  const [historyEntries, setHistoryEntries] = useState([]);
  const [emails, setEmails] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  /** ------------------ GET ALL USERS ------------------ */
  const getAllUsers = async () => {
    try {
      const res = await api.get("/auth/id-names");
      setUsers(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  /** ------------------ FETCH LEAD ------------------ */
  const fetchLead = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}`);
      setLead(res.data.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load lead", "error");
    }
  };

  /** ------------------ FETCH HISTORY ------------------ */
  const fetchHistory = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}/history`);
      setHistoryEntries(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load history", "error");
      setHistoryEntries([]);
    }
  };

  /** ------------------ FETCH EMAILS ------------------ */
  const fetchEmails = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}/emails`);
      setEmails(res.data);
    } catch (err) {
      setEmails([]);
    }
  };

  /** ------------------ FETCH TASKS ------------------ */
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setTasks([]);
    }
  };

  /** ------------------ FETCH ACTIVITIES ------------------ */
  const fetchLeadActivities = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}/activities`);
      setActivities(res.data);
    } catch (err) {
      setActivities([]);
    }
  };

  /** ------------------ LOAD ALL ------------------ */
  useEffect(() => {
    fetchLead();
    fetchHistory();
    fetchEmails();
    fetchLeadActivities();
    fetchTasks();
    getAllUsers();
  }, [id]);

  if (!lead) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {/* -------------------- TOP HEADER -------------------- */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {lead.customerName ? lead.customerName.charAt(0).toUpperCase() : "L"}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {lead.customerName}
              </h1>
              <p className="text-gray-600">
                {lead.address || lead.location || "Address not available"}
              </p>

              <div className="mt-2 text-sm text-gray-600">
                <span className="mr-4">
                  <strong>Phone:</strong> {lead.mobile}
                </span>
                <span>
                  <strong>Email:</strong> {lead.email}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <div>
                <strong>Status:</strong>{" "}
                <span className="font-semibold">{lead.status}</span>
              </div>
              <div className="mt-2">
                <strong>Priority:</strong>{" "}
                <span className="font-semibold">{lead.priority}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- MAIN AREA -------------------- */}
      <div className="flex gap-6 mt-6">
        {/* LEFT SIDE DETAILS */}
        <div className="w-1/3 bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Lead Details</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="font-semibold py-1 w-36">ID:</td><td>{lead.id}</td></tr>
              <tr><td className="font-semibold py-1">Name:</td><td>{lead.customerName}</td></tr>
              <tr><td className="font-semibold py-1">Email:</td><td>{lead.email}</td></tr>
              <tr><td className="font-semibold py-1">Mobile:</td><td>{lead.mobile}</td></tr>
              <tr><td className="font-semibold py-1">Source:</td><td>{lead.sourceName}</td></tr>
              <tr><td className="font-semibold py-1">Priority:</td><td>{lead.priority}</td></tr>
              <tr><td className="font-semibold py-1">Status:</td><td>{lead.status}</td></tr>
              <tr><td className="font-semibold py-1">Category:</td><td>{lead.businessCategory}</td></tr>
              <tr><td className="font-semibold py-1">Assigned To:</td><td>{lead.assignedToName}</td></tr>
              <tr><td className="font-semibold py-1">Follow Up:</td>
                <td>{lead.followUpDate ? lead.followUpDate.replace("T", " ") : "-"}</td></tr>
              <tr><td className="font-semibold py-1 align-top">Note:</td><td>{lead.note || "-"}</td></tr>
            </tbody>
          </table>
        </div>

        {/* -------------------- RIGHT TABS -------------------- */}
        <div className="w-2/3 bg-white rounded-lg shadow-md">
          <div className="flex border-b">
            {["history", "emails", "task", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold ${
                  activeTab === tab
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-500"
                }`}
              >
                {tab === "history"
                  ? "History"
                  : tab === "emails"
                  ? "Emails"
                  : tab === "task"
                  ? "Task"
                  : "Lead Activity"}
              </button>
            ))}
          </div>

          {/* -------------------- TAB BODY -------------------- */}
          <div className="p-6 text-sm">
            {/* ============ HISTORY TAB ============ */}
            {activeTab === "history" && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-700">
                  Lead History
                </h3>

                {historyEntries.length === 0 ? (
                  <p>No history found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left border">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="px-3 py-2">Contact Date</th>
                          <th className="px-3 py-2">Next Schedule</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Priority</th>
                          <th className="px-3 py-2">Description</th>
                          <th className="px-3 py-2">Processed By</th>
                          <th className="px-3 py-2">Call Type</th>
                          <th className="px-3 py-2">Duration</th>
                          <th className="px-3 py-2">Recording</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyEntries.map((h) => (
                          <tr key={h.id} className="border-b">
                            <td className="px-3 py-2">
                              {h.contactDate
                                ? new Date(h.contactDate).toLocaleString()
                                : "-"}
                            </td>
                            <td className="px-3 py-2">
                              {h.nextScheduleDateTime
                                ? new Date(h.nextScheduleDateTime).toLocaleString()
                                : "-"}
                            </td>
                            <td className="px-3 py-2">{h.status}</td>
                            <td className="px-3 py-2">{h.priority}</td>
                            <td className="px-3 py-2">{h.description}</td>
                            <td className="px-3 py-2">{h.processedByName}</td>
                            <td className="px-3 py-2">{h.callType}</td>
                            <td className="px-3 py-2">{h.callDuration}</td>
                            <td className="px-3 py-2 text-blue-600">
                              {h.recordedFileName ? (
                                <a
                                  href={`/uploads/leads/recordings/${h.recordedFileName}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline"
                                >
                                  {h.recordedFileName}
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ============ EMAIL TAB ============ */}
            {activeTab === "emails" && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-700">Emails</h3>
                {emails.length === 0 ? (
                  <p>No emails.</p>
                ) : (
                  <div className="space-y-3">
                    {emails.map((email) => (
                      <div key={email.id} className="p-3 border rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">{email.subject}</div>
                            <div className="text-xs text-gray-500">
                              {email.sentAt
                                ? new Date(email.sentAt).toLocaleString()
                                : new Date(email.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {email.fromEmail} → {email.toEmail}
                          </div>
                        </div>

                        <div className="mt-2 text-gray-700">
                          {email.description}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          Status: {email.status}
                          {email.errorMessage
                            ? ` | Error: ${email.errorMessage}`
                            : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============ TASK TAB ============ */}
            {activeTab === "task" && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-700">Tasks</h3>

                {tasks.length === 0 ? (
                  <p>No tasks.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="px-3 py-2">Title</th>
                          <th className="px-3 py-2">Start Date</th>
                          <th className="px-3 py-2">End Date</th>
                          <th className="px-3 py-2">Assigned To</th>
                          <th className="px-3 py-2">Observer</th>
                          <th className="px-3 py-2">Priority</th>
                          <th className="px-3 py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((t) => (
                          <tr key={t.id} className="border-b">
                            <td className="px-3 py-2">{t.title}</td>
                            <td className="px-3 py-2">
                              {t.startDate
                                ? new Date(t.startDate).toLocaleString()
                                : "-"}
                            </td>
                            <td className="px-3 py-2">
                              {t.endDate
                                ? new Date(t.endDate).toLocaleString()
                                : "-"}
                            </td>
                            <td className="px-3 py-2">{t.assignedToName}</td>
                            <td className="px-3 py-2">{t.observerName}</td>
                            <td className="px-3 py-2">{t.priority}</td>
                            <td className="px-3 py-2">{t.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ============ ACTIVITY TAB ============ */}
            {activeTab === "activity" && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-700">
                  Lead Activity
                </h3>

                {activities.length === 0 ? (
                  <p>No activity found.</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((a) => (
                      <div key={a.id} className="p-3 border rounded">
                        <div className="text-sm text-gray-600">
                          {new Date(a.createdAt).toLocaleString()}
                        </div>
                        <div className="text-gray-800 mt-1">{a.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- BACK BUTTON ---------------- */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/leads")}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewLeadPage;
