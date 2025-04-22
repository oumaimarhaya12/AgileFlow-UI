"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import ThemeToggle from "../components/common/ThemeToggle"

const AuthLayout = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Add more detailed debugging at the beginning of the component
  console.log("AuthLayout rendering with path:", location.pathname)

  console.log("AuthLayout rendering", {
    path: location.pathname,
    isAuthenticated,
    user,
    loading,
  })

  // Redirect to appropriate dashboard if already authenticated
  useEffect(() => {
    console.log("AuthLayout useEffect", {
      path: location.pathname,
      isAuthenticated,
      user,
      loading,
    })

    // Only redirect if authentication check is complete and user is authenticated
    if (!loading && isAuthenticated && user) {
      console.log("Redirecting authenticated user to dashboard")
      switch (user.role) {
        case "PRODUCT_OWNER":
          navigate("/dashboard/product-owner")
          break
        case "SCRUM_MASTER":
          navigate("/dashboard/scrum-master")
          break
        case "DEVELOPER":
          navigate("/dashboard/developer")
          break
        case "TESTER":
          navigate("/dashboard/tester")
          break
        case "ADMIN":
          navigate("/dashboard/admin")
          break
        default:
          break
      }
    }
  }, [isAuthenticated, user, navigate, loading, location.pathname])

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AgileFlow</h1>
            <p className="text-gray-600 dark:text-gray-400">Agile Project Management</p>
          </div>

          {/* Debug which route is being rendered */}
          <div className="text-center mb-4 text-gray-500">Current path: {location.pathname}</div>

          {/* Render children directly instead of using Outlet */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
