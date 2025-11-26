
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminsData from "../../json/admins.json";

const AdminViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = adminsData.find((a) => a.id === Number(id));

  if (!admin) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Admin not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-xl p-6 border">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Admin Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="text-lg font-semibold">{admin.fullName}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-lg font-semibold">{admin.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Username</p>
            <p className="text-lg font-semibold">{admin.username}</p>
          </div>

          <div>
            <p className="text-gray-500">Mobile</p>
            <p className="text-lg font-semibold">{admin.mobile}</p>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <p className="text-lg font-semibold">{admin.role}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p
              className={`text-lg font-semibold ${
                admin.status === "Active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {admin.status}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Created At</p>
            <p className="text-lg font-semibold">{admin.createdAt}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminViewPage;
