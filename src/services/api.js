import axios from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8084", // Spring Boot server port
  headers: {
    "Content-Type": "application/json",
  },
  // Add withCredentials: false to prevent CORS preflight issues
  withCredentials: false,
})

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      // Use Bearer token format as expected by your Spring Boot security
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log all API requests for debugging
    console.log(`${config.method?.toUpperCase()} request to ${config.url}`, {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
    })

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
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data,
      headers: response.headers,
    })
    return response
  },
  (error) => {
    // Log detailed error information
    console.error("API Error:", error)

    if (error.response) {
      console.error("Error response status:", error.response.status)
      console.error("Error response data:", error.response.data)
      console.error("Error response headers:", error.response.headers)
      console.error("Request that caused error:", {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
        params: error.config.params,
      })
    } else if (error.request) {
      console.error("No response received. Request:", error.request)
      console.error("Request URL:", error.config.url)
      console.error("Request method:", error.config.method)
      console.error("Request headers:", error.config.headers)
    } else {
      console.error("Error message:", error.message)
    }

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access detected, redirecting to login")
      // Clear local storage and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api

