"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, Clock } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { sprintBacklogService, sprintService, taskService } from "../../services"
import { toast } from "react-toastify"

const SprintBacklog = () => {
  const { sprintId } = useParams()
  const { user } = useAuth()
  const [sprintBacklog, setSprintBacklog] = useState(null)
  const [sprint, setSprint] = useState(null)
  const [userStories, setUserStories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSprintData = async () => {
      try {
        setLoading(true)

        // Fetch sprint details
        const sprintResponse = await sprintService.getSprintById(sprintId)
        setSprint(sprintResponse.data)

        // Fetch sprint backlog
        if (sprintResponse.data && sprintResponse.data.sprintBacklogId) {
          const backlogResponse = await sprintBacklogService.getSprintBacklogById(sprintResponse.data.sprintBacklogId)
          setSprintBacklog(backlogResponse.data)

          // Fetch user stories in this sprint backlog
          const storiesResponse = await sprintBacklogService.getUserStoriesInSprintBacklog(
            sprintResponse.data.sprintBacklogId,
          )
          setUserStories(storiesResponse.data || [])

          // Fetch tasks for this sprint
          // This is a mock - in a real app, you'd have an endpoint to get tasks by sprint ID
          const tasksResponse = await taskService.getAllTasks()
          // Filter tasks for this sprint (assuming there's a sprintId field)
          const sprintTasks = tasksResponse.data.filter((task) => task.sprintId === Number.parseInt(sprintId)) || []
          setTasks(sprintTasks)
        }
      } catch (error) {
        console.error("Error fetching sprint data:", error)
        toast.error("Failed to load sprint backlog")
      } finally {
        setLoading(false)
      }
    }

    fetchSprintData()
  }, [sprintId])

  const canEdit = user.role === "PRODUCT_OWNER" || user.role === "SCRUM_MASTER" || user.role === "ADMIN"

  // Group tasks by status
  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    TESTING: tasks.filter((task) => task.status === "TESTING"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to={`/sprints/${sprintId}`}
            className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sprint Backlog</h1>
            {sprint && <p className="text-sm text-gray-500 dark:text-gray-400">Sprint: {sprint.name}</p>}
          </div>
        </div>

        {canEdit && (
          <Link
            to={`/tasks/new?sprintId=${sprintId}`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            Add Task
          </Link>
        )}
      </div>

      {/* Sprint Info */}
      {sprint && (
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
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
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Left</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {sprint.endDate
                            ? Math.max(0, Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-3">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User Stories</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{userStories.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Board */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Task Board</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* To Do Column */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                To Do
              </h3>
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                {tasksByStatus.TODO.length}
              </span>
            </div>

            <div className="space-y-3">
              {tasksByStatus.TODO.length > 0 ? (
                tasksByStatus.TODO.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {task.estimatedHours || 0}h
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.assignedUserName || "Unassigned"}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No tasks</p>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                In Progress
              </h3>
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                {tasksByStatus.IN_PROGRESS.length}
              </span>
            </div>

            <div className="space-y-3">
              {tasksByStatus.IN_PROGRESS.length > 0 ? (
                tasksByStatus.IN_PROGRESS.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {task.estimatedHours || 0}h
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.assignedUserName || "Unassigned"}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No tasks</p>
              )}
            </div>
          </div>

          {/* Testing Column */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Testing
              </h3>
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                {tasksByStatus.TESTING.length}
              </span>
            </div>

            <div className="space-y-3">
              {tasksByStatus.TESTING.length > 0 ? (
                tasksByStatus.TESTING.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {task.estimatedHours || 0}h
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.assignedUserName || "Unassigned"}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No tasks</p>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Done
              </h3>
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                {tasksByStatus.DONE.length}
              </span>
            </div>

            <div className="space-y-3">
              {tasksByStatus.DONE.length > 0 ? (
                tasksByStatus.DONE.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {task.estimatedHours || 0}h
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.assignedUserName || "Unassigned"}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Stories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">User Stories</h2>
          {canEdit && (
            <Link
              to={`/backlogs/product/add-to-sprint/${sprintId}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Add User Story to Sprint
            </Link>
          )}
        </div>

        {userStories.length > 0 ? (
          <div className="space-y-4">
            {userStories.map((story) => (
              <div key={story.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                        {story.storyPoints || 0} pts
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Priority: {story.priority || "Not set"}
                      </span>
                    </div>
                    <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">{story.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {story.description || "No description provided"}
                    </p>
                  </div>

                  {canEdit && (
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Tasks: {tasks.filter((task) => task.userStoryId === story.id).length}
                    </p>
                    <Link
                      to={`/tasks/new?sprintId=${sprintId}&userStoryId=${story.id}`}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Add Task
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="mb-2">No user stories added to this sprint.</p>
            {canEdit && (
              <Link
                to={`/backlogs/product/add-to-sprint/${sprintId}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus size={16} className="mr-1" />
                Add user stories from product backlog
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SprintBacklog
