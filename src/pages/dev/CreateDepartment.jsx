"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const dummyUsers = [
  { id: 1, name: "John Metal", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
]

export default function CreateDepartment() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    adminId: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredUsers = dummyUsers.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Creating department:", formData)
    navigate("/departments")
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/dev/departments")}
        className="mb-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Departments
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Department</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assign Admin
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {showSuggestions && (
              <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border 
                dark:border-gray-700 rounded-md shadow-lg z-10">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                      cursor-pointer text-gray-900 dark:text-gray-100"
                    onClick={() => {
                      setFormData({ ...formData, adminId: user.id })
                      setSearchTerm(user.name)
                      setShowSuggestions(false)
                    }}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md 
              hover:bg-blue-600 transition-colors"
          >
            Create Department
          </button>
        </form>
      </div>
    </div>
  )
}

