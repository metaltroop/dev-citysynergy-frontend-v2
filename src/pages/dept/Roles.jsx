"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Edit, Trash2, Shield, Users, Lock, Settings,LayoutGrid, List, } from "lucide-react"
import Button from "../../components/dept/Button"
import SlideOver from "../../components/dept/SlideOver"

const features = [
  { id: 1, name: "Dashboard", description: "View and manage dashboard" },
  { id: 2, name: "Tenders", description: "Manage tender operations" },
  { id: 3, name: "Clashes", description: "Handle department clashes" },
  { id: 4, name: "Issues", description: "Track and resolve issues" },
  { id: 5, name: "Inventory", description: "Manage inventory items" },
  { id: 6, name: "Users", description: "User management" },
  { id: 7, name: "Roles", description: "Role and permission management" },
  { id: 8, name: "Features", description: "Feature configuration" },
]

const Roles = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table")
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [permissions, setPermissions] = useState({})

  // Initialize permissions state for each feature
  const initializePermissions = (role) => {
    const initialPermissions = {}
    features.forEach((feature) => {
      initialPermissions[feature.id] = {
        read: role?.permissions?.[feature.id]?.read ?? false,
        write: role?.permissions?.[feature.id]?.write ?? false,
        update: role?.permissions?.[feature.id]?.update ?? false,
        delete: role?.permissions?.[feature.id]?.delete ?? false,
      }
    })
    setPermissions(initialPermissions)
  }

  const handlePermissionChange = (featureId, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [permission]: !prev[featureId][permission],
      },
    }))
  }

  const openPermissionModal = (role) => {
    setSelectedRole(role)
    initializePermissions(role)
    setIsPermissionModalOpen(true)
  }

  // Dummy roles data
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full system access with all permissions",
      users: 3,
      permissions: {},
      createdAt: "2024-03-01",
    },
    {
      id: 2,
      name: "Department Manager",
      description: "Department-level access with limited administrative capabilities",
      users: 8,
      permissions: {},
      createdAt: "2024-03-05",
    },
    {
      id: 3,
      name: "Viewer",
      description: "Read-only access to system data",
      users: 15,
      permissions: {},
      createdAt: "2024-03-10",
    },
  ]

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Stats
  const totalRoles = roles.length
  const totalUsers = roles.reduce((sum, role) => sum + role.users, 0)
  const avgPermissions = Math.round(
    roles.reduce((sum, role) => sum + Object.keys(role.permissions).length, 0) / roles.length,
  )

  return (
    <div className="max-w-auto mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center text-gray-800 dark:text-white">
            <Shield className="mr-2 h-6 w-6 text-purple-500" />
            Role Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system roles and permissions</p>
        </div>
        <Button          onClick={() => navigate("/dashboard/dept/roles/create")}        >
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Roles</div>
            <Shield className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{totalRoles}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">System roles</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Users</div>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{totalUsers}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Assigned to roles</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg. Permissions</div>
            <Lock className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{avgPermissions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Per role</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search roles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${viewMode === "table" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 ${viewMode === "card" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
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
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Created {role.createdAt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300">{role.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{role.users}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => openPermissionModal(role)}>
                          Update Permissions
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
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 dark:text-white">{role.name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Created {role.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{role.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Users: </span>
                      <span className="font-medium text-gray-900 dark:text-white">{role.users}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openPermissionModal(role)}>
                        Permissions
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
            Showing {filteredRoles.length} of {roles.length} roles
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 rounded border bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded border bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              1
            </button>
            <button className="px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Permissions Modal */}
      <SlideOver
        open={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        title={`Update Permissions - ${selectedRole?.name}`}
      >
        <div className="py-6">
          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {["read", "write", "update", "delete"].map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={permissions[feature.id]?.[permission] || false}
                        onChange={() => handlePermissionChange(feature.id, permission)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setIsPermissionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPermissionModalOpen(false)}>Save Changes</Button>
          </div>
        </div>
      </SlideOver>
    </div>
  )
}

export default Roles

