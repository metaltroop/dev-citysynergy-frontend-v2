// src/pages/CreateTender.jsx

"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import Button from "../../components/dept/Button"
 
const CreateTender = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    tenderCategory: "",
    tenderDescription: "",
    apxStartDate: "",
    apxEndDate: "",
    amount: "",
    locality: "",
    localArea: "",
    zone: "",
    city: "",
    pincode: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.tenderCategory || !formData.tenderDescription || !formData.amount) {
      setError("Please fill in all required fields")
      return
    }

    // In a real app, you would send this data to an API
    console.log("Form submitted:", formData)

    // Navigate back to tenders page
    navigate("/dashboard/dept/tenders")
  }

  return (
    <div className="p-2 md:p-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard/dept/tenders")}
          className="p-2 mr-2 rounded-md text-gray-600 hover:bg-sky-100 hover:text-sky-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-sky-400"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create Tender</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tenderCategory" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Tender Category*
              </label>
              <input
                type="text"
                id="tenderCategory"
                name="tenderCategory"
                value={formData.tenderCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Amount (₹)*
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tenderDescription" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Tender Description*
              </label>
              <textarea
                id="tenderDescription"
                name="tenderDescription"
                value={formData.tenderDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="apxStartDate" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Approximate Start Date
              </label>
              <input
                type="date"
                id="apxStartDate"
                name="apxStartDate"
                value={formData.apxStartDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="apxEndDate" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Approximate End Date
              </label>
              <input
                type="date"
                id="apxEndDate"
                name="apxEndDate"
                value={formData.apxEndDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Locality
              </label>
              <input
                type="text"
                id="locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="localArea" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Local Area
              </label>
              <input
                type="text"
                id="localArea"
                name="localArea"
                value={formData.localArea}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Zone
              </label>
              <input
                type="text"
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate("/dashboard/dept/tenders")}
              className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="dark:bg-sky-600 dark:hover:bg-sky-700 dark:text-white"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTender