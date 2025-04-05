"use client"
import { useLocation } from "react-router-dom"
import ThemeToggle from "../../components/common/ThemeToggle"
import Signup from "./Signup"

const SignupPage = () => {
  const location = useLocation()

  console.log("SignupPage rendering at path:", location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AgileFlow</h1>
            <p className="text-gray-600 dark:text-gray-400">Agile Project Management</p>
          </div>

          <div className="text-center mb-4 text-blue-500">This is the dedicated SIGNUP page</div>

          <Signup />
        </div>
      </div>
    </div>
  )
}

export default SignupPage

