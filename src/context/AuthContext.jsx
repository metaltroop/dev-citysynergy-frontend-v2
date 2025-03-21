"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "../utils/apiClient"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [permissions, setPermissions] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated on initial load
    const token = localStorage.getItem("token")
    const userData = JSON.parse(localStorage.getItem("userData"))
    const permissionsData = JSON.parse(localStorage.getItem("permissions"))
    
    if (token && userData) {
      setUser(userData)
      setPermissions(permissionsData)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      })

      if (response.data.success) {
        if (response.data.data.requiresOTP) {
          return { requiresOTP: true, email: response.data.data.email }
        }

        const { user, accessToken, permissions } = response.data.data

        localStorage.setItem("token", accessToken)
        localStorage.setItem("userData", JSON.stringify(user))
        localStorage.setItem("permissions", JSON.stringify(permissions))
        
        setUser(user)
        setPermissions(permissions)
        setIsAuthenticated(true)
        navigate(user.type === "dev" ? "/dashboard/dev" : "/dashboard/dept")
        return { success: true }
      }
      throw new Error(response.data.message || "Login failed")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    localStorage.removeItem("permissions")
    localStorage.removeItem("profileImage")

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })

    setUser(null)
    setPermissions(null)
    setIsAuthenticated(false)
    navigate("/login")
  }

  const verifyOtp = async (email, otp, newPassword) => {
    try {
      const response = await apiClient.post("/auth/verify-otp", {
        email,
        otp,
        newPassword,
      })

      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || "OTP verification failed")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      throw error
    }
  }

  // Helper function to check if user has specific permission for a feature
  const hasPermission = (featureId, permissionType) => {
    if (!permissions || !permissions.roles || permissions.roles.length === 0) {
      return false
    }

    // Look through all roles
    for (const role of permissions.roles) {
      // Find the feature in this role
      const feature = role.features.find(f => f.id === featureId)
      
      // If feature exists and has the requested permission
      if (feature && feature.permissions && feature.permissions[permissionType]) {
        return true
      }
    }
    
    return false
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        permissions, 
        login, 
        logout, 
        verifyOtp,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Move this to a separate hook file like useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export AuthContext if needed elsewhere
export { AuthContext }

