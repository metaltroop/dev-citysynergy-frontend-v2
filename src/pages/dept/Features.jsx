"use client"

import { useState } from "react"
import { Search, Settings, Shield, Lock, LayoutGrid, List } from "lucide-react"

const Features = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table")

  // This would come from an API in a real application
  const features = [
    {
      id: 1,
      name: "Dashboard",
      description: "View and manage dashboard analytics",
      status: "active",
      roles: 5,
      lastUpdated: "2024-03-15",
    },
    {
      id: 2,
      name: "Tenders",
      description: "Manage tender operations and workflows",
      status: "active",
      roles: 3,
      lastUpdated: "2024-03-14",
    },
    {
      id: 3,
      name: "Clashes",
      description: "Handle department work clashes",
      status: "active",
      roles: 4,
      lastUpdated: "2024-03-13",
    },
    {
      id: 4,
      name: "Issues",
      description: "Track and resolve department issues",
      status: "active",
      roles: 3,
      lastUpdated: "2024-03-12",
    },
    {
      id: 5,
      name: "Inventory",
      description: "Manage department inventory",
      status: "active",
      roles: 4,
      lastUpdated: "2024-03-11",
    },
  ]

  const filteredFeatures = features.filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate stats
  const totalFeatures = features.length
  const activeFeatures = features.filter((feature) => feature.status === "active").length
  const totalRoles = features.reduce((sum, feature) => sum + feature.roles, 0)

  return (
    <div className="max-w-auto mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center text-gray-800 dark:text-white">
            <Settings className="mr-2 h-6 w-6 text-blue-500" />
            Feature Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Configure system features and access</p>
        </div>
      </div>

      {/* Feature Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Features</div>
            <Settings className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{totalFeatures}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">System features</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Features</div>
            <Lock className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{activeFeatures}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Currently enabled</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Role Assignments</div>
            <Shield className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{totalRoles}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Total role assignments</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search features..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${viewMode === "table" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 ${viewMode === "card" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Feature Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Roles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFeatures.map((feature) => (
                  <tr key={feature.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{feature.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Last updated {feature.lastUpdated}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300">{feature.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          feature.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{feature.roles}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 dark:text-white">{feature.name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated {feature.lastUpdated}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        feature.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>

                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Roles: </span>
                    <span className="font-medium text-gray-900 dark:text-white">{feature.roles}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredFeatures.length} of {features.length} features
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 rounded border bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded border bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              1
            </button>
            <button className="px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features

