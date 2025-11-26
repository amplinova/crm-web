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
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

import ampliNovaLogo from "../../Assets/AmpliNova  Logo-Name.png";

const Sidebar = ({ sidebarOpen }) => {
  const [leadsDropdownOpen, setLeadsDropdownOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/leads")) setLeadsDropdownOpen(true);
    if (location.pathname.startsWith("/team-structure")) setTeamDropdownOpen(true);
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
      {/* Logo Header */}
      <NavLink
        to="/dashboard"
        className="
          sticky top-0 z-20 
          flex items-center justify-center 
          p-6 w-full
          bg-white
          border-b border-gray-300
        "
      >
        <img
          src={ampliNovaLogo}
          alt="Logo"
          className="w-40 h-auto object-contain"
        />
      </NavLink>

      <nav
  className="flex-1 overflow-y-scroll scroll-smooth"
  style={{
    scrollbarWidth: "none",   // Firefox
    msOverflowStyle: "none",  // IE/Edge
  }}
>
        <ul className="p-3 space-y-1">
  
          
          {/* Dashboard */}
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
              <ChartBarIcon className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>
          </li>

          {/* ⭐ Team Structure DROP–DOWN */}
          <li>
            <button
              onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
              className={`flex items-center w-full px-4 py-2 rounded-lg hover:bg-blue-600 transition-all ${
                location.pathname.startsWith("/team-structure") ? "bg-blue-800" : ""
              }`}
            >
              <BriefcaseIcon className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">Team Structure</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  teamDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {teamDropdownOpen && (
              <ul className="ml-4 mt-1 space-y-1 text-sm">

                <li>
                  <NavLink
                    to="/team-structure/admin"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/team-structure/roles"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    Roles
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/team-structure/permissions"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    Permissions
                  </NavLink>
                </li>

              </ul>
            )}
          </li>

          {/* Leads */}
          <li>
            <button
              onClick={() => setLeadsDropdownOpen(!leadsDropdownOpen)}
              className={`flex items-center w-full px-4 py-2 rounded-lg 
              hover:bg-blue-600 transition-all ${
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
    end
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
                    to="/leads/status"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    Lead Status
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/leads/recycle-bin"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md transition ${
                        isActive ? "bg-blue-800 text-white" : "hover:bg-blue-600 text-blue-100"
                      }`
                    }
                  >
                    Lead Recycle Bin
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

          {/* Sources */}
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

          {/* Email & SMS */}
          <li>
            <NavLink to="/email-sms" className={({ isActive }) => linkClass(isActive)}>
              <EnvelopeIcon className="h-5 w-5 mr-3" />
              Email & SMS
            </NavLink>
          </li>

          {/* Follow-up Report */}
          <li>
            <NavLink to="/followup-report" className={({ isActive }) => linkClass(isActive)}>
              <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
              Follow-up Report
            </NavLink>
          </li>

          {/* Task */}
          <li>
            <NavLink to="/task" className={({ isActive }) => linkClass(isActive)}>
              <ClipboardDocumentCheckIcon className="h-5 w-5 mr-3" />
              Task
            </NavLink>
          </li>

          {/* Invoice */}
          <li>
            <NavLink to="/invoice" className={({ isActive }) => linkClass(isActive)}>
              <DocumentTextIcon className="h-5 w-5 mr-3" />
              Invoice
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
