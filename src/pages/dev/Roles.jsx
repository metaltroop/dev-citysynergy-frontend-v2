"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  Users, 
  Lock,
  Search,
  LayoutGrid,
  List
} from "lucide-react"
import SearchBar from "../../components/dev/SearchBar"
import Modal from "../../components/dept/Modal"
import Button from "../../components/dept/Button"
import SlideOver from "../../components/dept/SlideOver"

const dummyRoles = [
  {
    id: "DROL001",
    name: "DevAdmin",
    description: "Developer administrator with full access",
    permissions: {
      "User Management": ["R", "W", "U", "D"],
      "Department Control": ["R", "W"],
      "System Settings": ["R", "W", "U"],
    },
  },
  {
    id: "DROL002",
    name: "System Owner",
    description: "System owner with complete control",
    permissions: {
      "User Management": ["R", "W", "U", "D"],
      "Department Control": ["R", "W", "U", "D"],
      "System Settings": ["R", "W", "U", "D"],
    },
  },
]

const features = [
  { id: 1, name: "User Management", description: "Manage users and access" },
  { id: 2, name: "Department Control", description: "Control department settings" },
  { id: 3, name: "System Settings", description: "Manage system configuration" },
  { id: 4, name: "Report Generation", description: "Generate and manage reports" },
  { id: 5, name: "API Access", description: "Access to system APIs" },
]

const permissionTypes = [
  { key: "R", label: "Read" },
  { key: "W", label: "Write" },
  { key: "U", label: "Update" },
  { key: "D", label: "Delete" },
]

export default function Roles() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("table")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [newRole, setNewRole] = useState({ name: "", description: "" })
  const [permissions, setPermissions] = useState({})
  const [showSlideOver, setShowSlideOver] = useState(false)

  const filteredRoles = dummyRoles.filter((role) => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Stats calculations
  const totalRoles = dummyRoles.length
  const totalUsers = dummyRoles.reduce((sum, role) => sum + (role.users || 0), 0)
  const avgPermissions = Math.round(
    dummyRoles.reduce((sum, role) => sum + Object.keys(role.permissions || {}).length, 0) / dummyRoles.length
  )

  const initializePermissions = (role) => {
    const initialPermissions = {}
    features.forEach((feature) => {
      initialPermissions[feature.id] = {
        R: role?.permissions?.[feature.name]?.includes("R") ?? false,
        W: role?.permissions?.[feature.name]?.includes("W") ?? false,
        U: role?.permissions?.[feature.name]?.includes("U") ?? false,
        D: role?.permissions?.[feature.name]?.includes("D") ?? false,
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

  const RoleCard = ({ role }) => (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-white">{role.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedRole(role)
                initializePermissions(role)
                setShowSlideOver(true)
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 dark:bg-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(role.permissions).map(([feature, perms]) => (
            <div key={feature} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{feature}</p>
              <div className="flex flex-wrap gap-1">
                {permissionTypes.map(({ key }) => (
                  <span
                    key={key}
                    className={`text-xs px-2 py-1 rounded ${
                      perms.includes(key)
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center dark:text-white">
            <Shield className="mr-2 h-6 w-6 text-purple-500" />
            Role Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system roles and permissions</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
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

      {/* Search and View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchBar 
              onSearch={setSearchTerm} 
              placeholder="Search roles..." 
              className="w-full"
            />
          </div>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${viewMode === "table" 
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 ${viewMode === "card" 
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        {/* Role List */}
        <div className="p-4">
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissions</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {role.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{role.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(role.permissions).length} features
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRole(role);
                              initializePermissions(role);
                              setShowSlideOver(true);
                            }}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-white">{role.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            initializePermissions(role);
                            setShowSlideOver(true);
                          }}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(role.permissions).map(([feature, perms]) => (
                        <div key={feature} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                          <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">{feature}</p>
                          <div className="flex flex-wrap gap-1">
                            {permissionTypes.map(({ key }) => (
                              <span
                                key={key}
                                className={`text-xs px-1.5 py-0.5 rounded ${
                                  perms.includes(key)
                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                    : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {key}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Role">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
            <input
              type="text"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role description"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Creating role:", newRole)
                setShowCreateModal(false)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Role
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Permissions Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title={`Edit Permissions - ${selectedRole?.name}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid gap-4">
            <div className="grid grid-cols-[2fr,repeat(4,1fr)] gap-4 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="font-medium">Feature</div>
              {permissionTypes.map(({ key, label }) => (
                <div key={key} className="text-center font-medium">
                  {label}
                </div>
              ))}
            </div>
            {features.map((feature) => (
              <div
                key={feature.id}
                className="grid grid-cols-[2fr,repeat(4,1fr)] gap-4 px-4 py-2 items-center hover:bg-gray-50 rounded-lg"
              >
                <div>{feature.name}</div>
                {permissionTypes.map(({ key }) => (
                  <div key={key} className="flex justify-center">
                    <button
                      onClick={() => handlePermissionChange(feature.id, key)}
                      className={`p-2 rounded-lg ${
                        permissions[feature.id]?.[key] ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setShowPermissionModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Saving permissions:", permissions)
                setShowPermissionModal(false)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Add SlideOver for permissions */}
      <SlideOver
        open={showSlideOver}
        onClose={() => setShowSlideOver(false)}
        title={`Edit Permissions - ${selectedRole?.name}`}
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
                  {permissionTypes.map(({ key, label }) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={permissions[feature.id]?.[key] || false}
                        onChange={() => handlePermissionChange(feature.id, key)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 
                          dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setShowSlideOver(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log("Saving permissions:", permissions)
                setShowSlideOver(false)
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </SlideOver>
    </div>
  )
}