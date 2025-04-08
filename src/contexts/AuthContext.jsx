"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { authService } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function that connects to the backend
  const login = async (username, password) => {
    try {
      setLoading(true)
      console.log("Attempting login with:", { username, password })

      const response = await authService.login({ username, password })
      console.log("Login response:", response)

      // Extract user data from response
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
      }

      // Store token and user data
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      toast.success("Login successful!")
      return true
    } catch (error) {
      console.error("Login failed:", error)

      // More detailed error logging
      if (error.response) {
        console.error("Error status:", error.response.status)
        console.error("Error data:", error.response.data)
      }

      const errorMessage = error.response?.data?.message || "Login failed. Please try again."
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      console.log("Attempting signup with:", userData)

      const response = await authService.signup(userData)
      console.log("Signup response:", response)

      toast.success("Registration successful! Please login.")
      return true
    } catch (error) {
      console.error("Signup failed:", error)

      // More detailed error logging
      if (error.response) {
        console.error("Error status:", error.response.status)
        console.error("Error data:", error.response.data)
      }

      const errorMessage = error.response?.data?.message || "Registration failed. Please try again."
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    toast.info("You have been logged out.")
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
