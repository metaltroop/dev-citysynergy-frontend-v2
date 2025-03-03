"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import SearchBar from "../../components/dev/SearchBar"
import { 
  Edit, 
  Trash2, 
  Key, 
  UserPlus, 
  Filter, 
  MoreVertical, 
  Download, 
  Upload, 
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  Users as UsersIcon
} from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"

const roles = [
  { id: "DROL001", name: "DevAdmin", color: "blue" },
  { id: "DROL002", name: "System Owner", color: "purple" },
  { id: "DROL003", name: "System Creator", color: "green" },
]

const departments = ["Department of road", "Department of Electricity"]

export default function UsersPage() {
  const [userType, setUserType] = useState("dev")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setUsers(response.data.data)
      } else {
        throw new Error(response.data.message || "Failed to fetch users")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Apply all filters
  const filteredUsers = users.filter(
    (user) =>
      user.type === userType &&
      (departmentFilter === "all" || 
        (user.department && user.department.name === departmentFilter)) &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Get role display info
  const getRoleInfo = (roleId) => {
    const role = roles.find(r => r.id === roleId) || { name: "User", color: "gray" }
    return {
      name: role.name,
      color: role.color
    }
  }

  // Status based on isFirstLogin 
  const getUserStatus = (user) => {
    return user.state && user.state.isFirstLogin ? "inactive" : "active"
  }

  // Status badge colors
  const getStatusColor = (status) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  // Role badge colors
  const getRoleBadgeColor = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      green: "bg-green-100 text-green-800 border-green-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200"
    }
    return colors[color] || colors.gray
  }

  const handleResetPassword = (user) => {
    setSelectedUser(user)
    setIsResetPasswordModalOpen(true)
  }

  const confirmResetPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/reset-password/${selectedUser.id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log(`Resetting password for user: ${selectedUser.username}`);
        console.log("Password reset successful");
      } else {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    }
    setIsResetPasswordModalOpen(false);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setDeleteError(null)
    setDeleteModalOpen(true)
  }

  const confirmDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUsers(users.filter(user => user.id !== userToDelete.id));
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setDeleteError(err.response?.data?.message || err.message);
    }
  };

  // Format last login date
  const formatLastLogin = (lastLoginDate) => {
    if (!lastLoginDate) return "Never"
    
    const lastLogin = new Date(lastLoginDate)
    const now = new Date()
    const diffMs = now - lastLogin
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return lastLogin.toLocaleDateString()
  }

  // Get user avatar initials
  const getUserInitials = (username) => {
    if (!username) return "??"
    return username.substring(0, 2).toUpperCase()
  }

  return (
    <div className="max-w-auto mx-auto p-6 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <UsersIcon className="mr-2 h-6 w-6 text-blue-500" />
            User Management
          </h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/dashboard/dev/users/create")} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">{users.filter(u => u.type === "dev").length}</div>
          <div className="text-gray-600 dark:text-gray-300">Developer Users</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-purple-500 mb-2">{users.filter(u => u.type === "dept").length}</div>
          <div className="text-gray-600 dark:text-gray-300">Department Users</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-green-500 mb-2">
            {users.filter(u => getUserStatus(u) === "active").length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Active Users</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setUserType("dev")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                userType === "dev" 
                  ? "bg-blue-500 text-white dark:bg-blue-600" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Dev Users
            </button>
            <button
              onClick={() => setUserType("dept")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                userType === "dept" 
                  ? "bg-blue-500 text-white dark:bg-blue-600" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Department Users
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar 
              onSearch={setSearchTerm} 
              placeholder="Search users..." 
              className="w-full sm:w-64"
            />
            {userType === "dept" && (
              <div className="relative">
                <button 
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10 p-4">
                    <h3 className="font-medium mb-3">Filter Users</h3>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button 
                        onClick={() => {
                          setDepartmentFilter("all");
                        }}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <RefreshCcw className="h-12 w-12 mx-auto mb-2 opacity-50 animate-spin" />
              <p className="text-lg font-medium">Loading users...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-400 dark:text-red-500 mb-2">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">Error loading users</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                  {userType === "dept" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const status = getUserStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {getUserInitials(user.username)}
                          </div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                      {userType === "dept" && (
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {user.department ? user.department.name : "None"}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="inline-flex">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(roleInfo.color)}`}>
                            {roleInfo.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {status === "active" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.state && user.state.lastLogin ? formatLastLogin(user.state.lastLogin) : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
                            onClick={() => handleResetPassword(user)}
                          >
                            <Key className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <RefreshCcw className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">No users found</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredUsers.length} of {users.filter(u => u.type === userType).length} users
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

      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        title="Reset Password"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-400">
                Are you sure you want to reset the password for{" "}
                <span className="font-bold">{selectedUser.username}</span>?
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-2">
                A temporary password will be generated and sent to their email address.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsResetPasswordModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmResetPassword}>Reset Password</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
      >
        {userToDelete && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-400">
                Are you sure you want to delete the user{" "}
                <span className="font-bold">{userToDelete.username}</span>?
              </p>
              <p className="text-sm text-red-700 dark:text-red-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-red-800 dark:text-red-400">{deleteError}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteUser}>Delete User</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}