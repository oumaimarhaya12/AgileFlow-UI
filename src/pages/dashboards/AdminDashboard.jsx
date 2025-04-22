"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
  Users,
  Briefcase,
  CheckSquare,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Database,
  Calendar,
  List,
  Plus,
} from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { toast } from "react-toastify"

// Update the AdminDashboard component to include more admin-specific features
const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalSprints: 0,
    totalBacklogs: 0,
    totalUserStories: 0,
  })
  const [usersByRole, setUsersByRole] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch users - Admin has full access to user endpoints
        let users = []
        try {
          const usersResponse = await axios.get("/api/users")
          users = usersResponse.data || []
        } catch (error) {
          console.error("Error fetching users:", error)
          toast.warning("Using mock user data due to API error")
          users = [
            { id: 1, username: "admin", email: "admin@example.com", role: "ADMIN", active: true },
            { id: 2, username: "productowner", email: "po@example.com", role: "PRODUCT_OWNER", active: true },
            { id: 3, username: "scrummaster", email: "sm@example.com", role: "SCRUM_MASTER", active: true },
            { id: 4, username: "developer1", email: "dev1@example.com", role: "DEVELOPER", active: true },
            { id: 5, username: "developer2", email: "dev2@example.com", role: "DEVELOPER", active: true },
            { id: 6, username: "tester1", email: "tester1@example.com", role: "TESTER", active: true },
            { id: 7, username: "inactive", email: "inactive@example.com", role: "DEVELOPER", active: false },
          ]
        }

        // Fetch projects - Admin has full access to project endpoints
        let projects = []
        try {
          const projectsResponse = await axios.get("/api/projects")
          projects = projectsResponse.data || []
        } catch (error) {
          console.error("Error fetching projects:", error)
          toast.warning("Using mock project data due to API error")
          projects = [
            {
              id: 1,
              projectName: "AgileFlow Development",
              description: "Development of the AgileFlow application",
              status: "ACTIVE",
            },
            {
              id: 2,
              projectName: "Website Redesign",
              description: "Redesign of the company website",
              status: "ACTIVE",
            },
            { id: 3, projectName: "Mobile App", description: "Mobile application development", status: "ACTIVE" },
          ]
        }

        // Fetch tasks - Admin has read access to tasks
        let tasks = []
        try {
          const tasksResponse = await axios.get("/api/tasks")
          tasks = tasksResponse.data || []
        } catch (error) {
          console.error("Error fetching tasks:", error)
          toast.warning("Using mock task data due to API error")
          tasks = Array(25)
            .fill(null)
            .map((_, i) => ({ id: i + 1 }))
        }

        // Fetch sprints - Admin has full access to sprints
        let sprints = []
        try {
          const sprintsResponse = await axios.get("/api/sprints")
          sprints = sprintsResponse.data || []
        } catch (error) {
          console.error("Error fetching sprints:", error)
          toast.warning("Using mock sprint data due to API error")
          sprints = Array(5)
            .fill(null)
            .map((_, i) => ({ id: i + 1 }))
        }

        // Fetch product backlogs - Admin has full access
        let productBacklogs = []
        try {
          const backlogsResponse = await axios.get("/api/productbacklogs")
          productBacklogs = backlogsResponse.data || []
        } catch (error) {
          console.error("Error fetching product backlogs:", error)
          toast.warning("Using mock backlog data due to API error")
          productBacklogs = Array(3)
            .fill(null)
            .map((_, i) => ({ id: i + 1 }))
        }

        // Fetch user stories - Admin has read access
        let userStories = []
        try {
          const userStoriesResponse = await axios.get("/api/userstories")
          userStories = userStoriesResponse.data || []
        } catch (error) {
          console.error("Error fetching user stories:", error)
          toast.warning("Using mock user story data due to API error")
          userStories = Array(15)
            .fill(null)
            .map((_, i) => ({ id: i + 1 }))
        }

        // Calculate stats
        const activeUsers = users.filter((user) => user.active).length

        // Count users by role
        const roleCount = {
          PRODUCT_OWNER: 0,
          SCRUM_MASTER: 0,
          DEVELOPER: 0,
          TESTER: 0,
          ADMIN: 0,
        }

        users.forEach((user) => {
          if (user.role in roleCount) {
            roleCount[user.role]++
          }
        })

        const roleData = Object.keys(roleCount).map((role) => ({
          name: role.replace("_", " "),
          value: roleCount[role],
        }))

        setStats({
          totalUsers: users.length,
          activeUsers,
          inactiveUsers: users.length - activeUsers,
          totalProjects: projects.length,
          totalTasks: tasks.length,
          totalSprints: sprints.length,
          totalBacklogs: productBacklogs.length,
          totalUserStories: userStories.length,
        })

        setUsersByRole(roleData)
        setRecentUsers(users.slice(0, 5))
        setRecentProjects(projects.slice(0, 3))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")

        // Set default values if everything fails
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          totalProjects: 0,
          totalTasks: 0,
          totalSprints: 0,
          totalBacklogs: 0,
          totalUserStories: 0,
        })

        setUsersByRole([])
        setRecentUsers([])
        setRecentProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Update the return statement to include more admin-specific sections
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.username}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-4">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-4">
              <UserX size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive Users</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.inactiveUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-4">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-4">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sprints</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalSprints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200 mr-4">
              <List size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Product Backlogs</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalBacklogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-200 mr-4">
              <Database size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User Stories</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalUserStories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Users by Role</h2>
          {usersByRole.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
              No user data available
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Users</h2>
            <Link to="/users" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <Link
                    key={user.id}
                    to={`/users/${user.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-3">
                          <span className="text-sm font-medium">
                            {user.username?.substring(0, 2).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{user.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : user.role === "PRODUCT_OWNER"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : user.role === "SCRUM_MASTER"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                  : user.role === "DEVELOPER"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {user.role?.replace("_", " ") || "N/A"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No users found.</p>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/users/new"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus size={16} className="mr-2" />
              Add New User
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project.id || project.projectId}
                  to={`/projects/${project.id || project.projectId}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                      <Briefcase size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {project.projectName || project.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === "ACTIVE"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {project.status || "ACTIVE"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {project.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-gray-500 dark:text-gray-400">No projects found.</div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/projects/new"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Create New Project
          </Link>
        </div>
      </div>

      {/* System Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/users"
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
              <Users size={16} />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">User Management</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage system users</p>
            </div>
          </Link>

          <Link
            to="/projects"
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-3">
              <Briefcase size={16} />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Project Management</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage all projects</p>
            </div>
          </Link>

          <Link
            to="/cors-test"
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <div className="p-2 rounded-md bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-3">
              <Shield size={16} />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Security Settings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">CORS and API security</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/users/new"
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus size={16} className="mr-2" />
            Add New User
          </Link>
          <Link
            to="/projects/new"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Plus size={16} className="mr-2" />
            Create Project
          </Link>
          <Link
            to="/settings"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Shield size={16} className="mr-2" />
            System Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
