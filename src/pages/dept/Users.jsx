"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Info,
  RefreshCcw,
  UsersIcon,
  Shield,
  Clock,
  BarChart3,
  LayoutGrid,
  List,
} from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"
import DeptPermissionGuard from "../../components/dept/DeptPermissionGuard"
import DeptPermissionButton from "../../components/dept/DeptPermissionButton"
import apiClient from "../../utils/apiClient"
import { useToast } from "../../context/ToastContext"
import { useLoading } from "../../context/LoadingContext"

// Add these validation functions at the top of the file, after the imports
const validateEmail = async (email) => {
  if (!email) return { valid: false, message: "Email is required" }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" }
  }

  try {
    // Check if email already exists
    const response = await apiClient.post("/users/check-email", { email })
    if (response.data.exists) {
      return { valid: false, message: "Email already in use" }
    }
    return { valid: true, message: "" }
  } catch (error) {
    console.error("Error checking email:", error)
    return { valid: false, message: "Error checking email" }
  }
}

const validateUsername = async (username) => {
  if (!username) return { valid: false, message: "Username is required" }

  // Username format validation
  if (username.length < 3) {
    return { valid: false, message: "Username must be at least 3 characters" }
  }

  // No spaces allowed
  if (/\s/.test(username)) {
    return { valid: false, message: "Username cannot contain spaces" }
  }

  try {
    // Check if username already exists
    const response = await apiClient.post("/users/check-username", { username })
    if (response.data.exists) {
      return { valid: false, message: "Username already in use" }
    }
    return { valid: true, message: "" }
  } catch (error) {
    console.error("Error checking username:", error)
    return { valid: false, message: "Error checking username" }
  }
}

const Users = () => {
  const navigate = useNavigate()
  // Replace the useToast hook usage
  const toastContext = useToast()
  const showToast = toastContext?.showToast || (() => {})
  // Replace the useLoading hook usage
  const loadingContext = useLoading()
  const setLoading = loadingContext?.setLoading || (() => {})
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table") // 'table', 'card'
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [userDetail, setUserDetail] = useState(null)
  const [editUsername, setEditUsername] = useState("")
  const [sortField, setSortField] = useState("username")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterRole, setFilterRole] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Add these state variables to your component
  const [emailError, setEmailError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/users/department")
      if (response.data.success) {
        setUsers(response.data.data)
      } else {
        showToast("Failed to fetch users", "error")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      showToast("Error fetching users", "error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch roles for the department
  const fetchRoles = async () => {
    try {
      const response = await apiClient.get("/roles/department")
      if (response.data.success) {
        setRoles(response.data.data.roles)
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
    }
  }

  // Get user details
  const getUserDetails = async (userId) => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/users/department/${userId}`)
      if (response.data.success) {
        setUserDetail(response.data.data)
        setIsUserDetailModalOpen(true)
      } else {
        showToast("Failed to fetch user details", "error")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      showToast("Error fetching user details", "error")
    } finally {
      setLoading(false)
    }
  }

  // Handle reset password
  const handleResetPassword = (user) => {
    setSelectedUser(user)
    setIsResetPasswordModalOpen(true)
  }

  // Confirm reset password
  const confirmResetPassword = async () => {
    try {
      setLoading(true)
      const response = await apiClient.post(`/auth/reset-password/${selectedUser.id}`)
      if (response.data.success) {
        showToast("Password reset successful", "success")
        setIsResetPasswordModalOpen(false)
      } else {
        showToast(response.data.message || "Failed to reset password", "error")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      showToast("Error resetting password", "error")
    } finally {
      setLoading(false)
    }
  }

  // Handle delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete user
  const confirmDeleteUser = async () => {
    try {
      setLoading(true)
      const response = await apiClient.delete(`/users/department/${selectedUser.id}`)
      if (response.data.success) {
        showToast("User deleted successfully", "success")
        setIsDeleteModalOpen(false)
        fetchUsers() // Refresh the user list
      } else {
        showToast(response.data.message || "Failed to delete user", "error")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      showToast("Error deleting user", "error")
    } finally {
      setLoading(false)
    }
  }

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditUsername(user.username)
    setIsEditModalOpen(true)
  }

  // Confirm edit user
  const confirmEditUser = async () => {
    if (!editUsername.trim()) {
      showToast("Username cannot be empty", "error")
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.put(`/users/department/${selectedUser.id}`, {
        username: editUsername,
      })
      if (response.data.success) {
        showToast("Username updated successfully", "success")
        setIsEditModalOpen(false)
        fetchUsers() // Refresh the user list
      } else {
        showToast(response.data.message || "Failed to update username", "error")
      }
    } catch (error) {
      console.error("Error updating username:", error)
      showToast("Error updating username", "error")
    } finally {
      setLoading(false)
    }
  }

  // Update the handleAddUser function to navigate instead of opening a modal
  const handleAddUser = () => {
    navigate("/dashboard/dept/users/create")
  }

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Get unique roles for filtering
  const uniqueRoles = [
    ...new Set(users.map((user) => (user.roles && user.roles.length > 0 ? user.roles[0].name : null)).filter(Boolean)),
  ]

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.department && user.department.name.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRole = !filterRole || (user.roles && user.roles.length > 0 && user.roles[0].name === filterRole)

      const matchesStatus =
        !filterStatus ||
        (filterStatus === "active" && !user.state.needsPasswordChange) ||
        (filterStatus === "pending" && user.state.needsPasswordChange)

      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      let aValue, bValue

      if (sortField === "lastLogin") {
        aValue = a.state?.lastLogin ? new Date(a.state.lastLogin).getTime() : 0
        bValue = b.state?.lastLogin ? new Date(b.state.lastLogin).getTime() : 0
      } else if (sortField === "role") {
        aValue = a.roles && a.roles.length > 0 ? a.roles[0].name : ""
        bValue = b.roles && b.roles.length > 0 ? b.roles[0].name : ""
      } else {
        aValue = a[sortField] || ""
        bValue = b[sortField] || ""
      }

      if (typeof aValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortDirection === "asc" ? comparison : -comparison
      } else {
        const comparison = aValue - bValue
        return sortDirection === "asc" ? comparison : -comparison
      }
    })

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter((user) => !user.state.needsPasswordChange).length
  const pendingUsers = users.filter((user) => user.state.needsPasswordChange).length
  const adminUsers = users.filter(
    (user) =>
      user.roles && user.roles.some((role) => role.name === "Department Admin" || role.name === "Department Head"),
  ).length

  return (
    <DeptPermissionGuard
      featureId="FEAT_USER_MGMT"
      fallback={<div className="p-6 text-center">You don't have permission to view user management.</div>}
    >
      <div className="max-w-auto mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center text-gray-800 dark:text-white">
              <UsersIcon className="mr-2 h-6 w-6 text-blue-500" />
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage department users and their roles</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <DeptPermissionButton featureId="FEAT_USER_MGMT" permissionType="write" onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </DeptPermissionButton>
          </div>
        </div>

        {/* User Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Users</div>
              <UsersIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{totalUsers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Registered accounts</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Users</div>
              <BarChart3 className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{activeUsers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Currently active</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</div>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{pendingUsers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Awaiting first login</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Admins</div>
              <Shield className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{adminUsers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Department administrators</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>

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
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("username")}
                    >
                      Username
                      {sortField === "username" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortField === "email" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("role")}
                    >
                      Role
                      {sortField === "role" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("lastLogin")}
                    >
                      Last Login
                      {sortField === "lastLogin" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.roles && user.roles.length > 0 ? user.roles[0].name : "No Role"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(user.state?.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            !user.state.needsPasswordChange
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {!user.state.needsPasswordChange ? "Active" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => getUserDetails(user.id)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <Info size={18} />
                          </button>
                          <DeptPermissionButton
                            featureId="FEAT_USER_MGMT"
                            permissionType="update"
                            onClick={() => handleResetPassword(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Button variant="secondary" size="sm">
                              Reset
                            </Button>
                          </DeptPermissionButton>
                          <DeptPermissionButton
                            featureId="FEAT_USER_MGMT"
                            permissionType="update"
                            onClick={() => handleEditUser(user)}
                            className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300"
                          >
                            <Edit size={18} />
                          </DeptPermissionButton>
                          <DeptPermissionButton
                            featureId="FEAT_USER_MGMT"
                            permissionType="delete"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={18} />
                          </DeptPermissionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-white">{user.username}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          !user.state.needsPasswordChange
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {!user.state.needsPasswordChange ? "Active" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.roles && user.roles.length > 0 ? user.roles[0].name : "No Role"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.department ? user.department.name : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Last login: {formatDate(user.state?.lastLogin)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => getUserDetails(user.id)}
                          className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Info size={18} />
                        </button>
                        <DeptPermissionButton
                          featureId="FEAT_USER_MGMT"
                          permissionType="update"
                          onClick={() => handleResetPassword(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Button variant="secondary" size="sm">
                            Reset
                          </Button>
                        </DeptPermissionButton>
                        <DeptPermissionButton
                          featureId="FEAT_USER_MGMT"
                          permissionType="update"
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                          <Edit size={18} />
                        </DeptPermissionButton>
                        <DeptPermissionButton
                          featureId="FEAT_USER_MGMT"
                          permissionType="delete"
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </DeptPermissionButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div>
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        {/* User Detail Modal */}
        <Modal
          isOpen={isUserDetailModalOpen}
          onClose={() => setIsUserDetailModalOpen(false)}
          title="User Details"
          maxWidth="max-w-lg"
        >
          {userDetail && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {userDetail.profileImage ? (
                    <img
                      src={userDetail.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userDetail.username.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userDetail.username}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{userDetail.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                  <p className="text-sm text-gray-900 dark:text-white">{userDetail.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User Type</p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">{userDetail.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {userDetail.department ? userDetail.department.name : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department Code</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {userDetail.department ? userDetail.department.code : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(userDetail.state?.lastLogin)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <p className="text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        !userDetail.state.needsPasswordChange
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {!userDetail.state.needsPasswordChange ? "Active" : "Pending"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Assigned Roles</p>
                <div className="flex flex-wrap gap-2">
                  {userDetail.roles && userDetail.roles.length > 0 ? (
                    userDetail.roles.map((role) => (
                      <span
                        key={role.id}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {role.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

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
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete User">
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-400">
                  Are you sure you want to delete the user <span className="font-bold">{selectedUser.username}</span>?
                </p>
                <p className="text-sm text-red-700 dark:text-red-500 mt-2">
                  This action cannot be undone. All data associated with this user will be permanently removed.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteUser}>
                  Delete User
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit User Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Username">
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmEditUser}>Save Changes</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DeptPermissionGuard>
  )
}

export default Users

