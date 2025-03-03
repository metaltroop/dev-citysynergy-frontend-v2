// src/pages/InventoryRequests.jsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Check, X, Package, Filter } from "lucide-react"
import Button from "../../components/dept/Button"

// Dummy data for inventory requests
const inventoryRequests = [
  {
    requestId: "R001",
    itemId: "I002",
    itemName: "Traffic Cones",
    fromDept: "D02",
    fromDeptName: "Electricity Department",
    forDept: "D01",
    forDeptName: "Roads Department",
    requestStatus: "pending",
    quantity: 15,
    requestDate: "2024-03-18",
    isDeleted: false,
    lastUpdatedBy: "user4@example.com",
  },
  {
    requestId: "R002",
    itemId: "I001",
    itemName: "Concrete Mixer",
    fromDept: "D03",
    fromDeptName: "Water Department",
    forDept: "D01",
    forDeptName: "Roads Department",
    requestStatus: "accepted",
    quantity: 1,
    requestDate: "2024-03-15",
    isDeleted: false,
    lastUpdatedBy: "user1@example.com",
  },
  {
    requestId: "R003",
    itemId: "I005",
    itemName: "Surveying Equipment",
    fromDept: "D04",
    fromDeptName: "Sewage Department",
    forDept: "D01",
    forDeptName: "Roads Department",
    requestStatus: "rejected",
    quantity: 2,
    requestDate: "2024-03-14",
    isDeleted: false,
    lastUpdatedBy: "user2@example.com",
  },
  {
    requestId: "R004",
    itemId: "I004",
    itemName: "Safety Helmets",
    fromDept: "D05",
    fromDeptName: "Parks Department",
    forDept: "D01",
    forDeptName: "Roads Department",
    requestStatus: "pending",
    quantity: 10,
    requestDate: "2024-03-19",
    isDeleted: false,
    lastUpdatedBy: "user5@example.com",
  },
]

const InventoryRequests = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState("all") // all, pending, accepted, rejected
  const [viewMode, setViewMode] = useState("table")

  // Filter requests based on status
  const filteredRequests = inventoryRequests.filter((request) => {
    if (statusFilter === "all") return true
    return request.requestStatus === statusFilter
  })

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
      case "accepted":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
      case "rejected":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
    }
  }

  const handleAcceptRequest = (requestId) => {
    console.log("Accepting request:", requestId)
    // In a real app, you would send this to an API
  }

  const handleRejectRequest = (requestId) => {
    console.log("Rejecting request:", requestId)
    // In a real app, you would send this to an API
  }

  return (
    <div className="max-w-auto mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
         onClick={() => navigate("/dashboard/dept/inventory")}
          className="p-2 mr-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Resource Requests</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                statusFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                statusFilter === "pending"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("accepted")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                statusFilter === "accepted"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                statusFilter === "rejected"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="flex justify-center sm:justify-end">
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 flex-1 ${viewMode === "table" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
              >
                <Filter size={20} className="mx-auto" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 flex-1 ${viewMode === "card" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
              >
                <Package size={20} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Request ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Item
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    From Department
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Quantity
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request) => (
                  <tr key={request.requestId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {request.requestId}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div>{request.itemName}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{request.itemId}</div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div>{request.fromDeptName}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{request.fromDept}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {request.quantity}
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-md ${getStatusBadgeClass(request.requestStatus)}`}>
                        {request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {request.requestDate}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        {request.requestStatus === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleAcceptRequest(request.requestId)}>
                              <Check className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Accept</span>
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleRejectRequest(request.requestId)}>
                              <X className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Reject</span>
                            </Button>
                          </>
                        )}
                        {request.requestStatus !== "pending" && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {request.requestStatus === "accepted" ? "Accepted" : "Rejected"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <div
                key={request.requestId}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                  <div>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-md inline-block">
                      {request.requestId}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-md ${getStatusBadgeClass(request.requestStatus)}`}>
                    {request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)}
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{request.itemName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{request.itemId}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">From Department</p>
                      <p className="font-medium text-gray-900 dark:text-white">{request.fromDeptName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                      <p className="font-medium text-gray-900 dark:text-white">{request.quantity}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Requested on: {request.requestDate}
                  </div>

                  {request.requestStatus === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAcceptRequest(request.requestId)}>
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        onClick={() => handleRejectRequest(request.requestId)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRequests.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium dark:text-gray-300">No requests found</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">There are no resource requests matching your filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InventoryRequests

