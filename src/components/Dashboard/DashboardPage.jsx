// src/components/Dashboard/DashboardPage.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const DashboardPage = () => {
  // Dummy data
  const salesData = [
    { month: "Jan", sales: 4200 },
    { month: "Feb", sales: 4800 },
    { month: "Mar", sales: 5300 },
    { month: "Apr", sales: 6000 },
    { month: "May", sales: 7200 },
    { month: "Jun", sales: 6900 },
    { month: "Jul", sales: 8000 },
  ];

  const customerData = [
    { name: "Premium", value: 60 },
    { name: "Standard", value: 30 },
    { name: "Inactive", value: 10 },
  ];

  const agentData = [
    { agent: "John Smith", leads: 24, conversions: 18 },
    { agent: "Sarah Johnson", leads: 20, conversions: 16 },
    { agent: "Mike Chen", leads: 15, conversions: 10 },
    { agent: "Emily Davis", leads: 30, conversions: 25 },
    { agent: "David Lee", leads: 18, conversions: 14 },
  ];

  const COLORS = ["#2563eb", "#60a5fa", "#93c5fd"];

  // Detect current theme (for dynamic chart styling)
  const isDark = document.documentElement.classList.contains("dark");
  const axisColor = isDark ? "#d1d5db" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const textColor = isDark ? "#f3f4f6" : "#111827";
  const tooltipStyle = {
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
    color: textColor,
    borderRadius: "8px",
    padding: "8px 10px",
  };

  return (
    <div className="space-y-8 min-h-screen overflow-y-auto pb-10">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Dashboard Overview
      </h2>

      {/* Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Leads", value: "15" },
          { title: "Customers", value: "1,234" },
          { title: "Total Revenue", value: "$45.6K" },
          { title: "Lead Conversion", value: "89%" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-blue-600 dark:bg-blue-700 text-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: textColor }} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Customer Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {customerData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: textColor }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ color: textColor }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Agent Performance
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={agentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="agent" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: textColor }} />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="leads" fill="#60a5fa" name="Leads Generated" />
            <Bar dataKey="conversions" fill="#2563eb" name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
