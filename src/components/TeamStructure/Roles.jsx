import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rolesData from "../../json/roles.json";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setRoles(rolesData);
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        {/* Title + Breadcrumb */}
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Roles</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <span className="font-semibold text-blue-700">Roles</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 outline-none"
          />
          <button className="px-4 py-2 bg-blue-700 text-white">
            Search
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex justify-end gap-3 pb-5">

        <button
          onClick={() => navigate("/team-structure/roles/add")}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Add Role
        </button>

        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Delete Checked Roles
        </button>

        <button
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
        >
          Delete All Roles
        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  No roles found
                </td>
              </tr>
            ) : (
              filteredRoles.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.roleName}</td>
                  <td className="px-4 py-3">{item.description}</td>

                  <td className="px-4 py-3 flex justify-center gap-3">

                    <EyeIcon
                      className="h-5 w-5 text-blue-600 cursor-pointer"
                      onClick={() =>
                        navigate(`/team-structure/roles/view/${item.id}`)
                      }
                    />

                    <PencilIcon
                      className="h-5 w-5 text-green-600 cursor-pointer"
                      onClick={() =>
                        navigate(`/team-structure/roles/edit/${item.id}`)
                      }
                    />

                    <TrashIcon className="h-5 w-5 text-red-600 cursor-pointer" />

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;
