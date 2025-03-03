"use client"

import { useState } from "react"
import { Search, Settings, Shield, Lock, LayoutGrid, List } from "lucide-react"
import SearchBar from "../../components/dev/SearchBar"

const dummyFeatures = [
  { 
    id: 1, 
    name: "User Management", 
    description: "Manage system users",
    status: "active",
    roles: 4,
    lastUpdated: "2024-03-15"
  },
  { 
    id: 2, 
    name: "Department Control", 
    description: "Control department settings",
    status: "active",
    roles: 3,
    lastUpdated: "2024-03-14"
  },
  // Add more features as needed
]

export default function Features() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("table")

  const filteredFeatures = dummyFeatures.filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const totalFeatures = dummyFeatures.length
  const activeFeatures = dummyFeatures.filter(f => f.status === "active").length
  const totalRoles = dummyFeatures.reduce((sum, f) => sum + f.roles, 0)

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-gray-900">
      {/* Header */}
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

      {/* Search and View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchBar 
              onSearch={setSearchTerm} 
              placeholder="Search features..." 
              className="w-full"
            />
          </div>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${viewMode === "table" 
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 ${viewMode === "card" 
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
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
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        feature.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      feature.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
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

        {/* Pagination */}
        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredFeatures.length} of {dummyFeatures.length} features
          </div>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 rounded border bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed">
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

