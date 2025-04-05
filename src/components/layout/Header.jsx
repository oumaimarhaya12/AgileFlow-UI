"use client"

import { useNavigate } from "react-router-dom"
import { Menu, Bell, User } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import ThemeToggle from "../common/ThemeToggle"

const Header = ({ toggleSidebar, sidebarOpen, user }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleProfileClick = () => {
    // Navigate to profile page or show dropdown
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow-sm z-10 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />

        <div className="relative">
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="flex items-center">
          <div className="hidden md:block mr-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role.replace("_", " ")}</p>
          </div>

          <button
            onClick={handleProfileClick}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

