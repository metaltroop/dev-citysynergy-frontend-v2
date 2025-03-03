"use client"

import { useState } from "react"
import { Search, Info, AlertCircle, CheckCircle, Clock, LayoutGrid, List, Filter, BarChart3 } from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"

const Issues = () => {
  const [category, setCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("table") // 'table', 'card'
  const [originPosition, setOriginPosition] = useState(null)
  const [openDropdownId, setOpenDropdownId] = useState(null) // Track which dropdown is open

  // This would come from an API in a real application
  const issues = [
    {
      issueId: "I001",
      issueName: "Street Light Not Working",
      issueStatus: "raised",
      raisedBy: "user1@example.com",
      description:
        "The street lights in Sector 45 are not working for the past week. This is causing safety concerns for residents during night time.",
      category: "Electricity",
      location: "Sector 45, Central Delhi",
      raisedOn: "2024-03-01",
    },
    {
      issueId: "I002",
      issueName: "Pothole on Main Road",
      issueStatus: "inReview",
      raisedBy: "user2@example.com",
      description: "Large pothole on the main road near the market area. Several vehicles have been damaged.",
      category: "Roads",
      location: "Market Road, Sector 12",
      raisedOn: "2024-03-05",
    },
    {
      issueId: "I003",
      issueName: "Water Supply Disruption",
      issueStatus: "accepted",
      raisedBy: "user3@example.com",
      description: "No water supply in our area for the last 2 days. Urgent resolution required.",
      category: "Water",
      location: "Residential Block A, Sector 18",
      raisedOn: "2024-03-08",
    },
    {
      issueId: "I004",
      issueName: "Garbage Collection Issue",
      issueStatus: "pending",
      raisedBy: "user4@example.com",
      description: "Garbage has not been collected for a week. The area is becoming unhygienic.",
      category: "Sanitation",
      location: "Commercial Area, Sector 22",
      raisedOn: "2024-03-10",
    },
    {
      issueId: "I005",
      issueName: "Traffic Signal Malfunction",
      issueStatus: "working",
      raisedBy: "user5@example.com",
      description: "Traffic signal at the main intersection is not functioning properly, causing traffic jams.",
      category: "Traffic",
      location: "Main Crossing, Sector 30",
      raisedOn: "2024-03-12",
    },
    {
      issueId: "I006",
      issueName: "Park Maintenance Required",
      issueStatus: "resolved",
      raisedBy: "user6@example.com",
      description: "The community park needs maintenance. Broken benches and overgrown grass.",
      category: "Parks",
      location: "Community Park, Sector 15",
      raisedOn: "2024-03-15",
      resolvedOn: "2024-03-25",
    },
  ]

  const categories = [...new Set(issues.map((issue) => issue.category))]

  const filteredIssues = issues.filter((issue) => {
    const matchesCategory = !category || issue.category === category
    const matchesSearch =
      !searchQuery ||
      issue.issueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.issueName.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "raised":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "inReview":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "accepted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "working":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "raised":
        return <AlertCircle className="h-4 w-4" />
      case "inReview":
        return <Search className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "working":
        return <BarChart3 className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "raised":
        return "Raised"
      case "inReview":
        return "In Review"
      case "accepted":
        return "Accepted"
      case "pending":
        return "Pending"
      case "working":
        return "Working"
      case "resolved":
        return "Resolved"
      default:
        return status
    }
  }

  const handleStatusChange = (issueId, newStatus) => {
    // In a real app, you would update this via API
    console.log(`Updating issue ${issueId} status to ${newStatus}`)
    // Close dropdown after selection
    setOpenDropdownId(null)
  }

  const handleViewDetails = (issue, event) => {
    // Get the button's position for the animation
    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect()
      const originPosition = {
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
      }
      setOriginPosition(originPosition)
    }

    setSelectedIssue(issue)
    setIsModalOpen(true)
  }

  const toggleDropdown = (issueId) => {
    if (openDropdownId === issueId) {
      setOpenDropdownId(null)
    } else {
      setOpenDropdownId(issueId)
    }
  }

  // Enhanced Custom Dropdown for Status
  const StatusDropdown = ({ issue }) => {
    const isOpen = openDropdownId === issue.issueId
    
    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(issue.issueId)}
          className={`px-2 py-1 text-sm rounded flex items-center justify-between w-32 ${getStatusBadgeClass(issue.issueStatus)}`}
        >
          <span className="flex items-center">
            {getStatusIcon(issue.issueStatus)}
            <span className="ml-1">{getStatusLabel(issue.issueStatus)}</span>
          </span>
          <svg 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
  <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
    <div className="py-1">
      {["raised", "inReview", "accepted", "pending", "working", "resolved"].map((status) => (
        <button
          key={status}
          onClick={() => handleStatusChange(issue.issueId, status)}
          className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 
            ${issue.issueStatus === status ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
        >
          <span className={`flex items-center rounded-full p-1 mr-2 ${getStatusBadgeClass(status)}`}>
            {getStatusIcon(status)}
          </span>
          {getStatusLabel(status)}
          {issue.issueStatus === status && (
            <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
          )}
        </button>
      ))}
    </div>
  </div>
)}
      </div>
    )
  }

  // Calculate stats
  const totalIssues = issues.length
  const resolvedIssues = issues.filter((issue) => issue.issueStatus === "resolved").length
  const pendingIssues = issues.filter((issue) => issue.issueStatus !== "resolved").length
  const criticalIssues = issues.filter((issue) => issue.issueStatus === "raised").length

  return (
    <div className="max-w-auto mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center text-gray-800 dark:text-white">
            <AlertCircle className="mr-2 h-6 w-6 text-orange-500" />
            Issues Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track and resolve department issues</p>
        </div>
      </div>

      {/* Issues Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Issues</div>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{totalIssues}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Reported problems</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Resolved</div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{resolvedIssues}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Successfully fixed</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</div>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{pendingIssues}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">In progress</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Critical</div>
            <BarChart3 className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{criticalIssues}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Urgent attention needed</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full md:w-1/3">
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search issues..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Issue ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Issue Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Raised By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredIssues.map((issue) => (
                  <tr key={issue.issueId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {issue.issueId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {issue.issueName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusDropdown issue={issue} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {issue.raisedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {issue.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(event) => handleViewDetails(issue, event)}
                          className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                          <Info size={18} />
                        </button>
                        <Button size="sm">Save</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No issues found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue.issueId}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 dark:text-white">{issue.issueName}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-md mt-1 inline-block">
                        {issue.issueId}
                      </span>
                    </div>
                    <div className="relative">
                      <StatusDropdown issue={issue} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm mb-4 text-gray-600 dark:text-gray-300 line-clamp-2">{issue.description}</div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                      <div className="font-medium text-gray-900 dark:text-white">{issue.category}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Raised On</div>
                      <div className="font-medium text-gray-900 dark:text-white">{issue.raisedOn}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <div>{issue.location}</div>
                    <button
                      onClick={(event) => handleViewDetails(issue, event)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredIssues.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">No issues found</div>
            )}
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredIssues.length} of {issues.length} issues
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
        title="Issue Details"
        originPosition={originPosition}
      >
        {selectedIssue && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Issue ID</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedIssue.issueId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="mt-1">
                  <StatusDropdown issue={selectedIssue} />
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedIssue.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Raised On</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedIssue.raisedOn}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Raised By</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedIssue.raisedBy}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedIssue.location}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
              <p className="mt-1 text-gray-900 dark:text-white">{selectedIssue.description}</p>
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

export default Issues