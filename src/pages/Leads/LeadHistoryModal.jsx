import React, { useEffect, useState } from "react";
import useAxios from "../Auth/useAxios";
import Swal from "sweetalert2";

const LeadHistoryModal = ({ leadId, onClose }) => {
  const api = useAxios();
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  // Form state
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [nextScheduleDateTime, setNextScheduleDateTime] = useState("");
  const [calledNumber, setCalledNumber] = useState("");
  const [callType, setCallType] = useState("");

  // Fetch history
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

  // Add new history
  const submitHistory = async () => {
    if (!description || !status) {
      Swal.fire("Error", "Description and status are required", "error");
      return;
    }

    const payload = {
      leadId,
      description,
      status,
      contactDate: null, // backend will set as NOW
      nextScheduleDateTime,
      calledNumber,
      callType,
      processedById: null // backend will set logged-in user
    };

    try {
      const res = await api.post("/add-history", payload);
      Swal.fire("Success", "History Added", "success");
      fetchHistory();
      setDescription("");
      setStatus("");
      setNextScheduleDateTime("");
      setCalledNumber("");
      setCallType("");
    } catch (error) {
      Swal.fire("Error", "Failed to add history", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Lead History - #{leadId}</h2>
          <button onClick={onClose} className="text-red-500 text-xl font-bold">
            ×
          </button>
        </div>

        {/* Add History Form */}
        <div className="space-y-3 border p-4 rounded mb-6 bg-gray-50">
          <h3 className="font-semibold">Add New History</h3>

          <textarea
            className="w-full p-2 border rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="NEW_LEADS">New</option>
            <option value="PENDING_LEADS">Pending</option>
            <option value="PROCESSING_LEADS">Processing</option>
            <option value="INTERESTED_LEADS">Interested</option>
            <option value="BOOKED_LEADS">Booked</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={nextScheduleDateTime}
            onChange={(e) => setNextScheduleDateTime(e.target.value)}
          />

          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Called Number"
            value={calledNumber}
            onChange={(e) => setCalledNumber(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded"
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
          >
            <option value="">Call Type</option>
            <option value="INCOMING">Incoming</option>
            <option value="OUTGOING">Outgoing</option>
            <option value="MISSED">Missed</option>
          </select>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={submitHistory}
          >
            Add History
          </button>
        </div>

        {/* History Table */}
        <h3 className="font-semibold mb-2">History Records</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Next Follow-up</th>
              <th className="p-2 border">Processed By</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((h) => (
              <tr key={h.id} className="border-b">
                <td className="p-2 border">{h.contactDate}</td>
                <td className="p-2 border">{h.description}</td>
                <td className="p-2 border">{h.status}</td>
                <td className="p-2 border">{h.nextScheduleDateTime}</td>
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
