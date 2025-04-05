"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { mockUsers } from "../services/mockData"

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

  // Direct mock login implementation
  const login = async (email, password) => {
    try {
      setLoading(true)
      console.log("Attempting login with:", { email, password })

      // Find user by email
      const user = mockUsers.find((u) => u.email === email)
      console.log("Found user:", user)

      if (!user || password !== "password") {
        console.error("Login failed: Invalid credentials")
        throw new Error("Invalid email or password")
      }

      if (!user.active) {
        console.error("Login failed: Account inactive")
        throw new Error("Account is inactive")
      }

      // Create user data object
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }

      // Save token and user data
      const token = `mock-jwt-token-${user.id}`
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      toast.success("Login successful!")
      return true
    } catch (error) {
      console.error("Login failed:", error)
      toast.error(error.message || "Login failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      console.log("Attempting signup with:", userData)

      // Check if email already exists
      if (mockUsers.some((u) => u.email === userData.email)) {
        throw new Error("Email already in use")
      }

      // Check if username already exists
      if (mockUsers.some((u) => u.username === userData.username)) {
        throw new Error("Username already in use")
      }

      toast.success("Registration successful! Please login.")
      return true
    } catch (error) {
      console.error("Signup failed:", error)
      toast.error(error.message || "Registration failed. Please try again.")
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

