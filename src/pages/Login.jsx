import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import mhlogo from "../assets/mhgovlogo.png";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setIsLoading } = useLoading();

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    try {
    setIsLoading(true);

      const result = await login(email, password)
      if (result.requiresOTP) {
        navigate("/verify-otp", { state: { email, isFirstLogin: true } })
      }
      // If login is successful, the AuthContext will handle the redirection
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <div className="bg-white flex items-center justify-center w-full h-screen relative">
      <img
        src="./loginboy.png"
        className="absolute z-0 4xl:-translate-x-[70%] 3xl:-translate-x-[60%] 2xl:-translate-x-[50%] xl:-translate-x-[45%] -translate-x-[100%] -translate-y-20"
        alt=""
      />
      <div className="bg-[#f5f5f5] 2xl:w-1/4 xl:w-1/4 2xl:h-[85%] xl:h-3/4 w-full h-full p-5 rounded-2xl shadow-xl z-10">
        <div className="p-2">
          <div className="flex justify-end mb-4">
            <p>: )</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={mhlogo} alt="Logo" className="w-20 h-20 mb-4" />
            <h2 className="text-xl sm:text-3xl font-semibold">CITY SYNERGY</h2>
            <p className="text-center text-gray-500 mt-2 mb-8">Welcome Back!</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="relative mb-6">
              <label
                className={`absolute left-2 transition-all duration-200 transform ${
                  emailFocused ? "-top-2.5 text-sm bg-white px-1" : "top-4 text-base"
                } text-gray-500`}
              >
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 pt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={() => setEmailFocused(true)}
                onBlur={(e) => setEmailFocused(e.target.value !== "")}
              />
            </div>

            <div className="relative mb-6">
              <label
                className={`absolute left-2 transition-all duration-200 transform ${
                  passwordFocused ? "-top-2.5 text-sm bg-white px-1" : "top-4 text-base"
                } text-gray-500`}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={() => setPasswordFocused(true)}
                onBlur={(e) => setPasswordFocused(e.target.value !== "")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex items-center mb-6">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`relative w-11 h-6 transition-colors duration-300 rounded-full ${
                  rememberMe ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                    rememberMe ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <label className="ml-3 text-sm text-gray-600">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 mb-4"
            >
              LOGIN
            </button>
          </form>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};