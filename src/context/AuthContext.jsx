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
        const response = await apiClient.post('/auth/login', { 
            email, 
            password 
        });
        
        if (response.data.success) {
            if (response.data.data.requiresOTP) {
                return { requiresOTP: true, email: response.data.data.email };
            }

            const { user, accessToken } = response.data.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userData', JSON.stringify(user));
            setUser(user);
            setIsAuthenticated(true);
            navigate(user.type === 'dev' ? '/dashboard/dev' : '/dashboard/dept');
            return { success: true };
        }
        throw new Error(response.data.message || 'Login failed');
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    setUser(null)
    setIsAuthenticated(false)
    navigate("/login")
  }

  const verifyOtp = async (email, otp, newPassword) => {
    try {
      // Simulating API call
      const response = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await response.json()

      if (data.success) {
        return { success: true, message: data.message }
      } else {
        throw new Error(data.message || "OTP verification failed")
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

export const useAuth = () => useContext(AuthContext)

