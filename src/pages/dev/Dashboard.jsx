import { Users, Building2, ShieldCheck, AlertTriangle, ArrowUp, ArrowDown, Activity } from "lucide-react"
import { useNavigate } from "react-router-dom"


export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="p-5">
      <div className="max-w-auto pt-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening in your system today.</p>
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
                12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">2,847</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-500 dark:text-purple-300" />
              </div>
              <span className="px-2.5 py-0.5 text-sm bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full flex items-center">
                <ArrowDown className="w-4 h-4 mr-1" />
                3%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">42</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Departments</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
              </div>
              <span className="px-2.5 py-0.5 text-sm bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">18</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Active Clashes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900 rounded-lg">
                <Activity className="h-6 w-6 text-green-500 dark:text-green-300" />
              </div>
              <span className="px-2.5 py-0.5 text-sm bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                24%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">95.4%</h3>
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
            <div className="h-[300px] flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 63, 43, 57].map((height, i) => (
                <div key={i} className="w-full bg-gray-50 dark:bg-gray-700 rounded-t-lg relative group">
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t-lg transition-all duration-300 group-hover:bg-blue-600 dark:group-hover:bg-blue-700"
                    style={{ height: `${height}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {height}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { icon: Users, color: "blue", text: 'New user "John Doe" registered', time: "2 minutes ago" },
                { icon: Building2, color: "purple", text: 'Department "Marketing" updated', time: "1 hour ago" },
                { icon: ShieldCheck, color: "green", text: "Role permissions modified", time: "3 hours ago" },
                {
                  icon: AlertTriangle,
                  color: "yellow",
                  text: "New clash detected between departments",
                  time: "5 hours ago",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`p-2 bg-${item.color}-50 dark:bg-${item.color}-900 rounded-lg shrink-0`}>
                    <item.icon className={`h-5 w-5 text-${item.color}-500 dark:text-${item.color}-300`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{item.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-sm p-6 text-white">
            <Users className="h-8 w-8 mb-4" />
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-blue-100 text-sm mb-4">Manage system users and their roles</p>
            <button onClick={() => navigate("/dashboard/dev/users")} className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
              Manage Users
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 rounded-xl shadow-sm p-6 text-white">
            <Building2 className="h-8 w-8 mb-4" />
            <h3 className="font-semibold mb-2">Department Control</h3>
            <p className="text-purple-100 text-sm mb-4">Organize and manage departments</p>
            <button onClick={() => navigate("/dashboard/dev/departments")} className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors">
              View Departments
            </button>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 rounded-xl shadow-sm p-6 text-white">
            <ShieldCheck className="h-8 w-8 mb-4" />
            <h3 className="font-semibold mb-2">Role Configuration</h3>
            <p className="text-green-100 text-sm mb-4">Configure user roles and permissions</p>
            <button onClick={() => navigate("/dashboard/dev/roles")} className="px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 dark:hover:bg-gray-700 transition-colors">
              Manage Roles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

