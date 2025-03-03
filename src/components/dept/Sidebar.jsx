"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  AlertCircle,
  Package,
  Users,
  Shield,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  X,
  Sun,
  Moon,
} from "lucide-react"

const navItems = [
  { path: "/dashboard/dept", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/dept/tenders", label: "Tenders", icon: FileText },
  { path: "/dashboard/dept/clashes", label: "Clashes", icon: AlertTriangle },
  { path: "/dashboard/dept/issues", label: "Issues", icon: AlertCircle },
  { path: "/dashboard/dept/inventory", label: "Inventory", icon: Package },
  { path: "/dashboard/dept/users", label: "Users", icon: Users },
  { path: "/dashboard/dept/roles", label: "Roles", icon: Shield },
  { path: "/dashboard/dept/features", label: "Features", icon: Settings },
]

const quickLinks = [{ label: "Logout", icon: LogOut }]

const Sidebar = ({ isMobile, isCollapsed, isOpen, onToggleCollapse, darkMode, toggleDarkMode }) => {
  const location = useLocation()
  const [hoverIndex, setHoverIndex] = useState(null)
  const { logout } = useAuth()

  // Handle closing sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (isMobile && isOpen) {
      onToggleCollapse(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    handleLinkClick()
  }

  return (
    <>
      {/* Backdrop for mobile - with animation */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-20 dark:bg-black/40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => onToggleCollapse(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Always render but translate off-screen when closed on mobile */}
      <aside
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-30" : "relative"} 
          ${isCollapsed && !isMobile ? "w-20" : "w-64"} 
          bg-white dark:bg-gray-800 min-h-screen shadow-md flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Logo area */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AdminPanel
            </h2>
          )}

          <button
            onClick={() => onToggleCollapse(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMobile ? (
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Main navigation */}
        <nav className="p-3 flex-grow overflow-y-auto">
          <div className={`${!isCollapsed || isMobile ? "mb-3 px-3" : "mb-2"}`}>
            {(!isCollapsed || isMobile) && (
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">Main Navigation</p>
            )}
            {isCollapsed && !isMobile && <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>}
          </div>

          <div className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                } ${hoverIndex === index ? "shadow-sm" : ""}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div
                  className={`${
                    location.pathname === item.path ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-100 dark:bg-gray-700"
                  } p-2 rounded-lg mr-3`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      location.pathname === item.path
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                </div>
                {(!isCollapsed || isMobile) && (
                  <span className={`font-medium ${location.pathname === item.path && "font-semibold"}`}>
                    {item.label}
                  </span>
                )}
                {(!isCollapsed || isMobile) && location.pathname === item.path && (
                  <div className="ml-auto w-1.5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Quick links / footer */}
        <div className="mt-auto p-3 border-t border-gray-100 dark:border-gray-700">
          {(!isCollapsed || isMobile) && (
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold px-3 mb-2">Quick Links</p>
          )}
          <div className="space-y-1">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                {darkMode ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              {(!isCollapsed || isMobile) && (
                <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
              )}
            </button>

            {quickLinks.map((item) => (
              <a
                key={item.label}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (item.label === "Logout") {
                    handleLogout()
                  } else {
                    handleLinkClick()
                  }
                }}
                className="flex items-center px-3 py-2.5 rounded-lg transition-all text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                  <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                {(!isCollapsed || isMobile) && <span className="font-medium">{item.label}</span>}
              </a>
            ))}
          </div>
        </div>

        {/* User profile */}
        {!isCollapsed || isMobile ? (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                JD
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex justify-center">
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
              JD
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar

