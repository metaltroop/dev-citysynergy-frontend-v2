"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import SearchBar from "../../components/dev/SearchBar"
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Filter, 
  MoreVertical,
  RefreshCcw,
  Users,
  Calendar,
  BarChart3
} from "lucide-react"
import Button from "../../components/dept/Button"

// Extended dummy data with more information
const dummyDepartments = [
  { 
    id: "DEPT001", 
    name: "Engineering", 
    code: "ENG", 
    head: "John Doe", 
    headEmail: "john.doe@example.com",
    employeeCount: 42,
    projects: 8,
    budget: "$2.4M",
    status: "active",
    createdAt: "Jan 15, 2024"
  },
  { 
    id: "DEPT002", 
    name: "Marketing", 
    code: "MKT", 
    head: "Jane Smith", 
    headEmail: "jane.smith@example.com",
    employeeCount: 18,
    projects: 5,
    budget: "$1.2M",
    status: "active",
    createdAt: "Feb 3, 2024"
  },
  { 
    id: "DEPT003", 
    name: "Human Resources", 
    code: "HR", 
    head: "Michael Brown", 
    headEmail: "m.brown@example.com",
    employeeCount: 12,
    projects: 3,
    budget: "$800K",
    status: "active",
    createdAt: "Mar 10, 2024"
  },
  { 
    id: "DEPT004", 
    name: "Finance", 
    code: "FIN", 
    head: "Lisa Johnson", 
    headEmail: "l.johnson@example.com",
    employeeCount: 15,
    projects: 4,
    budget: "$1.1M",
    status: "active",
    createdAt: "Dec 5, 2023"
  },
  { 
    id: "DEPT005", 
    name: "Research & Development", 
    code: "R&D", 
    head: "Robert Wilson", 
    headEmail: "r.wilson@example.com",
    employeeCount: 23,
    projects: 6,
    budget: "$3.2M",
    status: "active",
    createdAt: "Apr 18, 2024"
  }
]

export default function DepartmentsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("table") // table or card view

  // Apply filters and sorting
  const filteredDepartments = dummyDepartments
    .filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1
      
      // Handle different sort fields
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * factor
      } else if (sortBy === "employeeCount") {
        return (a.employeeCount - b.employeeCount) * factor
      } else if (sortBy === "projects") {
        return (a.projects - b.projects) * factor
      }
      
      return 0
    })

  // Toggle sort order
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="max-w-auto mx-auto p-6 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center dark:text-white">
            <Building2 className="mr-2 h-6 w-6 text-blue-500" />
            Department Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage company departments and organizational structure</p>
        </div>
        <div className="flex gap-3">

          <Button onClick={() => navigate("/dashboard/dev/departments/create")} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Department Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Departments</div>
            <Building2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{dummyDepartments.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">+2 from last month</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm font-medium">Total Employees</div>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">
            {dummyDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all departments</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm font-medium">Active Projects</div>
            <Calendar className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {dummyDepartments.reduce((sum, dept) => sum + dept.projects, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">5 due this month</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm font-medium">Total Budget</div>
            <BarChart3 className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">$8.7M</div>
          <div className="text-xs text-gray-500 mt-1">72% utilized YTD</div>
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
            <SearchBar 
              onSearch={setSearchTerm} 
              placeholder="Search departments..." 
              className="w-full sm:w-64"
            />
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
                  <h3 className="font-medium mb-3 dark:text-white">Sort Departments</h3>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="name">Department Name</option>
                      <option value="employeeCount">Employee Count</option>
                      <option value="projects">Number of Projects</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 
                        dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 
                        focus:ring-blue-500 transition-colors"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={() => {
                        setSortBy("name");
                        setSortOrder("asc");
                      }}
                      className="text-sm text-blue-500 hover:text-blue-700"
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
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department ID</th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-blue-500"
                    onClick={() => handleSort("name")}
                  >
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department Head</th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-blue-500"
                    onClick={() => handleSort("employeeCount")}
                  >
                    Employees {sortBy === "employeeCount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-blue-500"
                    onClick={() => handleSort("projects")}
                  >
                    Projects {sortBy === "projects" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Budget</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{dept.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{dept.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Created {dept.createdAt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{dept.head}</div>
                      <div className="text-xs text-gray-500">{dept.headEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {dept.employeeCount}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {dept.projects}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {dept.budget}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          // to={`/departments/edit/${dept.id}`} 
                          onClick={() => navigate(`/dashboard/dev/departments/edit/${dept.id}`)}
                          className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => (
              <div key={dept.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 dark:text-white">{dept.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md mt-1 inline-block">
                        {dept.code}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Link 
                        to={`/dashboard/dev/departments/edit/${dept.id}`} 
                        className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 dark:bg-gray-800">
                  <div className="text-sm mb-3">
                    <div className="font-medium mb-1 text-gray-900 dark:text-white">Department Head</div>
                    <div className="text-gray-700 dark:text-gray-300">{dept.head}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{dept.headEmail}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center mb-2">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Employees</div>
                      <div className="font-medium text-blue-600 dark:text-blue-400">{dept.employeeCount}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                      <div className="font-medium text-green-600 dark:text-green-400">{dept.projects}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Budget</div>
                      <div className="font-medium text-amber-600 dark:text-amber-400">{dept.budget}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    ID: {dept.id} • Created {dept.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredDepartments.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <RefreshCcw className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium dark:text-gray-400">No departments found</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredDepartments.length} of {dummyDepartments.length} departments
          </div>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 rounded border bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 rounded border bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              1
            </button>
            <button className="px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}