"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Edit, Trash2, UsersIcon, Shield, Clock, BarChart3, LayoutGrid, List } from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"

const Users = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table") // 'table', 'card'
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // This would come from an API in a real application
  const users = [
    {
      id: 1,
      username: "johndoe",
      email: "john.doe@example.com",
      role: "Admin",
      department: "IT",
      lastActive: "2024-03-15",
      status: "active",
    },
    {
      id: 2,
      username: "janedoe",
      email: "jane.doe@example.com",
      role: "Manager",
      department: "Roads",
      lastActive: "2024-03-14",
      status: "active",
    },
    {
      id: 3,
      username: "bobsmith",
      email: "bob.smith@example.com",
      role: "User",
      department: "Electricity",
      lastActive: "2024-03-10",
      status: "inactive",
    },
    {
      id: 4,
      username: "alicejones",
      email: "alice.jones@example.com",
      role: "Manager",
      department: "Water",
      lastActive: "2024-03-13",
      status: "active",
    },
    {
      id: 5,
      username: "mikebrown",
      email: "mike.brown@example.com",
      role: "User",
      department: "Sewage",
      lastActive: "2024-03-12",
      status: "pending",
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const pendingUsers = users.filter((user) => user.status === "pending").length
  const adminUsers = users.filter((user) => user.role === "Admin").length

  const handleResetPassword = (user) => {
    setSelectedUser(user)
    setIsResetPasswordModalOpen(true)
  }

  const confirmResetPassword = () => {
    // In a real app, you would call an API to reset the password
    console.log(`Resetting password for user: ${selectedUser.username}`)
    setIsResetPasswordModalOpen(false)
  }

  return (
    <div className="max-w-auto mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center text-gray-800 dark:text-white">
            <UsersIcon className="mr-2 h-6 w-6 text-blue-500" />
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system users and their roles</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("dashboard/dept/users/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
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
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Awaiting approval</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Admins</div>
            <Shield className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{adminUsers}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">System administrators</div>
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

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
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
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : user.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => handleResetPassword(user)}>
                          Reset Password
                        </Button>
                        <button className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 size={18} />
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
                        user.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.department}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last active: {user.lastActive}</span>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleResetPassword(user)}>
                        Reset
                      </Button>
                      <button className="p-1 text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300">
                        <Edit size={18} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
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
    </div>
  )
}

export default Users

