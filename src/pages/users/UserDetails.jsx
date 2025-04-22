"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, Mail, Calendar, Briefcase, CheckSquare, Shield } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { userService, projectService, taskService } from "../../services"
import { toast } from "react-toastify"

const UserDetails = () => {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)

        // Fetch user details
        const userResponse = await userService.getUserById(id)
        setUser(userResponse.data)

        // Fetch projects for this user
        const projectsResponse = await projectService.getProjectsByUser(id)
        setProjects(projectsResponse.data || [])

        // Fetch tasks assigned to this user
        const tasksResponse = await taskService.getAllTasks()
        // Filter tasks for this user (assuming there's an assignedUserId field)
        const userTasks = tasksResponse.data.filter((task) => task.assignedUserId === Number.parseInt(id)) || []
        setTasks(userTasks)
      } catch (error) {
        console.error("Error fetching user details:", error)
        toast.error("Failed to load user details")
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [id])

  const handleDelete = async () => {
    try {
      await userService.deleteUser(id)
      toast.success("User deleted successfully")
      navigate("/users")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  // Only admin can access this page
  if (currentUser.role !== "ADMIN") {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">User not found</p>
        <Link to="/users" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/users"
            className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h1>
            <span
              className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
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

        <div className="flex space-x-2">
          <Link
            to={`/users/${id}/edit`}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main User Details */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Details</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-4">
                <span className="text-xl font-medium">{user.username?.substring(0, 2).toUpperCase() || "U"}</span>
              </div>
              <div>
                <p className="text-xl font-medium text-gray-800 dark:text-white">{user.username}</p>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Mail size={16} className="mr-1" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Role</p>
                <p className="text-gray-800 dark:text-white">{user.role?.replace("_", " ") || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    user.active
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</p>
                <p className="text-gray-800 dark:text-white">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                <p className="text-gray-800 dark:text-white">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Projects</h3>

            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{project.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.description?.substring(0, 60) || "No description"}
                          {project.description?.length > 60 ? "..." : ""}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          project.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {project.status || "N/A"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">No projects assigned to this user.</p>
            )}
          </div>

          {/* Tasks */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tasks</h3>

            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{task.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description?.substring(0, 60) || "No description"}
                          {task.description?.length > 60 ? "..." : ""}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.status === "DONE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : task.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : task.status === "TESTING"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {task.status || "TODO"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">No tasks assigned to this user.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">User Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{projects.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-3">
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{tasks.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-3">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-3">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user.role?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to={`/users/${id}/edit`}
                className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Edit size={16} className="mr-2 text-blue-500" />
                Edit User
              </Link>

              <Link
                to={`/users/${id}/reset-password`}
                className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Shield size={16} className="mr-2 text-green-500" />
                Reset Password
              </Link>

              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Trash2 size={16} className="mr-2 text-red-500" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete the user "{user.username}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDetails
