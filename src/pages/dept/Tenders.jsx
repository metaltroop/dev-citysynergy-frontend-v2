"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Info, Trash2, Filter, RefreshCcw, FileText, Clock, MapPin, BarChart3 } from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"

const Tenders = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTender, setSelectedTender] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("tenderId")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("table")
  const [originPosition, setOriginPosition] = useState(null)

  // This would come from an API in a real application
  const tenders = [
    {
      tenderId: "T001",
      tenderCategory: "Road Repair",
      amount: 500000,
      status: { passed: true, hasClash: false, accepted: false, workInProgress: false, isCompleted: false },
      zone: "Zone 1",
      pincode: "110001",
      tenderDepartmentID: "D01",
      tenderDescription: "Repair of main road in central Delhi area",
      sanctionDate: "2024-01-15",
      apxStartDate: "2024-02-01",
      apxEndDate: "2024-03-01",
      acceptedStartDate: null,
      acceptedEndDate: null,
      duration: "30 days",
      locality: "Sector 45",
      localArea: "Central",
      city: "Delhi",
      isDeleted: false,
      lastEdited: "2024-02-10",
      createdAt: "2024-01-10",
      updatedAt: "2024-02-15",
    },
    {
      tenderId: "T002",
      tenderCategory: "Street Lighting",
      amount: 250000,
      status: { passed: true, hasClash: true, accepted: false, workInProgress: false, isCompleted: false },
      zone: "Zone 2",
      pincode: "110002",
      tenderDepartmentID: "D02",
      tenderDescription: "Installation of LED street lights in residential areas",
      sanctionDate: "2024-01-20",
      apxStartDate: "2024-02-15",
      apxEndDate: "2024-03-15",
      acceptedStartDate: null,
      acceptedEndDate: null,
      duration: "30 days",
      locality: "Sector 12",
      localArea: "North",
      city: "Delhi",
      isDeleted: false,
      lastEdited: "2024-02-05",
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10",
    },
    {
      tenderId: "T003",
      tenderCategory: "Sewage System",
      amount: 750000,
      status: { passed: true, hasClash: false, accepted: true, workInProgress: true, isCompleted: false },
      zone: "Zone 3",
      pincode: "110003",
      tenderDepartmentID: "D03",
      tenderDescription: "Upgrade of sewage system in commercial district",
      sanctionDate: "2024-01-10",
      apxStartDate: "2024-02-01",
      apxEndDate: "2024-04-01",
      acceptedStartDate: "2024-02-05",
      acceptedEndDate: "2024-04-05",
      duration: "60 days",
      locality: "Sector 18",
      localArea: "South",
      city: "Delhi",
      isDeleted: false,
      lastEdited: "2024-02-15",
      createdAt: "2024-01-05",
      updatedAt: "2024-02-20",
    },
  ]

  // Apply filters and sorting
  const filteredTenders = tenders
    .filter(
      (tender) =>
        tender.tenderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.tenderCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.pincode.includes(searchQuery),
    )
    .sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1

      if (sortBy === "tenderId") {
        return a.tenderId.localeCompare(b.tenderId) * factor
      } else if (sortBy === "tenderCategory") {
        return a.tenderCategory.localeCompare(b.tenderCategory) * factor
      } else if (sortBy === "amount") {
        return (a.amount - b.amount) * factor
      } else if (sortBy === "zone") {
        return a.zone.localeCompare(b.zone) * factor
      }

      return 0
    })

  const getStatusText = (status) => {
    if (status.isCompleted) return "Completed"
    if (status.workInProgress) return "In Progress"
    if (status.accepted) return "Accepted"
    if (status.hasClash) return "Has Clash"
    if (status.passed) return "Passed"
    return "Pending"
  }

  const getStatusColor = (status) => {
    if (status.isCompleted) return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
    if (status.workInProgress) return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
    if (status.accepted) return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
    if (status.hasClash) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
    if (status.passed) return "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-400"
    return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
  }

  const handleViewDetails = (tender, event) => {
    // Get the button's position for the animation
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const originPosition = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    }

    setSelectedTender(tender)
    setIsModalOpen(true)
    setOriginPosition(originPosition)
  }

  // Toggle sort order
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Calculate total amount
  const totalAmount = tenders.reduce((sum, tender) => sum + tender.amount, 0)

  // Count tenders by status
  const activeTenders = tenders.filter((tender) => tender.status.workInProgress || tender.status.accepted).length

  return (
    <div className="max-w-auto mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center text-gray-800 dark:text-white">
            <FileText className="mr-2 h-6 w-6 text-blue-500" />
            Tender Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage municipal tenders and projects</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/dashboard/dept/tenders/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tender
          </Button>
        </div>
      </div>

      {/* Tender Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tenders</div>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{tenders.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current fiscal year</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Tenders</div>
            <Clock className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{activeTenders}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">In progress or accepted</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Zones Covered</div>
            <MapPin className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">3</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Municipal zones</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Budget</div>
            <BarChart3 className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            ₹{(totalAmount / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allocated funding</div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "card"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Card View
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tenders..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Sort & Filter
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Sort Tenders</h3>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="tenderId">Tender ID</option>
                      <option value="tenderCategory">Category</option>
                      <option value="amount">Amount</option>
                      <option value="zone">Zone</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        setSortBy("tenderId")
                        setSortOrder("asc")
                      }}
                      className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => handleSort("tenderId")}
                  >
                    Tender ID {sortBy === "tenderId" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => handleSort("tenderCategory")}
                  >
                    Category {sortBy === "tenderCategory" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => handleSort("amount")}
                  >
                    Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => handleSort("zone")}
                  >
                    Zone {sortBy === "zone" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Pincode
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTenders.map((tender) => (
                  <tr key={tender.tenderId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{tender.tenderId}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Created {tender.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{tender.tenderCategory}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      ₹{tender.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(tender.status)}`}>
                        {getStatusText(tender.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{tender.zone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{tender.pincode}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(event) => handleViewDetails(tender, event)}
                          className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenders.map((tender) => (
              <div
                key={tender.tenderId}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 dark:text-white">{tender.tenderCategory}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-md mt-1 inline-block">
                        {tender.tenderId}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(event) => handleViewDetails(tender, event)}
                        className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm mb-4 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {tender.tenderDescription}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Amount</div>
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        ₹{(tender.amount / 100000).toFixed(1)}L
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                      <div className={`font-medium ${getStatusColor(tender.status)}`}>
                        {getStatusText(tender.status)}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                      <div className="font-medium text-amber-600 dark:text-amber-400">{tender.duration}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <div>
                      {tender.zone}, {tender.city}
                    </div>
                    <div>Created {tender.createdAt}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTenders.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <RefreshCcw className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium dark:text-gray-400">No tenders found</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredTenders.length} of {tenders.length} tenders
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tender Details"
        originPosition={originPosition}
      >
        {selectedTender && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tender ID</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.tenderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.tenderCategory}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</p>
                <p className="mt-1 text-gray-900 dark:text-white">₹{selectedTender.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTender.status)}`}>
                    {getStatusText(selectedTender.status)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Zone</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.zone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pincode</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.pincode}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
              <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.tenderDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sanction Date</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.sanctionDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.duration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.apxStartDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.apxEndDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Locality</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.locality}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Local Area</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.localArea}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTender.city}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Tenders

