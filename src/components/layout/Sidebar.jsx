"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Home, Briefcase, List, Calendar, CheckSquare, Users, Settings, LogOut, X } from "react-feather"

const Sidebar = ({ isOpen, toggleSidebar, userRole, isMobile }) => {
  const { logout } = useAuth()

  // Define navigation items based on user role
  const getNavItems = () => {
    const items = []

    // Dashboard - All roles
    items.push({
      to: `/dashboard/${userRole.toLowerCase().replace("_", "-")}`,
      icon: <Home size={20} />,
      label: "Dashboard",
    })

    // Projects - All roles except Tester
    if (["PRODUCT_OWNER", "SCRUM_MASTER", "DEVELOPER", "ADMIN"].includes(userRole)) {
      items.push({
        to: "/projects",
        icon: <Briefcase size={20} />,
        label: "Projects",
      })
    }

    // Backlogs - Product Owner, Scrum Master, Admin
    if (["PRODUCT_OWNER", "SCRUM_MASTER", "ADMIN"].includes(userRole)) {
      items.push({
        to: "/backlogs/product",
        icon: <List size={20} />,
        label: "Backlogs",
      })
    }

    // Sprints - Product Owner, Scrum Master, Admin
    if (["PRODUCT_OWNER", "SCRUM_MASTER", "ADMIN"].includes(userRole)) {
      items.push({
        to: "/sprints",
        icon: <Calendar size={20} />,
        label: "Sprints",
      })
    }

    // Tasks - All roles
    items.push({
      to: "/tasks",
      icon: <CheckSquare size={20} />,
      label: "Tasks",
    })

    // Users - Admin only
    if (userRole === "ADMIN") {
      items.push({
        to: "/users",
        icon: <Users size={20} />,
        label: "Users",
      })
    }

    // Settings - All roles
    items.push({
      to: "/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    })

    return items
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">AgileFlow</h2>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center px-4 py-2 text-sm font-medium rounded-md
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
