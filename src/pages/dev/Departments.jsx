// src/pages/Departments.jsx
"use client"

import { useState, useEffect} from "react"
import { useNavigate} from "react-router-dom"
import SearchBar from "../../components/dev/SearchBar"
import apiClient from "../../utils/apiClient"
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 

  Filter, 
  RefreshCcw,
  Users,

  Info,
} from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"

export default function DepartmentsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("table") // table or card view

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedDeptInfo, setSelectedDeptInfo] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/departments");
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (err) {
      setError(err.message);
      setToasts(prev => [...prev, {
        id: Date.now(),
        type: "error",
        message: "Failed to fetch departments"
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const confirmDeleteDepartment = async () => {
    try {
      setIsDeleting(true);
      const response = await apiClient.put(`/departments/delete-dept/${deptToDelete.deptId}`);
      
      if (response.data.success) {
        setToasts(prev => [...prev, {
          id: Date.now(),
          type: "success",
          message: `${response.data.data.departmentName} deleted successfully`
        }]);
        fetchDepartments();
      }
    } catch (err) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        type: "error",
        message: err.response?.data?.message || "Failed to delete department"
      }]);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  // Fetch department info
  const fetchDepartmentInfo = async (deptId) => {
    try {
      const response = await apiClient.get(`/departments/get-dept/${deptId}`);
      if (response.data.success) {
        setSelectedDeptInfo(response.data.data);
        setInfoModalOpen(true);
      }
    } catch (err) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        type: "error",
        message: "Failed to fetch department details"
      }]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);
  // Apply filters and sorting
  const filteredDepartments = departments
  .filter(
    (dept) =>
      dept.deptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.deptCode.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const factor = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "name") {
      return a.deptName.localeCompare(b.deptName) * factor;
    } else if (sortBy === "users") {
      return ((a.users?.length || 0) - (b.users?.length || 0)) * factor;
    }
    return 0;
  });

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
  <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
      />
    ))}
  </div>
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
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Departments</div>
            <Building2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {departments.length}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm font-medium">Total Users</div>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">
            {departments.reduce((sum, dept) => sum + (dept.users?.length || 0), 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all departments</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm font-medium">Departments with Head</div>
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {departments.filter(dept => dept.deptHead).length}
          </div>
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
            <button
              onClick={fetchDepartments}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh departments"
            >
              <RefreshCcw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
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
  <option value="users">User Count</option>
  <option value="code">Department Code</option>
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
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
      Department ID
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
      Name
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
      Code
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
      Department Head
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
      Users
    </th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
      Actions
    </th>
  </tr>
</thead>
<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  {filteredDepartments.map((dept) => (
    <tr key={dept.deptId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {dept.deptId}
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-white">
          {dept.deptName}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Created {new Date(dept.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
          {dept.deptCode}
        </span>
      </td>
      <td className="px-6 py-4">
        {dept.deptHead ? (
          <>
            <div className="font-medium dark:text-white">{dept.deptHead.username}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{dept.deptHead.email}</div>
          </>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">No head assigned</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm">
        {dept.users?.length || 0} users
      </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => fetchDepartmentInfo(dept.deptId)}
                          className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/dashboard/dev/departments/edit/${dept.deptId}`)}
                          className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeptToDelete(dept);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        >
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
  {filteredDepartments.map((dept) => (
    <div key={dept.deptId} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-white">{dept.deptName}</h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md mt-1 inline-block">
              {dept.deptCode}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => fetchDepartmentInfo(dept.deptId)}
              className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
              title="View Details"
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate(`/dashboard/dev/departments/edit/${dept.deptId}`)}
              className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setDeptToDelete(dept);
                setDeleteModalOpen(true);
              }}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 dark:bg-gray-800">
        <div className="text-sm mb-3">
          <div className="font-medium mb-1 text-gray-900 dark:text-white">Department Head</div>
          {dept.deptHead ? (
            <>
              <div className="text-gray-700 dark:text-gray-300">{dept.deptHead.username}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{dept.deptHead.email}</div>
            </>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No head assigned</div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
          <div className="font-medium text-blue-600 dark:text-blue-400">{dept.users?.length || 0}</div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          ID: {dept.deptId} • Created {new Date(dept.createdAt).toLocaleDateString()}
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
            Showing {filteredDepartments.length} of {departments.length} departments
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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Department"
      >
        {deptToDelete && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-400">
                Are you sure you want to delete{" "}
                <span className="font-bold">{deptToDelete.deptName}</span>?
              </p>
              <p className="text-sm text-red-700 dark:text-red-500 mt-2">
                This will permanently delete the department and remove all associated users.
                This action cannot be undone.
              </p>
              {deptToDelete.users?.length > 0 && (
                <p className="text-sm text-red-700 dark:text-red-500 mt-2">
                  {deptToDelete.users.length} user(s) will be affected.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteDepartment} disabled={isDeleting}>
                {isDeleting ? (
                  <div className="flex items-center">
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete Department"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="Department Information"
      >
        {selectedDeptInfo && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Department Details</h3>
          <div className="space-y-2">
            <p className="text-lg font-medium dark:text-white">{selectedDeptInfo.department.deptName}</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {selectedDeptInfo.department.deptCode}
              </span>
              <span className="text-xs text-gray-500">
                Created: {new Date(selectedDeptInfo.department.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Department Head</h3>
          {selectedDeptInfo.department.deptHead ? (
            <div className="space-y-1">
              <p className="text-lg font-medium dark:text-white">{selectedDeptInfo.department.deptHead.username}</p>
              <p className="text-sm text-gray-500">{selectedDeptInfo.department.deptHead.email}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No department head assigned</p>
          )}
        </div>
      </div>

      <div className="border-t dark:border-gray-700 pt-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-between">
          <span>Department Users</span>
          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
            {selectedDeptInfo.users.length} users
          </span>
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {selectedDeptInfo.users.map(user => (
            <div key={user.uuid} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium dark:text-white">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map(role => (
                    <span 
                      key={role.roleId} 
                      className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                    >
                      {role.roleName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</Modal>
    </div>
  )
}