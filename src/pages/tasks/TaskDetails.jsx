"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, User, MessageSquare } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { taskService } from "../../services"
import { toast } from "react-toastify"

const TaskDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [logHours, setLogHours] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true)
        const response = await taskService.getTaskById(id)
        setTask(response.data)
      } catch (error) {
        console.error("Error fetching task details:", error)
        toast.error("Failed to load task details")
      } finally {
        setLoading(false)
      }
    }

    fetchTaskDetails()
  }, [id])

  const handleStatusChange = async (newStatus) => {
    try {
      await taskService.updateStatus(id, newStatus)
      setTask({ ...task, status: newStatus })
      toast.success(`Task status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Failed to update task status")
    }
  }

  const handleLogHours = async (e) => {
    e.preventDefault()
    if (!logHours || isNaN(logHours) || Number.parseFloat(logHours) <= 0) {
      toast.error("Please enter a valid number of hours")
      return
    }

    try {
      await taskService.logHours(id, Number.parseFloat(logHours))
      toast.success(`Logged ${logHours} hours successfully`)
      setLogHours("")
      // Refresh task data
      const response = await taskService.getTaskById(id)
      setTask(response.data)
    } catch (error) {
      console.error("Error logging hours:", error)
      toast.error("Failed to log hours")
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    try {
      await taskService.addComment(id, user.id, comment)
      toast.success("Comment added successfully")
      setComment("")
      // Refresh task data
      const response = await taskService.getTaskById(id)
      setTask(response.data)
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    }
  }

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(id)
      toast.success("Task deleted successfully")
      navigate("/tasks")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  const canEdit =
    user.role === "PRODUCT_OWNER" ||
    user.role === "SCRUM_MASTER" ||
    user.role === "DEVELOPER" ||
    user.role === "ADMIN" ||
    (task && task.assignedUserId === user.id)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">Task not found</p>
        <Link to="/tasks" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Tasks
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
            to="/tasks"
            className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
              <span
                className={`ml-4 px-2 py-1 text-xs rounded-full ${
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
            {task.sprintName && <p className="text-sm text-gray-500 dark:text-gray-400">Sprint: {task.sprintName}</p>}
          </div>
        </div>

        {canEdit && (
          <div className="flex space-x-2">
            <Link
              to={`/tasks/${id}/edit`}
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

      {/* Task Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Task Details */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Task Details</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</p>
              <p className="text-gray-800 dark:text-white whitespace-pre-line">
                {task.description || "No description provided"}
              </p>
            </div>

            {task.userStoryTitle && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User Story</p>
                <p className="text-gray-800 dark:text-white">{task.userStoryTitle}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    task.priority === 1
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : task.priority === 2
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {task.priority === 1 ? "High" : task.priority === 2 ? "Medium" : "Low"}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</p>
                <p className="text-gray-800 dark:text-white">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estimated Hours</p>
                <p className="text-gray-800 dark:text-white">{task.estimatedHours || 0} hours</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Logged Hours</p>
                <p className="text-gray-800 dark:text-white">{task.loggedHours || 0} hours</p>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          {canEdit && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange("TODO")}
                  disabled={task.status === "TODO"}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    task.status === "TODO"
                      ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  To Do
                </button>

                <button
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                  disabled={task.status === "IN_PROGRESS"}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    task.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-400 cursor-not-allowed"
                      : "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 hover:bg-blue-300 dark:hover:bg-blue-700"
                  }`}
                >
                  In Progress
                </button>

                <button
                  onClick={() => handleStatusChange("TESTING")}
                  disabled={task.status === "TESTING"}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    task.status === "TESTING"
                      ? "bg-yellow-100 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-400 cursor-not-allowed"
                      : "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 hover:bg-yellow-300 dark:hover:bg-yellow-700"
                  }`}
                >
                  Testing
                </button>

                <button
                  onClick={() => handleStatusChange("DONE")}
                  disabled={task.status === "DONE"}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    task.status === "DONE"
                      ? "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-400 cursor-not-allowed"
                      : "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700"
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Log Hours Form */}
          {(user.role === "DEVELOPER" || task.assignedUserId === user.id) && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Log Hours</p>
              <form onSubmit={handleLogHours} className="flex gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  placeholder="Hours worked"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Log Hours
                </button>
              </form>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Comments</h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="mb-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 mr-3">
                        <span className="text-xs font-medium">
                          {comment.username?.substring(0, 2).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {comment.username || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-line">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned User */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Assigned To</h3>
            {task.assignedUserId ? (
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-3">
                  <span className="text-sm font-medium">
                    {task.assignedUserName?.substring(0, 2).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{task.assignedUserName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{task.assignedUserRole}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <User size={20} className="mr-2" />
                <span>Unassigned</span>
              </div>
            )}

            {canEdit && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/tasks/${id}/assign`}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {task.assignedUserId ? "Reassign Task" : "Assign Task"}
                </Link>
              </div>
            )}
          </div>

          {/* Task Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {task.createdAt ? new Date(task.createdAt).toLocaleString() : "Unknown"}
                  </p>
                </div>
              </div>

              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Last Updated</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {task.dueDate && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-red-500 mt-1"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Due Date</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.dueDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Items */}
          {(task.sprintId || task.userStoryId) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Related Items</h3>
              <div className="space-y-3">
                {task.sprintId && (
                  <div className="flex items-center">
                    <MessageSquare size={16} className="text-blue-500 mr-2" />
                    <Link
                      to={`/sprints/${task.sprintId}`}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {task.sprintName || `Sprint #${task.sprintId}`}
                    </Link>
                  </div>
                )}

                {task.userStoryId && (
                  <div className="flex items-center">
                    <MessageSquare size={16} className="text-green-500 mr-2" />
                    <Link
                      to={`/backlogs/product/story/${task.userStoryId}`}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {task.userStoryTitle || `User Story #${task.userStoryId}`}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
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

export default TaskDetails
