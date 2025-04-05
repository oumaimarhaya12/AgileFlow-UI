"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Mail, Lock, AlertCircle } from "react-feather"
import { mockUsers } from "../../services/mockData"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const { login, loading } = useAuth()

  const validate = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validate()) {
      console.log("Submitting login form with:", { email, password })

      try {
        const success = await login(email, password)
        if (success) {
          console.log("Login successful, navigation will be handled by AuthLayout")
        } else {
          console.error("Login failed in component")
        }
      } catch (error) {
        console.error("Exception during login:", error)
      }
    }
  }

  // Function to navigate to signup page
  const goToSignup = (e) => {
    e.preventDefault()
    window.location.href = "/signup"
  }

  // Helper function to pre-fill the form for testing
  const fillTestCredentials = (e, userType) => {
    e.preventDefault()
    switch (userType) {
      case "admin":
        setEmail("admin@agileflow.com")
        break
      case "po":
        setEmail("po@agileflow.com")
        break
      case "sm":
        setEmail("sm@agileflow.com")
        break
      case "dev":
        setEmail("dev1@agileflow.com")
        break
      case "tester":
        setEmail("tester1@agileflow.com")
        break
      default:
        setEmail("admin@agileflow.com")
    }
    setPassword("password")
  }

  // Direct login function
  const handleDirectLogin = async (userType) => {
    let email
    switch (userType) {
      case "admin":
        email = "admin@agileflow.com"
        break
      case "po":
        email = "po@agileflow.com"
        break
      case "sm":
        email = "sm@agileflow.com"
        break
      case "dev":
        email = "dev1@agileflow.com"
        break
      case "tester":
        email = "tester1@agileflow.com"
        break
      default:
        email = "admin@agileflow.com"
    }

    console.log(`Attempting direct login for ${userType} with email ${email}`)
    const success = await login(email, "password")
    if (success) {
      window.location.reload()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Login to AgileFlow</h2>

      {/* Test credentials helper */}
      <div className="text-center mb-4 text-gray-600 dark:text-gray-400 text-sm">
        <p>Test credentials (click to fill):</p>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          <button
            onClick={(e) => fillTestCredentials(e, "admin")}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
          >
            Admin
          </button>
          <button
            onClick={(e) => fillTestCredentials(e, "po")}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
          >
            Product Owner
          </button>
          <button
            onClick={(e) => fillTestCredentials(e, "sm")}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
          >
            Scrum Master
          </button>
          <button
            onClick={(e) => fillTestCredentials(e, "dev")}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
          >
            Developer
          </button>
          <button
            onClick={(e) => fillTestCredentials(e, "tester")}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
          >
            Tester
          </button>
        </div>

        {/* Add direct login button */}
        <div className="mt-2">
          <button
            onClick={() => handleDirectLogin("admin")}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            One-Click Admin Login
          </button>
        </div>
      </div>

      {/* Available test users */}
      <div className="text-center mb-4 text-gray-600 dark:text-gray-400 text-xs">
        <p className="font-semibold">Available test users:</p>
        <ul className="mt-1">
          {mockUsers.map((user) => (
            <li key={user.id}>
              {user.email} ({user.role}) - password: "password"
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="#" onClick={goToSignup} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login

