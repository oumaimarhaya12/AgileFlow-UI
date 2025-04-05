import axios from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8084", // Updated to match your Spring Boot server port
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      // Use Bearer token format as expected by your backend
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log all API requests for debugging
    console.log(`${config.method.toUpperCase()} request to ${config.url}`, config)

    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Add a response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response)
    return response
  },
  (error) => {
    // Log detailed error information
    console.error("API Error:", error)

    if (error.response) {
      console.error("Error response status:", error.response.status)
      console.error("Error response data:", error.response.data)
      console.error("Error response headers:", error.response.headers)
    } else if (error.request) {
      console.error("No response received. Request:", error.request)
      console.error("Request URL:", error.config.url)
      console.error("Request method:", error.config.method)
      console.error("Request headers:", error.config.headers)
    } else {
      console.error("Error message:", error.message)
    }

    console.error("Error config:", error.config)

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access detected, redirecting to login")
      // Clear local storage and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api

