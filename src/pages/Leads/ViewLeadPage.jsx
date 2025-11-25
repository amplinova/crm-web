import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";

// JSON imports (local sample files)
import leadHistoryData from "../../json/leadHistory.json";
import leadEmailsData from "../../json/leadEmails.json";
import leadTasksData from "../../json/leadTasks.json";
import leadActivityData from "../../json/leadActivity.json";

const ViewLeadPage = () => {
  const { id } = useParams();
  const leadId = Number(id);
  const api = useAxios();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activeTab, setActiveTab] = useState("history"); // history | emails | task | activity

  // data from local JSON (filtered by leadId)
  const [historyEntries, setHistoryEntries] = useState([]);
  const [emails, setEmails] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // fetch lead from API (keeps original API usage)
  const fetchLead = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}`);
      setLead(res.data.data);
    } catch (err) {
      // if API fails, still try to show something from JSON
      Swal.fire("Error", "Failed to load lead from API — falling back to sample data", "error");
      setLead({
        id: leadId,
        customerName: "Sample Lead",
        email: "sample@example.com",
        mobile: "9000000000",
        location: "Sample Location",
        sourceName: "Sample Source",
        priority: "Medium",
        status: "Contacted",
        businessCategory: "Sample Category",
        assignedToName: "Unassigned",
        followUpDate: null,
        note: "Sample note"
      });
    }
  };

  // Load JSON data (simulate backend for tabs)
  const loadLocalJsonData = () => {
    const h = leadHistoryData.find((x) => x.leadId === leadId);
    const e = leadEmailsData.find((x) => x.leadId === leadId);
    const t = leadTasksData.find((x) => x.leadId === leadId);
    const a = leadActivityData.find((x) => x.leadId === leadId);

    setHistoryEntries(h ? h.entries : []);
    setEmails(e ? e.emails : []);
    setTasks(t ? t.tasks : []);
    setActivities(a ? a.activity : []);
  };

  useEffect(() => {
    fetchLead();
    loadLocalJsonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!lead) return <div className="p-6">Loading...</div>;
    return (
    <div className="p-6">

      {/* TOP HEADER */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {lead.customerName ? lead.customerName.charAt(0).toUpperCase() : "L"}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{lead.customerName}</h1>
              <p className="text-gray-600">{lead.address || lead.location || "Address not available"}</p>
              <div className="mt-2 text-sm text-gray-600">
                <span className="mr-4"><strong>Phone:</strong> {lead.mobile}</span>
                <span><strong>Email:</strong> {lead.email}</span>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <div><strong>Status:</strong> <span className="font-semibold">{lead.status}</span></div>
              <div className="mt-2"><strong>Priority:</strong> <span className="font-semibold">{lead.priority}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex gap-6 mt-6">

        {/* LEFT DETAILS */}
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
              <tr><td className="font-semibold py-1">Follow Up:</td><td>{lead.followUpDate ? lead.followUpDate.replace("T", " ") : "-"}</td></tr>
              <tr><td className="font-semibold py-1 align-top">Note:</td><td>{lead.note || "-"}</td></tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT TABS */}
        <div className="w-2/3 bg-white rounded-lg shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 font-semibold ${activeTab === "history" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-500"}`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab("emails")}
              className={`px-6 py-3 font-semibold ${activeTab === "emails" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-500"}`}
            >
              Emails
            </button>
            <button
              onClick={() => setActiveTab("task")}
              className={`px-6 py-3 font-semibold ${activeTab === "task" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-500"}`}
            >
              Task
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 font-semibold ${activeTab === "activity" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-500"}`}
            >
              Lead Activity
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6 text-sm">
            {activeTab === "history" && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-700">History</h3>
                {historyEntries.length === 0 ? (
                  <p>No history entries.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="px-3 py-2">Contact Date</th>
                          <th className="px-3 py-2">Next Schedule</th>
                          <th className="px-3 py-2">Description</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Priority</th>
                          <th className="px-3 py-2">Call Type</th>
                          <th className="px-3 py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyEntries.map((h) => (
                          <tr key={h.id} className="border-b">
                            <td className="px-3 py-2">{new Date(h.contactDate).toLocaleString()}</td>
                            <td className="px-3 py-2">{h.nextSchedule ? new Date(h.nextSchedule).toLocaleString() : "-"}</td>
                            <td className="px-3 py-2">{h.description}</td>
                            <td className="px-3 py-2">{h.status}</td>
                            <td className="px-3 py-2">{h.priority}</td>
                            <td className="px-3 py-2">{h.callType}</td>
                            <td className="px-3 py-2">{h.callDuration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "emails" && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-700">Emails</h3>
                {emails.length === 0 ? (
                  <p>No emails for this lead.</p>
                ) : (
                  <div className="space-y-3">
                    {emails.map((m) => (
                      <div key={m.id} className="p-3 border rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">{m.subject}</div>
                            <div className="text-xs text-gray-500">{new Date(m.date).toLocaleString()}</div>
                          </div>
                          <div className="text-sm text-gray-600">{m.from} → {m.to}</div>
                        </div>
                        <div className="mt-2 text-gray-700">{m.snippet}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                          <th className="px-3 py-2">Due Date</th>
                          <th className="px-3 py-2">Assigned To</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((t) => (
                          <tr key={t.id} className="border-b">
                            <td className="px-3 py-2">{t.title}</td>
                            <td className="px-3 py-2">{t.dueDate}</td>
                            <td className="px-3 py-2">{t.assignedTo}</td>
                            <td className="px-3 py-2">{t.status}</td>
                            <td className="px-3 py-2">{t.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-700">Lead Activity</h3>
                {activities.length === 0 ? (
                  <p>No activity.</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((a) => (
                      <div key={a.id} className="p-3 border rounded">
                        <div className="text-sm text-gray-600">{new Date(a.date).toLocaleString()}</div>
                        <div className="font-semibold">{a.type}</div>
                        <div className="text-gray-700 mt-1">{a.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
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

