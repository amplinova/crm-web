import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";

const EditLeadPage = () => {
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/api/leads/${id}`);
      setLead(res.data.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load lead", "error");
    }
  };

  useEffect(() => {
    fetchLead();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/leads/${id}`, lead);

      Swal.fire("Success", "Lead updated successfully!", "success");
      navigate("/leads");
    } catch (err) {
      Swal.fire("Error", "Failed to update lead", "error");
    }
  };

  if (!lead) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Lead</h2>

      <div className="grid grid-cols-1 gap-3 bg-white p-6 rounded-lg shadow-xl">
        {Object.entries(lead).map(([key, value]) => (
          <input
            key={key}
            type="text"
            className="border px-3 py-2 rounded"
            value={value}
            onChange={(e) => setLead({ ...lead, [key]: e.target.value })}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate("/leads")}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Update Lead
        </button>
      </div>
    </div>
  );
};

export default EditLeadPage;
