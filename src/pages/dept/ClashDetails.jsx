// src/pages/ClashDetails.jsx
"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send, Check } from "lucide-react"
import Button from "../../components/dept/Button"
import Modal from "../../components/dept/Modal"

const ClashDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  // This would come from an API in a real application
  const clash = {
    clashId: "C001",
    involvedDepartments: { D01: false, D02: false, D03: false },
    departmentNames: { D01: "Roads Department", D02: "Electricity Department", D03: "Water Department" },
    proposedStartDate: { D01: "2024-04-01", D02: "2024-04-10", D03: "2024-04-15" },
    proposedEndDate: { D01: "2024-05-01", D02: "2024-05-10", D03: "2024-05-15" },
    proposedRoadmap: { D01: "Priority 1", D02: "Priority 2", D03: "Priority 3" },
    isResolved: false,
    location: "Sector 45, Central Delhi",
    description: "Multiple departments planning work in the same area during overlapping time periods.",
    messages: [
      { id: 1, sender: "D01", text: "We need to start road repairs by April 1st.", timestamp: "2024-03-10T10:30:00" },
      {
        id: 2,
        sender: "D02",
        text: "We have scheduled electrical work starting April 10th.",
        timestamp: "2024-03-10T11:15:00",
      },
      {
        id: 3,
        sender: "D03",
        text: "Our water pipeline replacement is set to begin April 15th.",
        timestamp: "2024-03-10T14:20:00",
      },
      { id: 4, sender: "D01", text: "Can any department adjust their timeline?", timestamp: "2024-03-11T09:45:00" },
      {
        id: 5,
        sender: "D02",
        text: "We could potentially delay by 2 weeks if necessary.",
        timestamp: "2024-03-11T13:10:00",
      },
    ],
  }

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // In a real app, you would send this to an API
    console.log("Sending message:", newMessage)

    // Clear the input
    setNewMessage("")
  }

  const handleAccept = () => {
    // In a real app, you would update the clash status via API
    console.log("Accepting proposed roadmap")
    setIsConfirmModalOpen(false)

    // Navigate back to clashes page
    navigate("/dashboard/dept/clashes")
  }

  return (
    <div className="p-2 md:p-6">
      <div className="flex items-center mb-6">
        <button
        onClick={() => navigate("/dashboard/dept/clashes")}           className="p-2 mr-2 rounded-md text-gray-600 hover:bg-sky-100 hover:text-sky-600"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Clash {id}</h1>
        <span
          className={`ml-4 px-2 py-1 text-xs rounded-full ${clash.isResolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
        >
          {clash.isResolved ? "Resolved" : "Unresolved"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="relative">
                Chat
                <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </span>
            </h2>
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              {clash.messages.map((message, index) => {
                const isCurrentDept = message.sender === "D01" // Assuming current user is from D01
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentDept ? "justify-end" : "justify-start"} animate-fadeIn`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {!isCurrentDept && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0">
                        {message.sender}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                        isCurrentDept
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {clash.departmentNames[message.sender] || message.sender}
                        </span>
                        <span className="text-xs ml-2 opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="leading-relaxed">{message.text}</p>
                    </div>
                    {isCurrentDept && (
                      <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-medium text-white ml-2 flex-shrink-0">
                        {message.sender}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" className="px-5">
                <Send size={18} className="mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Proposed Roadmap</h2>
            <div className="space-y-4">
              {Object.keys(clash.proposedRoadmap).map((deptId, index) => (
                <div
                  key={deptId}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-sky-300 dark:hover:border-sky-600"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-2 h-10 rounded-full bg-gradient-to-b from-sky-400 to-blue-600 mr-3"></div>
                      <span className="font-medium text-gray-800 dark:text-white">{clash.departmentNames[deptId]}</span>
                    </div>
                    <span className="px-3 py-1 text-sm bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 rounded-full font-medium">
                      {clash.proposedRoadmap[deptId]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {clash.proposedStartDate[deptId]}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {clash.proposedEndDate[deptId]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!clash.isResolved && (
              <Button
                className="w-full mt-6 transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Accept Roadmap
              </Button>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Departments Involved</h2>
            <div className="space-y-2">
              {Object.keys(clash.involvedDepartments).map((deptId) => (
                <div key={deptId} className="flex items-center justify-between p-2 border-b border-gray-100">
                  <span>{clash.departmentNames[deptId]}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      clash.involvedDepartments[deptId]
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {clash.involvedDepartments[deptId] ? "Accepted" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirm Action">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 mb-4">
            <Check className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Are You Sure?</h3>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be reversed. Once accepted, the roadmap will be finalized.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAccept}>Accept</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ClashDetails

