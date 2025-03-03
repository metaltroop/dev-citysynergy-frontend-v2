// src/pages/InventoryAsk.jsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ArrowLeft, Package, HelpCircle } from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"


// Dummy data for all departments' inventory items
const allDepartmentsInventory = [
  {
    itemId: "I101",
    itemName: "Heavy Duty Excavator",
    itemCategory: "Construction Equipment",
    deptID: "D02",
    isSharable: true,
    totalItems: 3,
    availableItems: 2,
    isDeleted: false,
    lastUpdatedBy: "user5@example.com",
    lastUpdated: "2024-03-10",
  },
  {
    itemId: "I102",
    itemName: "Portable Generator",
    itemCategory: "Power Equipment",
    deptID: "D02",
    isSharable: true,
    totalItems: 8,
    availableItems: 5,
    isDeleted: false,
    lastUpdatedBy: "user5@example.com",
    lastUpdated: "2024-03-12",
  },
  {
    itemId: "I201",
    itemName: "High Voltage Tester",
    itemCategory: "Measurement Tools",
    deptID: "D03",
    isSharable: true,
    totalItems: 10,
    availableItems: 7,
    isDeleted: false,
    lastUpdatedBy: "user6@example.com",
    lastUpdated: "2024-03-15",
  },
  {
    itemId: "I202",
    itemName: "Electrical Safety Gear",
    itemCategory: "Safety Equipment",
    deptID: "D03",
    isSharable: true,
    totalItems: 25,
    availableItems: 20,
    isDeleted: false,
    lastUpdatedBy: "user6@example.com",
    lastUpdated: "2024-03-14",
  },
  {
    itemId: "I301",
    itemName: "Water Quality Test Kit",
    itemCategory: "Measurement Tools",
    deptID: "D04",
    isSharable: true,
    totalItems: 15,
    availableItems: 12,
    isDeleted: false,
    lastUpdatedBy: "user7@example.com",
    lastUpdated: "2024-03-16",
  },
]

const InventoryAsk = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [requestQuantity, setRequestQuantity] = useState(1)
  const [originPosition, setOriginPosition] = useState(null)

  // Get unique categories from all departments' inventory
  const categories = [...new Set(allDepartmentsInventory.map((item) => item.itemCategory))]

  // Filter items based on search and category
  const filteredItems = allDepartmentsInventory.filter((item) => {
    // Don't show items from current department (D01)
    if (item.deptID === "D01") return false

    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || item.itemCategory === selectedCategory

    return matchesSearch && matchesCategory && item.isSharable
  })

  const handleAskHelp = (item, event) => {
    // Get the button's position for the animation
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const originPosition = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    }

    setSelectedItem(item)
    setRequestQuantity(1)
    setIsRequestModalOpen(true)
    setOriginPosition(originPosition)
  }

  const handleSubmitRequest = () => {
    console.log("Submitting request for item:", selectedItem, "Quantity:", requestQuantity)
    // In a real app, you would send this to an API
    setIsRequestModalOpen(false)

    // Show success message or redirect
    navigate("/dashboard/dept/inventory")
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ask for Resources</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Find Resources from Other Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-9 text-gray-400" size={18} />
            </div>
          </div>
          <Button className="w-full sm:w-auto mt-4">Find Resources</Button>
        </div>

        <div className="mt-8">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Available Resources</h3>

          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Item ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Name
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Category
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Department
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Available
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredItems.map((item) => (
                    <tr key={item.itemId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {item.itemId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.itemName}</td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {item.itemCategory}
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {item.deptID}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {item.availableItems}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex justify-end">
                          <Button size="sm" onClick={(event) => handleAskHelp(item, event)}>
                            <HelpCircle className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Ask Help</span>
                            <span className="sm:hidden">Ask</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No resources found matching your criteria</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Resource"
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
                Quantity Needed
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
              <Button type="button" variant="secondary" onClick={() => setIsRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitRequest}
                disabled={requestQuantity < 1 || requestQuantity > selectedItem.availableItems}
              >
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default InventoryAsk

