"\"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, CheckSquare, List, Users, Plus } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { sprintService, taskService, userService } from "../../services"
import { toast } from "react-toastify"

const SprintDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sprint, setSprint] = useState(null)
  const [tasks, setTasks] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchSprintDetails = async () => {
      try {
        setLoading(true)

        // Fetch sprint details
        const sprintResponse = await sprintService.getSprintById(id)
        setSprint(sprintResponse.data)

        // Fetch tasks for this sprint
        // This is a mock - in a real app, you'd have an endpoint to get tasks by sprint ID
        const tasksResponse = await taskService.getAllTasks()
        // Filter tasks for this sprint (assuming there's a sprintId field)
        const sprintTasks = tasksResponse.data.filter((task) => task.sprintId === Number.parseInt(id)) || []
        setTasks(sprintTasks)

        // Fetch team members
        // This is a mock - in a real app, you'd have an endpoint to get team members by sprint ID
        const teamResponse = await userService.getAllUsers()
        // In a real app, you'd filter users assigned to this sprint
        setTeamMembers(teamResponse.data.slice(0, 5) || [])
      } catch (error) {
        console.error("Error fetching sprint details:", error)
        toast.error("Failed to load sprint details")
      } finally {
        setLoading(false)
      }
    }

    fetchSprintDetails()
  }, [id])

  const handleDelete = async () => {
    try {
      await sprintService.deleteSprint(id)
      toast.success("Sprint deleted successfully")
      navigate("/sprints")
    } catch (error) {
      console.error("Error deleting sprint:", error)
      toast.error("Failed to delete sprint")
    }
  }

  const canEdit = user.role === "PRODUCT_OWNER" || user.role === "SCRUM_MASTER" || user.role === "ADMIN"

  // Calculate sprint progress
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "DONE").length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!sprint) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">Sprint not found</p>
        <Link to="/sprints" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Sprints
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
            to="/sprints"
            className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{sprint.name}</h1>
            <span
              className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                new Date() < new Date(sprint.startDate)
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : new Date() > new Date(sprint.endDate)
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              {new Date() < new Date(sprint.startDate)
                ? "UPCOMING"
                : new Date() > new Date(sprint.endDate)
                  ? "COMPLETED"
                  : "ACTIVE"}
            </span>
          </div>
        </div>

        {canEdit && (
          <div className="flex space-x-2">
            <Link
              to={`/sprints/${id}/edit`}
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
        )}
      </div>

      {/* Sprint Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sprint Details</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="text-gray-800 dark:text-white">
                    {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="text-gray-800 dark:text-white">
                    {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                <p className="text-gray-800 dark:text-white">
                  {sprint.startDate && sprint.endDate
                    ? `${Math.ceil((new Date(sprint.endDate) - new Date(sprint.startDate)) / (1000 * 60 * 60 * 24))} days`
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Remaining</p>
                <p className="text-gray-800 dark:text-white">
                  {new Date() < new Date(sprint.startDate)
                    ? `Starts in ${Math.ceil((new Date(sprint.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days`
                    : new Date() > new Date(sprint.endDate)
                      ? `Ended ${Math.ceil((new Date() - new Date(sprint.endDate)) / (1000 * 60 * 60 * 24))} days ago`
                      : `${Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sprint Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{progressPercentage}%</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                      <CheckSquare size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{totalTasks}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-3">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Members</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{teamMembers.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to={`/backlogs/sprint/${id}`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
              <List size={20} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white">Sprint Backlog</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">View and manage sprint tasks</p>
            </div>
          </div>
        </Link>

        <Link
          to={`/tasks?sprintId=${id}`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-3">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white">Tasks</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage sprint tasks</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tasks Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Tasks Overview</h2>
          <Link to={`/backlogs/sprint/${id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To Do</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {tasks.filter((task) => task.status === "TODO").length}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {tasks.filter((task) => task.status === "IN_PROGRESS").length}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Testing</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {tasks.filter((task) => task.status === "TESTING").length}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Done</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {tasks.filter((task) => task.status === "DONE").length}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Recent Tasks</h3>
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{task.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.assignedUserName || "Unassigned"}
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
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="mb-2">No tasks found for this sprint.</p>
            <Link
              to={`/tasks/new?sprintId=${id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Plus size={16} className="mr-1" />
              Add your first task
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this sprint? This action cannot be undone.
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

export default SprintDetails
