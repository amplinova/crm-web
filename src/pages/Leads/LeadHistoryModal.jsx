import React, { useEffect, useState } from "react";
import useAxios from "../Auth/useAxios";
import Swal from "sweetalert2";

const DEMO_OUTCOMES = [
  "DEMO_FIXED",
  "DEMO_CONDUCTED",
  "DEMO_RESCHEDULED"
];

const LeadHistoryModal = ({ leadId, onClose }) => {
  const api = useAxios();

  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  /* ================= FORM STATE ================= */

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [callOutcome, setCallOutcome] = useState("");
  const [nextScheduleDateTime, setNextScheduleDateTime] = useState("");
  const [calledNumber, setCalledNumber] = useState("");
  const [callType, setCallType] = useState("");

  // DEMO FIELDS
  const [demoDateTime, setDemoDateTime] = useState("");
  const [demoSession, setDemoSession] = useState("");
  const [demoMode, setDemoMode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [demoAttendedBy, setDemoAttendedBy] = useState("");
  const [closingChance, setClosingChance] = useState("");

  const isDemoFlow = DEMO_OUTCOMES.includes(callOutcome);

  /* ================= FETCH HISTORY ================= */

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/get-history/${leadId}`);
      setHistoryList(res.data.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch lead history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [leadId]);

  /* ================= SUBMIT ================= */

  const submitHistory = async () => {
    if (!description || !callOutcome) {
      Swal.fire("Error", "Description and Call Outcome are required", "error");
      return;
    }

    if (isDemoFlow && !demoDateTime) {
      Swal.fire("Error", "Demo date & time is required", "error");
      return;
    }

    const payload = {
      leadId,
      description,
      status: status || null,
      callOutcome,
      nextScheduleDateTime: nextScheduleDateTime || null,
      calledNumber: calledNumber || null,
      callType: callType || null,

      // DEMO FIELDS
      demoDateTime: isDemoFlow ? demoDateTime : null,
      demoSession: isDemoFlow ? demoSession : null,
      demoMode: isDemoFlow ? demoMode : null,
      businessName: isDemoFlow ? businessName : null,
      demoAttendedBy: isDemoFlow ? demoAttendedBy : null,
      closingChance: isDemoFlow ? closingChance : null
    };

    try {
      await api.post("/add-history", payload);
      Swal.fire("Success", "History added successfully", "success");
      fetchHistory();
      resetForm();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to add history", "error");
    }
  };

  const resetForm = () => {
    setDescription("");
    setStatus("");
    setCallOutcome("");
    setNextScheduleDateTime("");
    setCalledNumber("");
    setCallType("");
    setDemoDateTime("");
    setDemoSession("");
    setDemoMode("");
    setBusinessName("");
    setDemoAttendedBy("");
    setClosingChance("");
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Lead History - #{leadId}</h2>
          <button onClick={onClose} className="text-red-500 text-xl font-bold">×</button>
        </div>

        {/* ================= ADD HISTORY ================= */}

        <div className="space-y-3 border p-4 rounded mb-6 bg-gray-50">
          <h3 className="font-semibold">Add Lead Activity</h3>

          <textarea
            className="w-full p-2 border rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Lead Status */}
          <select className="w-full p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="NEW_LEADS">New</option>
            <option value="PENDING_LEADS">Pending</option>
            <option value="PROCESSING_LEADS">Processing</option>
            <option value="INTERESTED_LEADS">Interested</option>
            <option value="BOOKED_LEADS">Booked</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Call Outcome */}
          <select className="w-full p-2 border rounded" value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)}>
            <option value="">Select Call Outcome</option>
            <option value="FIRST_CALL_DONE">First Call Done</option>
            <option value="FOLLOW_UP_CALL_DONE">Follow-up Call Done</option>
            <option value="CALLED_BUT_NOT_PICKED">Called But Not Picked</option>
            <option value="DEMO_FIXED">Demo Fixed</option>
            <option value="DEMO_CONDUCTED">Demo Conducted</option>
            <option value="DEMO_RESCHEDULED">Demo Rescheduled</option>
          </select>

          <input type="datetime-local" className="w-full p-2 border rounded"
            value={nextScheduleDateTime}
            onChange={(e) => setNextScheduleDateTime(e.target.value)}
          />

          <input className="w-full p-2 border rounded" placeholder="Called Number"
            value={calledNumber}
            onChange={(e) => setCalledNumber(e.target.value)}
          />

          <select className="w-full p-2 border rounded" value={callType} onChange={(e) => setCallType(e.target.value)}>
            <option value="">Call Type</option>
            <option value="INCOMING">Incoming</option>
            <option value="OUTGOING">Outgoing</option>
            <option value="MISSED">Missed</option>
          </select>

          {/* ================= DEMO SECTION ================= */}
          {isDemoFlow && (
            <div className="border p-3 rounded bg-white space-y-2">
              <h4 className="font-semibold">Demo Details</h4>

              <input type="datetime-local" className="w-full p-2 border rounded"
                value={demoDateTime}
                onChange={(e) => setDemoDateTime(e.target.value)}
              />

              <select className="w-full p-2 border rounded" value={demoSession} onChange={(e) => setDemoSession(e.target.value)}>
                <option value="">Session</option>
                <option value="MORNING">Morning</option>
                <option value="EVENING">Evening</option>
              </select>

              <select className="w-full p-2 border rounded" value={demoMode} onChange={(e) => setDemoMode(e.target.value)}>
                <option value="">Mode</option>
                <option value="VIRTUAL">Virtual</option>
                <option value="PHYSICAL">Physical</option>
              </select>

              <input className="w-full p-2 border rounded" placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <select className="w-full p-2 border rounded" value={demoAttendedBy} onChange={(e) => setDemoAttendedBy(e.target.value)}>
                <option value="">Attended By</option>
                <option value="OWNER">Owner</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="OTHERS">Others</option>
              </select>

              <select className="w-full p-2 border rounded" value={closingChance} onChange={(e) => setClosingChance(e.target.value)}>
                <option value="">Closing Chance</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          )}

          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={submitHistory}>
            Add History
          </button>
        </div>

        {/* ================= HISTORY TABLE ================= */}

        <h3 className="font-semibold mb-2">History Records</h3>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Outcome</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Processed By</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((h) => (
              <tr key={h.id}>
                <td className="p-2 border">{h.contactDate}</td>
                <td className="p-2 border">{h.callOutcome}</td>
                <td className="p-2 border">{h.description}</td>
                <td className="p-2 border">{h.status}</td>
                <td className="p-2 border">{h.processedByName}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default LeadHistoryModal;
