"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Building2,
  ShieldCheck,
  AlertTriangle,
  ArrowUp,
  Activity,
  RefreshCcw,
  UserCog,
  Settings,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import apiClient from "../../utils/apiClient"
import { useToast } from "../../context/ToastContext"
import { useAuth } from "../../context/AuthContext"


export default function Dashboard() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    devUsers: 0,
    deptUsers: 0,
    activeUsers: 0,
    totalDepartments: 0,
    activeClashes: 0,
    systemHealth: 0,
  })
  const [activities, setActivities] = useState([])
  const [activityData, setActivityData] = useState([])
  const [activityDates, setActivityDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setRefreshing(true)
      const response = await apiClient.get("/activity/dev-dashboard")

      if (response?.data?.success) {
        const data = response.data.data || {}
        const stats = data.stats || {}

        // Set the stats values
        setStats({
          totalUsers: stats.userCount || 0,
          totalDepartments: stats.deptCount || 0,
          activeClashes: stats.clashCount || 0,
          systemHealth: stats.systemHealth || 0,
          devUsers: 0,
          deptUsers: 0,
          activeUsers: stats.userCount || 0,
        })

        // Set the activities for the Recent Activity feed
        if (data.recentActivities) {
          const formattedActivities = data.recentActivities
            .slice(0, 5) // Limit to 5 items
            .map((activity) => ({
              id: activity.id,
              type: activity.type.toLowerCase(),
              description: activity.description,
              timestamp: activity.timestamp,
              user: activity.user?.username || "Unknown",
              email: activity.user?.email || "",
            }))
          setActivities(formattedActivities)
        }

        // Set the system activity data for the chart
        if (data.systemActivity?.dailyActivity) {
          // Get the daily activity data for the chart
          const dailyActivity = data.systemActivity.dailyActivity

          // Create an array of the last 7 days
          const today = new Date()
          const dates = []
          const chartData = []

          for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            const dateString = date.toISOString().split("T")[0]
            dates.push(formatDayLabel(date))

            // Find matching data or use 0
            const dayData = dailyActivity.find((d) => d.date === dateString)
            chartData.push(dayData ? dayData.count : 0)
          }

          setActivityDates(dates)
          setActivityData(chartData)
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      addToast({
        type: "error",
        message: "Failed to load dashboard data",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Helper function to format date/time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Helper function to format day label
  const formatDayLabel = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[date.getDay()]
  }

  // Function to determine icon based on activity type
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case "login":
        return <Users className="h-5 w-5 text-blue-500 dark:text-blue-300" />
      case "user_updated":
        return <UserCog className="h-5 w-5 text-green-500 dark:text-green-300" />
      case "role_modified":
        return <ShieldCheck className="h-5 w-5 text-purple-500 dark:text-purple-300" />
      case "system":
        return <Settings className="h-5 w-5 text-purple-500 dark:text-purple-300" />
      default:
        return <Activity className="h-5 w-5 text-gray-500 dark:text-gray-300" />
    }
  }

  // Function to get background color based on activity type
  const getActivityBgColor = (type) => {
    switch (type.toLowerCase()) {
      case "login":
        return "bg-blue-50 dark:bg-blue-900/30"
      case "user_updated":
        return "bg-green-50 dark:bg-green-900/30"
      case "role_modified":
        return "bg-purple-50 dark:bg-purple-900/30"
      case "system":
        return "bg-purple-50 dark:bg-purple-900/30"
      default:
        return "bg-gray-50 dark:bg-gray-900/30"
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="p-5">
      <div className="max-w-auto pt-8 mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {user?.name || "Admin"}</h1>
            <p className="text-gray-600 dark:text-gray-400">Here&apos;s what&apos;s happening in your system today.</p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-500 dark:text-blue-300" />
              </div>
              <span className="px-2.5 py-0.5 text-sm bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                {Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{loading ? "..." : stats.totalUsers}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-500 dark:text-purple-300" />
              </div>
              <span className="px-2.5 py-0.5 text-sm bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                5%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {loading ? "..." : stats.totalDepartments}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Departments</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
              </div>
              <span className="px-2.5 py-0.5 text-sm bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {loading ? "..." : stats.activeClashes}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Active Clashes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900 rounded-lg">
                <Activity className="h-6 w-6 text-green-500 dark:text-green-300" />
              </div>
              <span className="px-2.5 py-0.5 text-sm bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                2%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {loading ? "..." : `${stats.systemHealth}%`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">System Health</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-white">System Activity</h3>
              <select className="text-sm border rounded-md px-2 py-1 dark:bg-gray-700 dark:text-gray-300">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCcw className="h-8 w-8 text-gray-400 dark:text-gray-600 animate-spin" />
              </div>
            ) : (
              <div className="relative">
                <div className="h-[300px] flex items-end justify-between gap-2">
                  {activityData.map((count, i) => {
                    // Calculate height percentage (max 95% to ensure always visible)
                    const maxCount = Math.max(...activityData, 1)
                    const heightPercentage = maxCount > 0 ? Math.max(5, (count / maxCount) * 95) : 5

                    return (
                      <div key={i} className="w-full h-full flex items-end justify-center">
                        <div className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg relative group">
                          <div
                            className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-600 rounded-lg transition-all duration-300 group-hover:bg-blue-600 dark:group-hover:bg-blue-700"
                            style={{ height: `${heightPercentage}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                              {count} events
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {activityDates.map((day, i) => (
                    <span key={i}>{day}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCcw className="h-8 w-8 text-gray-400 dark:text-gray-600 animate-spin" />
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className={`p-2 ${getActivityBgColor(activity.type)} rounded-full shrink-0`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {formatDateTime(activity.timestamp)}
                        </span>
                        <span>by</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No recent activities found</div>
              )}
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-sm p-6 text-white">
            <Users className="h-8 w-8 mb-4" />
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-blue-100 text-sm mb-4">Manage system users and their roles</p>
            <button
              onClick={() => navigate("/dashboard/dev/users")}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              Manage Users
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 rounded-xl shadow-sm p-6 text-white">
            <Building2 className="h-8 w-8 mb-4" />
            <h3 className="font-semibold mb-2">Department Control</h3>
            <p className="text-purple-100 text-sm mb-4">Organize and manage departments</p>
            <button
              onClick={() => navigate("/dashboard/dev/departments")}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Departments
            </button>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 rounded-xl shadow-sm p-6 text-white">
            <ShieldCheck className="h-8 w-8 mb-4" />
            <h3 className="font-semibold mb-2">Role Configuration</h3>
            <p className="text-green-100 text-sm mb-4">Configure user roles and permissions</p>
            <button
              onClick={() => navigate("/dashboard/dev/roles")}
              className="px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
            >
              Manage Roles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

