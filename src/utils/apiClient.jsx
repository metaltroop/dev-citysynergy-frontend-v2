import axios from "axios"

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []
let sessionExpiredModalShown = false

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const showSessionExpiredModal = () => {
  if (sessionExpiredModalShown) return

  sessionExpiredModalShown = true

  // Create modal elements
  const modalOverlay = document.createElement("div")
  modalOverlay.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"

  const modalContent = document.createElement("div")
  modalContent.className = "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-auto"

  const modalHeader = document.createElement("div")
  modalHeader.className = "flex items-center justify-between mb-4"

  const modalTitle = document.createElement("h3")
  modalTitle.className = "text-lg font-medium text-gray-900 dark:text-white"
  modalTitle.textContent = "Session Expired"

  const modalBody = document.createElement("div")
  modalBody.className = "mb-6"
  modalBody.innerHTML =
    '<p class="text-gray-700 dark:text-gray-300">Your session has expired or is invalid. Please log in again to continue.</p>'

  const modalFooter = document.createElement("div")
  modalFooter.className = "flex justify-end"

  const loginButton = document.createElement("button")
  loginButton.className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
  loginButton.textContent = "Log In"
  loginButton.onclick = () => {
    // Clear auth data and redirect to login
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("userData")

    sessionExpiredModalShown = false
    document.body.removeChild(modalOverlay)

    window.location.href = "/login"
  }

  // Assemble modal
  modalHeader.appendChild(modalTitle)
  modalFooter.appendChild(loginButton)

  modalContent.appendChild(modalHeader)
  modalContent.appendChild(modalBody)
  modalContent.appendChild(modalFooter)
  modalOverlay.appendChild(modalContent)

  // Add to body
  document.body.appendChild(modalOverlay)
}

const handleAuthError = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userData")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("userData")

  isRefreshing = false
  processQueue(new Error("Auth error"))

  // Show session expired modal instead of direct redirect
  showSessionExpiredModal()
}

const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )

    if (response?.data?.success && response.data.data.accessToken) {
      const newToken = response.data.data.accessToken
      localStorage.setItem("token", newToken)
      return newToken
    }
    throw new Error("Refresh token failed")
  } catch (error) {
    console.error("Token refresh failed:", error)
    throw error
  }
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Don't retry refresh token requests to avoid infinite loops
    if (originalRequest.url === "/auth/refresh-token") {
      handleAuthError()
      return Promise.reject(error)
    }

    // Check if it's an auth error and not already retrying
    if (
      (error.response?.data?.message === "Invalid or expired token" || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            handleAuthError()
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshToken()
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleAuthError()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient

