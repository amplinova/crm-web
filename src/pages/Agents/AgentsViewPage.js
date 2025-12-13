import React, { useEffect, useState, useMemo } from "react";
import useAxios from "../../Auth/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

const UserViewPage = () => {
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [workReport, setWorkReport] = useState([
    {
      sNo: 1,
      date: "2025-01-29",
      talk_time: "45",
      received_calls: 12,
      missed_calls: 5,
      outgoing_calls: 8,
      total_calls: 25,
    },
    {
      sNo: 2,
      date: "2025-02-17",
      talk_time: "200",
      received_calls: 13,
      missed_calls: 2,
      outgoing_calls: 5,
      total_calls: 20,
    },
    {
      sNo: 3,
      date: "2025-01-30",
      talk_time: "180",
      received_calls: 15,
      missed_calls: 3,
      outgoing_calls: 10,
      total_calls: 28,
    },
    {
      sNo: 4,
      date: "2025-01-31",
      talk_time: "220",
      received_calls: 18,
      missed_calls: 1,
      outgoing_calls: 12,
      total_calls: 31,
    },
    {
      sNo: 5,
      date: "2025-02-01",
      talk_time: "160",
      received_calls: 14,
      missed_calls: 4,
      outgoing_calls: 9,
      total_calls: 27,
    },
   
  ]);
  
  // Search and Sort states for leads
  const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const [leadSortConfig, setLeadSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Search state for work report (date only)
  const [reportSearchTerm, setReportSearchTerm] = useState("");
  
  // Pagination states for leads
  const [currentLeadPage, setCurrentLeadPage] = useState(1);
  const [leadsPerPage] = useState(5);
  
  // Pagination states for work report
  const [currentReportPage, setCurrentReportPage] = useState(1);
  const [reportsPerPage] = useState(5);

  // Load User
  useEffect(() => {
    api
      .get(`/auth/${id}`)
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, [id]);

  useEffect(() => {
    api
      .get(`/api/leads/assigned-to/${id}`)
      .then((res) => {
        setLeads(Array.isArray(res.data.data) ? res.data.data : []);
        console.log(res.data.data); 
      })
      .catch(() => setLeads([]));
  }, [id]);

  // Search and Sort function for leads
  const filteredAndSortedLeads = useMemo(() => {
    let filteredLeads = leads.filter(lead => {
      const searchLower = leadSearchTerm.toLowerCase();
      return (
        (lead.customerName?.toLowerCase().includes(searchLower)) ||
        (lead.email?.toLowerCase().includes(searchLower)) ||
        (lead.mobile?.toString().includes(searchLower)) ||
        (lead.status?.toLowerCase().includes(searchLower)) ||
        (lead.sourceName?.toLowerCase().includes(searchLower)) ||
        (lead.priority?.toLowerCase().includes(searchLower))
      );
    });

    // Only sort by customerName
    if (leadSortConfig.key === 'customerName') {
      filteredLeads.sort((a, b) => {
        const aValue = a.customerName || '';
        const bValue = b.customerName || '';
        
        if (aValue < bValue) {
          return leadSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return leadSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredLeads;
  }, [leads, leadSearchTerm, leadSortConfig]);

  // Search function for work report (date only)
  const filteredReports = useMemo(() => {
    return workReport.filter(report => {
      return report.date.includes(reportSearchTerm);
    });
  }, [workReport, reportSearchTerm]);

  if (!user)
    return <div className="p-6 text-gray-600">Loading user details...</div>;

  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "?";

  // Pagination logic for leads
  const indexOfLastLead = currentLeadPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredAndSortedLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalLeadPages = Math.ceil(filteredAndSortedLeads.length / leadsPerPage);

  // Pagination logic for work report
  const indexOfLastReport = currentReportPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalReportPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Sort request function for leads (customer name only)
  const requestLeadSort = (key) => {
    let direction = 'asc';
    if (leadSortConfig.key === key && leadSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setLeadSortConfig({ key, direction });
    setCurrentLeadPage(1); // Reset to first page when sorting
  };

  // Sort indicator component
  const SortIndicator = ({ sortKey, currentSortConfig }) => {
    if (currentSortConfig.key !== sortKey) {
      return <ChevronUpDownIcon className="h-4 w-4 ml-1 inline" />;
    }
    return currentSortConfig.direction === 'asc' ? 
      <span className="ml-1">↑</span> : 
      <span className="ml-1">↓</span>;
  };

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, dataType }) => {
    const pageNumbers = [];
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50">
        <div className="text-sm text-gray-700 mb-2 sm:mb-0">
          Showing <span className="font-semibold">{startItem}-{endItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span> {dataType}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Agents</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            /{" "}
            <a href="/agents" className="text-blue-600 hover:underline">
              Agents
            </a>{" "}
            /{" "}
            <span className="font-semibold text-blue-700">{user.fullName}</span>
          </p>
        </div>
      </div>

      {/* TOP CARD */}
      <div className="w-full bg-white shadow-md rounded-xl p-6 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
            {initial}
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-gray-600 -mt-1">{user.role?.name}</p>

            <p className="text-gray-800 mt-1">
              <span className="font-semibold">Username:</span> {user.username}{" "}
              &nbsp;&nbsp;
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Mobile:</span>{" "}
              {user.assignedMobileNumber}
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Gender:</span>{" "}
              {user.gender || "N/A"}
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Address:</span> {user.address}
            </p>
          </div>
        </div>

        <div className="text-right text-gray-700 leading-6">
          <p>
            <span className="font-semibold">Assigned Under:</span>{" "}
            {user.assignedUnder?.fullName || "None"}
          </p>

          <p>
            <span className="font-semibold">Profile Image:</span>{" "}
            {user.profileImage || "N/A"}
          </p>
        </div>
      </div>

      {/* LEADS SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <h2 className="text-xl font-bold text-gray-800">Leads Assigned</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input for Leads */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={leadSearchTerm}
              onChange={(e) => {
                setLeadSearchTerm(e.target.value);
                setCurrentLeadPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="mt-4 bg-white shadow-md rounded-xl overflow-hidden mb-5">
        <div className="bg-blue-100 text-blue-900 font-semibold grid grid-cols-8 px-6 py-3">
          <div>S.No</div>
          <div className="flex items-center cursor-pointer" onClick={() => requestLeadSort('customerName')}>
            Customer Name
            <SortIndicator sortKey="customerName" currentSortConfig={leadSortConfig} />
          </div>
          <div>Status</div>
          <div>Mobile</div>
          <div>Email</div>
          <div>Source</div>
          <div>Priority</div>
          <div>Actions</div>
        </div>

        {currentLeads.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-600">
            {leadSearchTerm ? "No leads match your search criteria." : "Leads not assigned."}
          </div>
        ) : (
          currentLeads.map((lead, index) => {
            const globalIndex = (currentLeadPage - 1) * leadsPerPage + index;
            return (
              <div
                key={lead.id}
                className="grid grid-cols-8 px-6 py-4 items-center text-gray-800 border-t hover:bg-gray-50"
              >
                <div>{globalIndex + 1}</div>
                <div className="font-medium">{lead.customerName}</div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                    lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                <div>{lead.mobile}</div>
                <div>{lead.email}</div>
                <div>{lead.sourceName}</div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lead.priority === 'High' ? 'bg-red-100 text-red-800' :
                    lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {lead.priority}
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/leads/view/${lead.id}`)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
                  title="View"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => navigate(`/leads/edit/${lead.id}`)}
                  className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 p-1 rounded"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this lead?")) {
                      alert("Delete functionality would be implemented here");
                    }
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            );
          })
        )}
        
        {/* Leads Pagination */}
        {filteredAndSortedLeads.length > leadsPerPage && (
          <Pagination
            currentPage={currentLeadPage}
            totalPages={totalLeadPages}
            onPageChange={setCurrentLeadPage}
            itemsPerPage={leadsPerPage}
            totalItems={filteredAndSortedLeads.length}
            dataType="leads"
          />
        )}
      </div>

      {/* WORK REPORT SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <h2 className="text-xl font-bold text-gray-800">Work Report</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input for Work Report (Date only) */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by date (YYYY-MM-DD)..."
              value={reportSearchTerm}
              onChange={(e) => {
                setReportSearchTerm(e.target.value);
                setCurrentReportPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white shadow-md rounded-xl overflow-hidden">
        <div className="bg-blue-100 text-blue-900 font-semibold grid grid-cols-8 px-6 py-3">
          <div>S.No</div>
          <div>Date</div>
          <div>Talk Time</div>
          <div>Received Calls</div>
          <div>Missed Calls</div>
          <div>Outgoing Calls</div>
          <div>Total Calls</div>
          <div>Attendance</div>
        </div>

        {currentReports.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-600">
            {reportSearchTerm ? "No reports match your date search." : "No work reports available."}
          </div>
        ) : (
          currentReports.map((item, index) => {
            const globalIndex = (currentReportPage - 1) * reportsPerPage + index;
            return (
              <div
                key={item.sNo}
                className="grid grid-cols-8 px-6 py-4 items-center text-gray-800 border-t hover:bg-gray-50"
              >
                <div className="font-medium">{globalIndex + 1}</div>
                <div className="font-medium">{item.date}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    parseInt(item.talk_time) > 180 ? 'bg-green-100 text-green-800 font-medium' :
                    parseInt(item.talk_time) > 120 ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.talk_time} mins
                  </span>
                </div>
                <div>{item.received_calls}</div>
                <div>{item.missed_calls}</div>
                <div>{item.outgoing_calls}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    item.total_calls > 25 ? 'bg-green-100 text-green-800 font-medium' :
                    item.total_calls > 15 ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.total_calls}
                  </span>
                </div>
                <div>
                  {parseInt(item.talk_time) > 150 ? (
                    <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
                      Present
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded-full">
                      Absent
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Work Report Pagination */}
        {filteredReports.length > reportsPerPage && (
          <Pagination
            currentPage={currentReportPage}
            totalPages={totalReportPages}
            onPageChange={setCurrentReportPage}
            itemsPerPage={reportsPerPage}
            totalItems={filteredReports.length}
            dataType="records"
          />
        )}
      </div>
    </div>
  );
};

export default UserViewPage;