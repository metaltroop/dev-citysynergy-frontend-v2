"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useLoading } from "../context/LoadingContext"

export const OTPVerification = () => {
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [timer, setTimer] = useState(120)
  const [error, setError] = useState("")
  const { state } = useLocation()
  const navigate = useNavigate()
  const { verifyOtp } = useAuth()
  const { setIsLoading } = useLoading()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!state?.email) {
    return <Navigate to="/login" replace />
  }

  // Handle OTP input boxes
  // const handleChange = (index, value) => {
  //   if (/^\d+$/.test(value) || value === "") {
  //     const newOtp = [...otp]
  //     newOtp[index] = value
  //     setOtp(newOtp)

  //     // Auto-focus next input
  //     if (value !== "" && index < 5) {
  //       document.getElementById(`otp-${index + 1}`).focus()
  //     }
  //   }
  // }

  // Handle resend OTP
  const handleResend = async () => {
    try {
      setIsLoading(true)
      // Implement resend OTP logic here
      setTimer(120)
    } catch (error) {
      console.error("Resend failed:", error)
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle verification
  const handleVerify = async (e) => {
    e.preventDefault()
    setError("")

    if (state.isFirstLogin && (!newPassword || newPassword !== confirmPassword)) {
      setError("Passwords do not match or are empty")
      return
    }

    try {
      setIsLoading(true)
      const result = await verifyOtp(state.email, otp, newPassword)

      if (result.success) {
        navigate("/login", { replace: true })
      }
    } catch (error) {
      setError(error.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {state.isFirstLogin ? "First Login - Set Password" : "Verify OTP"}
        </h2>
        <p className="text-gray-600 mb-6 text-center">Enter the 6-digit code sent to {state.email}</p>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div> */}
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {state.isFirstLogin && (
            <>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {state.isFirstLogin ? "Verify & Set Password" : "Verify"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">{timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}</p>
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`text-blue-600 ${timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  )
}

