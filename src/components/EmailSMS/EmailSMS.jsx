// EmailSMS.jsx
import React, { useState, useEffect } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";

export default function EmailSMS() {
  const [leads, setLeads] = useState([]);
  const api = useAxios();

  const [formData, setFormData] = useState({
    leadId: "",
    fromEmail: "satyanarayanarft@gmail.com", // Fixed From Email
    toEmail: "",
    ccEmail: "",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD LEADS ---------------- */
  const getAllLeads = async () => {
    try {
      const res = await api.get("/api/leads");
      setLeads(res.data.data || []);
    } catch {
      Swal.fire("Error", "Failed to load leads", "error");
    }
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    getAllLeads();
  }, []);

  /* ---------------- HANDLE FIELD CHANGE ---------------- */
  const handleFieldChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ---------------- AUTO FILL EMAIL BASED ON LEAD ---------------- */
  const handleLeadSelect = (leadId) => {
    const selectedLead = leads.find((l) => l.id.toString() === leadId.toString());

    setFormData((prev) => ({
      ...prev,
      leadId: leadId,
      toEmail: selectedLead?.email || "",
    }));
  };

  /* ---------------- SEND EMAIL API ---------------- */
  const handleSend = async (e) => {
    e.preventDefault();

    if (!formData.leadId) {
      return Swal.fire("Error", "Please select a lead", "error");
    }

    setLoading(true);

    const payload = {
      leadId: formData.leadId,
      fromEmail: formData.fromEmail, // fixed
      toEmail: formData.toEmail,
      ccEmail: formData.ccEmail,
      subject: formData.subject,
      description: formData.description,
    };

    try {
      await api.post("/api/leads/email", payload);
      Swal.fire("Success", "Email sent successfully!", "success");

      // Reset form (keep fromEmail fixed)
      setFormData({
        leadId: "",
        fromEmail: "satyanarayanarft@gmail.com",
        toEmail: "",
        ccEmail: "",
        subject: "",
        description: "",
      });
    } catch (err) {
      Swal.fire("Error", err?.response?.data || "Failed to send email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Compose Email</h2>

      <form onSubmit={handleSend} className="space-y-4">
        {/* LEAD DROPDOWN */}
        <select
          name="leadId"
          value={formData.leadId}
          onChange={(e) => handleLeadSelect(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Lead</option>
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.fullName} ({lead.email})
            </option>
          ))}
        </select>

        {/* FROM EMAIL (FIXED) */}
        <input
          type="email"
          name="fromEmail"
          value={formData.fromEmail}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />

        {/* TO EMAIL (AUTO-FILLED) */}
        <input
          type="email"
          name="toEmail"
          placeholder="Recipient Email"
          value={formData.toEmail}
          onChange={handleFieldChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* CC */}
        <input
          type="email"
          name="ccEmail"
          placeholder="CC (optional)"
          value={formData.ccEmail}
          onChange={handleFieldChange}
          className="w-full p-2 border rounded"
        />

        {/* SUBJECT */}
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleFieldChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* MESSAGE BOX */}
        <textarea
          name="description"
          placeholder="Type your message..."
          value={formData.description}
          onChange={handleFieldChange}
          required
          className="w-full p-3 border rounded min-h-[150px]"
        />

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
