"use client"

import { useState } from "react"
import { FileText, AlertTriangle, AlertCircle, Package, Users } from "lucide-react"
import Card from "../../components/dept/Card"

const Dashboard = () => {
  // This would come from an API in a real application
  const stats = {
    totalUsers: 125,
    totalTenders: 48,
    activeTenders: 12,
    totalClashes: 8,
    totalInventory: 356,
    resolvedIssues: 24,
    // Example data for charts
    tendersByMonth: [
      { month: "Jan", count: 5 },
      { month: "Feb", count: 8 },
      { month: "Mar", count: 12 },
      { month: "Apr", count: 7 },
      { month: "May", count: 16 },
    ],
    statusDistribution: {
      active: 12,
      completed: 25,
      pending: 11,
    },
    clashResolution: {
      resolved: 23,
      unresolved: 8,
    },
  }

  const [activeTab, setActiveTab] = useState("analytics")

  // Calculate percentage for pie chart
  const totalTenders =
    stats.statusDistribution.active + stats.statusDistribution.completed + stats.statusDistribution.pending

  const activePercentage = Math.round((stats.statusDistribution.active / totalTenders) * 100)
  const completedPercentage = Math.round((stats.statusDistribution.completed / totalTenders) * 100)
  const pendingPercentage = Math.round((stats.statusDistribution.pending / totalTenders) * 100)

  // For clash resolution pie chart
  const totalClashes = stats.clashResolution.resolved + stats.clashResolution.unresolved
  const resolvedPercentage = Math.round((stats.clashResolution.resolved / totalClashes) * 100)
  const unresolvedPercentage = Math.round((stats.clashResolution.unresolved / totalClashes) * 100)

  // Find max value for the bar chart
  const maxTenderCount = Math.max(...stats.tendersByMonth.map((item) => item.count))

  return (
    <div className="animate-fadeIn p-2 md:p-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Department Dashboard</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 flex w-full sm:w-auto">
          <button
            className={`px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300" : "text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-700"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "analytics" ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300" : "text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-700"}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card title="Total Users" value={stats.totalUsers} icon={<Users size={24} className="text-blue-500" />} />
          <Card
            title="Total Tenders"
            value={stats.totalTenders}
            icon={<FileText size={24} className="text-green-500" />}
          />
          <Card
            title="Active Tenders"
            value={stats.activeTenders}
            icon={<FileText size={24} className="text-yellow-500" />}
          />
          <Card
            title="Total Clashes"
            value={stats.totalClashes}
            icon={<AlertTriangle size={24} className="text-red-500" />}
          />
          <Card
            title="Total Items in Inventory"
            value={stats.totalInventory}
            icon={<Package size={24} className="text-purple-500" />}
          />
          <Card
            title="Resolved Issues"
            value={stats.resolvedIssues}
            icon={<AlertCircle size={24} className="text-teal-500" />}
          />
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Bar chart for tenders by month */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tenders by Month</h2>
            <div className="h-48 sm:h-64 flex items-end space-x-1 md:space-x-2">
              {stats.tendersByMonth.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-sky-500 dark:bg-sky-600 rounded-t-md transition-all duration-500 ease-out hover:bg-sky-600 dark:hover:bg-sky-700"
                    style={{ height: `${(item.count / maxTenderCount) * 100}%`, minHeight: "10%" }}
                  ></div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{item.month}</div>
                  <div className="text-xs sm:text-sm font-semibold dark:text-gray-300">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie chart for tender status distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tender Status Distribution</h2>
            <div className="flex justify-center mb-4">
              <svg width="150" height="150" viewBox="0 0 100 100" className="max-w-full">
                {/* Completed segment */}
                <circle
                  r="25"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="50"
                  strokeDasharray={`${completedPercentage} ${100 - completedPercentage}`}
                  transform="rotate(-90 50 50)"
                />
                {/* Active segment */}
                <circle
                  r="25"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke="#0ea5e9"
                  strokeWidth="50"
                  strokeDasharray={`${activePercentage} ${100 - activePercentage}`}
                  strokeDashoffset={`${-completedPercentage}`}
                  transform="rotate(-90 50 50)"
                />
                {/* Pending segment */}
                <circle
                  r="25"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="50"
                  strokeDasharray={`${pendingPercentage} ${100 - pendingPercentage}`}
                  strokeDashoffset={`${-(completedPercentage + activePercentage)}`}
                  transform="rotate(-90 50 50)"
                />
                {/* Inner white circle to create donut */}
                <circle r="15" cx="50" cy="50" fill="white" className="dark:fill-gray-800" />
              </svg>
            </div>
            <div className="flex flex-wrap justify-center space-x-2 sm:space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-sky-500 mr-2"></div>
                <span className="text-xs sm:text-sm dark:text-gray-300">Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-xs sm:text-sm dark:text-gray-300">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-xs sm:text-sm dark:text-gray-300">Pending</span>
              </div>
            </div>
          </div>

          {/* Clash Resolution Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Clash Resolution</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#f3f4f6" className="dark:fill-gray-700" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray={`${resolvedPercentage * 2.83} ${unresolvedPercentage * 2.83}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-500">{resolvedPercentage}%</span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Resolved</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <div className="mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-xs sm:text-sm dark:text-gray-300">
                      Resolved: {stats.clashResolution.resolved}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 mr-2"></div>
                    <span className="text-xs sm:text-sm dark:text-gray-300">
                      Unresolved: {stats.clashResolution.unresolved}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4 overflow-hidden">
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate dark:text-gray-300">New tender approved</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate dark:text-gray-300">Clash C002 reported</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate dark:text-gray-300">Issue #45 resolved</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate dark:text-gray-300">
                    New inventory items added
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

