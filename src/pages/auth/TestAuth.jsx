"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const TestAuth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState("unknown")

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Try to reach the server with a simple request
        await axios.get("http://localhost:8084/api/auth", {
          timeout: 3000,
          validateStatus: (status) => {
            return status < 500 // Accept any status code less than 500
          },
        })
        setServerStatus("online")
      } catch (err) {
        console.error("Server status check failed:", err)
        setServerStatus("offline")

        // Add more detailed error information
        if (err.code === "ECONNREFUSED") {
          setError({
            type: "Connection Error",
            message: "Connection refused. Make sure your Spring Boot application is running on port 8084.",
          })
        } else {
          setError({
            type: "Connection Error",
            message: err.message,
            code: err.code,
          })
        }
      }
    }

    checkServerStatus()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      console.log("Sending direct login request to backend")

      // Log the full request details
      console.log("Request URL:", "http://localhost:8084/api/auth/login")
      console.log("Request payload:", { email, password })

      const result = await axios.post(
        "http://localhost:8084/api/auth/login",
        {
          email,
          password,
        },
        {
          // Add these options to help with debugging
          timeout: 10000, // 10 second timeout
          headers: {
            "Content-Type": "application/json",
          },
          // Disable CORS protection for testing
          withCredentials: false,
        },
      )

      console.log("Login response:", result)
      setResponse(result.data)
    } catch (err) {
      console.error("Login error:", err)

      // More detailed error logging
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", err.response.data)
        console.error("Error status:", err.response.status)
        console.error("Error headers:", err.response.headers)
        setError({
          type: "Response Error",
          status: err.response.status,
          data: err.response.data,
          message: err.message,
        })
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request)
        setError({
          type: "No Response",
          message: "The server did not respond. Please check if your backend is running.",
          request: "Request was sent but no response received",
        })
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message)
        setError({
          type: "Request Setup Error",
          message: err.message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Test Authentication</h2>
      <div
        className={`text-center mb-4 p-2 rounded ${
          serverStatus === "online"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : serverStatus === "offline"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        }`}
      >
        Backend server status: {serverStatus === "unknown" ? "Checking..." : serverStatus}
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Testing..." : "Test Login"}
          </button>
        </div>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-md">
          <h3 className="font-medium text-green-800 dark:text-green-200">Success Response:</h3>
          <pre className="mt-2 text-sm overflow-auto max-h-60">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-md">
          <h3 className="font-medium text-red-800 dark:text-red-200">Error Response:</h3>
          <pre className="mt-2 text-sm overflow-auto max-h-60">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default TestAuth

