// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../Auth/AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom";

const Navbar = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    window.location.href = "/login";
  };

  const handleMyAccount = () => {
    setProfileOpen(false);
    navigate("/my-account");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between bg-blue-700 text-white px-6 py-3 shadow-md relative z-20">
        
        {/* Sidebar toggle for mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className="flex-1" />

        {/* Right Section */}
        <div className="relative profile-dropdown">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 hover:text-blue-200 transition"
          >
            <UserCircleIcon className="h-7 w-7" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
              {/* Make this clickable and navigate */}
              <button
                onClick={handleMyAccount}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-md"
              >
                <p className="font-semibold">My Account</p>
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-b-md"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800">Confirm Logout</h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
