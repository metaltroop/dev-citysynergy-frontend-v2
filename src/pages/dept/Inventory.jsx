// src/pages/Inventory.jsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Plus,
  Share2,
  Trash2,
  RefreshCcw,
  Package,
  BarChart3,
  Clock,
  Users,
  FileText,
  LayoutGrid,
  List,
} from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"

// Dummy data for inventory items
const inventoryItems = [
  {
    itemId: "I001",
    itemName: "Concrete Mixer",
    itemCategory: "Construction Equipment",
    deptID: "D01",
    isSharable: true,
    totalItems: 5,
    availableItems: 3,
    isDeleted: false,
    lastUpdatedBy: "user1@example.com",
    lastUpdated: "2024-03-15",
  },
  {
    itemId: "I002",
    itemName: "Traffic Cones",
    itemCategory: "Safety Equipment",
    deptID: "D01",
    isSharable: true,
    totalItems: 50,
    availableItems: 35,
    isDeleted: false,
    lastUpdatedBy: "user2@example.com",
    lastUpdated: "2024-03-10",
  },
  {
    itemId: "I003",
    itemName: "Road Roller",
    itemCategory: "Construction Equipment",
    deptID: "D01",
    isSharable: false,
    totalItems: 2,
    availableItems: 1,
    isDeleted: false,
    lastUpdatedBy: "user1@example.com",
    lastUpdated: "2024-03-05",
  },
  {
    itemId: "I004",
    itemName: "Safety Helmets",
    itemCategory: "Safety Equipment",
    deptID: "D01",
    isSharable: true,
    totalItems: 100,
    availableItems: 75,
    isDeleted: false,
    lastUpdatedBy: "user3@example.com",
    lastUpdated: "2024-03-12",
  },
  {
    itemId: "I005",
    itemName: "Surveying Equipment",
    itemCategory: "Measurement Tools",
    deptID: "D01",
    isSharable: true,
    totalItems: 10,
    availableItems: 8,
    isDeleted: false,
    lastUpdatedBy: "user2@example.com",
    lastUpdated: "2024-03-08",
  },
]

// Dummy data for inventory requests
const inventoryRequests = [
  {
    requestId: "R001",
    itemId: "I002",
    itemName: "Traffic Cones",
    fromDept: "D02",
    forDept: "D01",
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
    forDept: "D01",
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
    forDept: "D01",
    requestStatus: "rejected",
    quantity: 2,
    requestDate: "2024-03-14",
    isDeleted: false,
    lastUpdatedBy: "user2@example.com",
  },
]

const Inventory = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table")
  const [filterType, setFilterType] = useState("all") // all, full, shared
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [requestQuantity, setRequestQuantity] = useState(1)
  const [originPosition, setOriginPosition] = useState(null)

  // Form state for creating new resource
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemCategory: "",
    isSharable: false,
    totalItems: 1,
  })

  // Filter inventory items based on search and filter type
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === "all") return matchesSearch
    if (filterType === "shared") return matchesSearch && item.isSharable
    if (filterType === "full") return matchesSearch && item.availableItems === item.totalItems

    return matchesSearch
  })

  // Calculate inventory stats
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.totalItems, 0)
  const availableItems = inventoryItems.reduce((sum, item) => sum + item.availableItems, 0)
  const sharedItems = inventoryItems.filter((item) => item.isSharable).length
  const pendingRequests = inventoryRequests.filter((req) => req.requestStatus === "pending").length

  const handleCreateItem = (e) => {
    e.preventDefault()
    console.log("Creating new item:", newItem)
    // In a real app, you would send this to an API
    setIsCreateModalOpen(false)
    // Reset form
    setNewItem({
      itemName: "",
      itemCategory: "",
      isSharable: false,
      totalItems: 1,
    })
  }

  const handleShareItem = (item, event) => {
    // Get the button's position for the animation
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const originPosition = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    }

    setSelectedItem(item)
    setRequestQuantity(1)
    setIsShareModalOpen(true)
    setOriginPosition(originPosition)
  }

  const handleSubmitRequest = () => {
    console.log("Submitting request for item:", selectedItem, "Quantity:", requestQuantity)
    // In a real app, you would send this to an API
    setIsShareModalOpen(false)
  }

  return (
    <div className="max-w-auto mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Package className="mr-2 h-6 w-6 text-blue-500" />
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage department resources and equipment</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/dashboard/dept/inventory/requests")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Requests</span>{" "}
            {pendingRequests > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{pendingRequests}</span>
            )}
          </button>
          <button
            onClick={() => navigate("/dashboard/dept/inventory/ask")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Ask Resource</span>
            <span className="sm:hidden">Ask</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Resource</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Resources</div>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{totalItems}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Items in inventory</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Available</div>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{availableItems}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Ready for use</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Shared Resources</div>
            <Share2 className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{sharedItems}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Available for sharing</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending Requests</div>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{pendingRequests}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Awaiting response</div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                filterType === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("shared")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                filterType === "shared"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Shared
            </button>
            <button
              onClick={() => setFilterType("full")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                filterType === "full"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Full
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 flex-1 ${viewMode === "table" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
              >
                <List size={20} className="mx-auto" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 flex-1 ${viewMode === "card" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
              >
                <LayoutGrid size={20} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Item ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Sharable
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item) => (
                  <tr key={item.itemId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{item.itemId}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Updated {item.lastUpdated}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.itemName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.itemCategory}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {item.availableItems}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.totalItems}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${item.isSharable ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"}`}
                      >
                        {item.isSharable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {item.isSharable && (
                          <button
                            onClick={(event) => handleShareItem(item, event)}
                            className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        )}
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
            {filteredItems.map((item) => (
              <div
                key={item.itemId}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg dark:text-white">{item.itemName}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-md mt-1 inline-block">
                        {item.itemId}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {item.isSharable && (
                        <button
                          onClick={(event) => handleShareItem(item, event)}
                          className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm mb-4 text-gray-600 dark:text-gray-300">{item.itemCategory}</div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Available</div>
                      <div className="font-medium text-blue-600 dark:text-blue-400">{item.availableItems}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                      <div className="font-medium text-gray-600 dark:text-gray-300">{item.totalItems}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Sharable</div>
                      <div
                        className={`font-medium ${item.isSharable ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300"}`}
                      >
                        {item.isSharable ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <div>Dept: {item.deptID}</div>
                    <div>Updated: {item.lastUpdated}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <RefreshCcw className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium dark:text-gray-300">No items found</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredItems.length} of {inventoryItems.length} items
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

      {/* Create Resource Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Resource">
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Item Name*
            </label>
            <input
              type="text"
              id="itemName"
              value={newItem.itemName}
              onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category*
            </label>
            <select
              id="itemCategory"
              value={newItem.itemCategory}
              onChange={(e) => setNewItem({ ...newItem, itemCategory: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              <option value="Construction Equipment">Construction Equipment</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Measurement Tools">Measurement Tools</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Vehicles">Vehicles</option>
            </select>
          </div>

          <div>
            <label htmlFor="totalItems" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Items*
            </label>
            <input
              type="number"
              id="totalItems"
              min="1"
              value={newItem.totalItems}
              onChange={(e) => setNewItem({ ...newItem, totalItems: Number.parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSharable"
              checked={newItem.isSharable}
              onChange={(e) => setNewItem({ ...newItem, isSharable: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isSharable" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Available for sharing with other departments
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Resource</Button>
          </div>
        </form>
      </Modal>

      {/* Share Resource Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Resource"
        originPosition={originPosition}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{selectedItem.itemName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedItem.itemCategory}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  {selectedItem.itemId}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedItem.availableItems} of {selectedItem.totalItems}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedItem.deptID}</p>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="requestQuantity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Quantity to Share
              </label>
              <input
                type="number"
                id="requestQuantity"
                min="1"
                max={selectedItem.availableItems}
                value={requestQuantity}
                onChange={(e) => setRequestQuantity(Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum available: {selectedItem.availableItems}
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsShareModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitRequest}
                disabled={requestQuantity < 1 || requestQuantity > selectedItem.availableItems}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Resource
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Inventory

