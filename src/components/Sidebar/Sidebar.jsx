import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import ampliNovaLogo from "../../Assets/AmpliNova  Logo-A LOGO.png";

const Sidebar = ({ sidebarOpen }) => {
  const [leadsDropdownOpen, setLeadsDropdownOpen] = useState(false);
  const location = useLocation();

  // Auto-expand dropdowns
  useEffect(() => {
    if (location.pathname.startsWith("/leads")) setLeadsDropdownOpen(true);
  
  }, [location.pathname]);

  const linkClass = (isActive) =>
    `flex items-center w-full px-4 py-2 rounded-lg transition-all ${
      isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
    }`;

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } bg-blue-700 text-white w-64 h-screen fixed md:static md:translate-x-0 
      transition-transform duration-300 z-30 flex flex-col shadow-xl`}
    >
      {/* ✅ Header with Bigger Clearer Logo */}
      <NavLink
        to="/dashboard"
        className="sticky top-0 z-20 flex items-center justify-center gap-3 p-5 
        border-b border-blue-500 bg-blue-700 cursor-pointer hover:bg-blue-600 transition-all"
      >
        <img
          src={ampliNovaLogo}
          alt="AmpliNova Logo"
          className="
            w-20 h-20
            object-contain
            drop-shadow-xl
            rounded-2xl
            bg-white/90
            p-2
          "
        />
        <h1 className="text-xl font-semibold tracking-wide whitespace-nowrap">
          AmpliNova
        </h1>
      </NavLink>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-3 space-y-1">
          {/* Dashboard */}
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
              <ChartBarIcon className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>
          </li>

          {/* Leads */}
          <li>
            <button
              onClick={() => setLeadsDropdownOpen(!leadsDropdownOpen)}
              className={`flex items-center w-full px-4 py-2 rounded-lg hover:bg-blue-600 transition-all ${
                location.pathname.startsWith("/leads") ? "bg-blue-800" : ""
              }`}
            >
              <UsersIcon className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">Leads</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  leadsDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {leadsDropdownOpen && (
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  <NavLink
                    to="/leads"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    All Leads
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/leads/qualified"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    Qualified Leads
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/leads/unqualified"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    Unqualified Leads
                  </NavLink>
                </li>
              </ul>
            )}
          </li>


          {/* Agents */}
          <li>
            <NavLink to="/agents" className={({ isActive }) => linkClass(isActive)}>
              <UserIcon className="h-5 w-5 mr-3" />
              Agents
            </NavLink>
          </li>

          {/* Sales */}
          <li>
            <NavLink to="/sources" className={({ isActive }) => linkClass(isActive)}>
              <CurrencyDollarIcon className="h-5 w-5 mr-3" />
              Sources
            </NavLink>
          </li>

          {/* Reports */}
          <li>
            <NavLink to="/reports" className={({ isActive }) => linkClass(isActive)}>
              <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
              Reports
            </NavLink>
          </li>

          {/* Settings */}
          <li>
            <NavLink to="/settings" className={({ isActive }) => linkClass(isActive)}>
              <Cog6ToothIcon className="h-5 w-5 mr-3" />
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <footer className="p-4 border-t border-blue-500 text-center text-xs opacity-80">
        © 2025 AmpliNova
      </footer>
    </aside>
  );
};

export default Sidebar;
