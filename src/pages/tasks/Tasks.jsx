"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Plus, Search, Filter, CheckSquare, Clock, User } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { taskService } from "../../services"
import { toast } from "react-toastify"

const Tasks = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredTasks, setFilteredTasks] = useState([])

  // Get projectId or sprintId from URL if present
  const projectId = searchParams.get("projectId")
  const sprintId = searchParams.get("sprintId")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const response = await taskService.getAllTasks()
        let fetchedTasks = response.data || []

        // Filter by project or sprint if specified in URL
        if (projectId) {
          fetchedTasks = fetchedTasks.filter((task) => task.projectId === Number.parseInt(projectId))
        }

        if (sprintId) {
          fetchedTasks = fetchedTasks.filter((task) => task.sprintId === Number.parseInt(sprintId))
        }

        setTasks(fetchedTasks)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast.error("Failed to load tasks")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [projectId, sprintId])

  // Filter tasks based on search term and status filter
  useEffect(() => {
    let filtered = tasks

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredTasks(filtered)
  }, [searchTerm, statusFilter, tasks])

  const canCreate = user.role !== "TESTER"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        {canCreate && (
          <Link
            to={`/tasks/new${projectId ? `?projectId=${projectId}` : ""}${sprintId ? `?sprintId=${sprintId}` : ""}`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            New Task
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="sm:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="TESTING">Testing</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {filteredTasks.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              task.status === "DONE"
                                ? "bg-green-500"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-blue-500"
                                  : task.status === "TESTING"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                            }`}
                          ></span>
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
                          {task.priority && (
                            <span
                              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                task.priority === 1
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : task.priority === 2
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {task.priority === 1 ? "High" : task.priority === 2 ? "Medium" : "Low"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-medium text-gray-800 dark:text-white truncate">{task.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {task.description || "No description provided"}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        {task.dueDate && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} className="mr-1" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {task.assignedUserName && (
                          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <User size={14} className="mr-1" />
                            <span>{task.assignedUserName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <CheckSquare size={48} className="mb-4 opacity-40" />
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first task to get started"}
              </p>
              {canCreate && !searchTerm && statusFilter === "all" && (
                <Link
                  to={`/tasks/new${projectId ? `?projectId=${projectId}` : ""}${sprintId ? `?sprintId=${sprintId}` : ""}`}
                  className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={18} className="mr-2" />
                  Create Task
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Tasks
