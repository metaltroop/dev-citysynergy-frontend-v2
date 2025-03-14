"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "../utils/apiClient"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated on initial load
    const token = localStorage.getItem("token")
    const userData = JSON.parse(localStorage.getItem("userData"))
    if (token && userData) {
      setUser(userData)
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

        // Add permissions to user object
        const userWithPermissions = {
          ...user,
          permissions,
        }

        localStorage.setItem("token", accessToken)
        localStorage.setItem("userData", JSON.stringify(userWithPermissions))
        setUser(userWithPermissions)
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
    localStorage.removeItem("profileImage")

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })

    setUser(null)
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, verifyOtp }}>{children}</AuthContext.Provider>
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

