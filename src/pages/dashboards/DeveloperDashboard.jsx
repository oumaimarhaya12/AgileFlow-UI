"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { CheckSquare, Clock, AlertCircle, CheckCircle, Calendar } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const DeveloperDashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  })
  const [currentSprint, setCurrentSprint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch tasks assigned to the user
        const tasksResponse = await axios.get(`/api/tasks?assignedUserId=${user.id}`)
        const userTasks = tasksResponse.data || []

        // Fetch active sprint
        const sprintsResponse = await axios.get("/api/sprints/active")
        const activeSprints = sprintsResponse.data || []

        // Set tasks and current sprint
        setTasks(userTasks)
        if (activeSprints.length > 0) {
          setCurrentSprint(activeSprints[0])
        }

        // Calculate stats
        const completed = userTasks.filter((task) => task.status === "DONE").length
        const inProgress = userTasks.filter((task) => task.status === "IN_PROGRESS").length
        const pending = userTasks.filter((task) => task.status === "TODO").length

        setStats({
          totalTasks: userTasks.length,
          completedTasks: completed,
          inProgressTasks: inProgress,
          pendingTasks: pending,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user.id])

  // Data for task status pie chart
  const taskStatusData = [
    { name: "Completed", value: stats.completedTasks, color: "#10B981" },
    { name: "In Progress", value: stats.inProgressTasks, color: "#3B82F6" },
    { name: "Pending", value: stats.pendingTasks, color: "#F59E0B" },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Developer Dashboard</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.username}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
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
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-4">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-4">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-4">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Sprint */}
      {currentSprint && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <Calendar size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Current Sprint</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-base text-gray-800 dark:text-white">{currentSprint.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
              <p className="text-base text-gray-800 dark:text-white">
                {new Date(currentSprint.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
              <p className="text-base text-gray-800 dark:text-white">
                {new Date(currentSprint.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to={`/backlogs/sprint/${currentSprint.id}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Sprint Backlog
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Task Status</h2>
          {taskStatusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
              No tasks available
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Tasks</h2>
            <Link to="/tasks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{task.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description?.substring(0, 60) || "No description"}
                          {task.description?.length > 60 ? "..." : ""}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            task.status === "DONE"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {task.status || "TODO"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No tasks assigned to you.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeveloperDashboard

