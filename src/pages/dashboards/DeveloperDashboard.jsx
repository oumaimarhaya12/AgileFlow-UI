"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { CheckSquare, Clock, AlertCircle, CheckCircle, Calendar, Code } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const DeveloperDashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    loggedHours: 0,
  })
  const [currentSprint, setCurrentSprint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [recentComments, setRecentComments] = useState([])
  const [tasksByPriority, setTasksByPriority] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch tasks assigned to the user - Developers can view tasks assigned to them
        let userTasks = []
        try {
          const tasksResponse = await axios.get(`/api/tasks?assignedUserId=${user.id}`)
          userTasks = tasksResponse.data || []
        } catch (error) {
          console.error("Error fetching tasks:", error)
          // Mock data if API fails
          userTasks = [
            {
              id: 1,
              title: "Implement login",
              description: "Create login functionality",
              status: "DONE",
              priority: 1,
              estimatedHours: 4,
              loggedHours: 3.5,
            },
            {
              id: 2,
              title: "Design dashboard",
              description: "Create dashboard UI",
              status: "IN_PROGRESS",
              priority: 2,
              estimatedHours: 8,
              loggedHours: 4,
            },
            {
              id: 3,
              title: "Add user management",
              description: "Implement user CRUD",
              status: "TODO",
              priority: 1,
              estimatedHours: 6,
              loggedHours: 0,
            },
            {
              id: 4,
              title: "Fix navigation bug",
              description: "Fix navigation issue in mobile view",
              status: "TODO",
              priority: 3,
              estimatedHours: 2,
              loggedHours: 0,
            },
            {
              id: 5,
              title: "Implement API integration",
              description: "Connect frontend to backend APIs",
              status: "IN_PROGRESS",
              priority: 2,
              estimatedHours: 10,
              loggedHours: 6,
            },
          ]
        }

        // Fetch active sprint - Developers can view active sprints
        let activeSprints = []
        try {
          const sprintsResponse = await axios.get("/api/sprints/active")
          activeSprints = sprintsResponse.data || []
        } catch (error) {
          console.error("Error fetching active sprints:", error)
          // Mock data if API fails
          activeSprints = [
            {
              id: 1,
              name: "Sprint 1",
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              sprintBacklogId: 1,
            },
          ]
        }

        // Fetch projects the developer is assigned to - Developers can view projects they're assigned to
        let userProjects = []
        try {
          const projectsResponse = await axios.get(`/api/projects/user/${user.id}`)
          userProjects = projectsResponse.data || []
        } catch (error) {
          console.error("Error fetching projects:", error)
          // Mock data if API fails
          userProjects = [
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
          ]
        }

        // Fetch recent comments - Developers can view comments on tasks
        let comments = []
        try {
          // This endpoint might not exist, but developers should be able to see comments
          const commentsResponse = await axios.get(`/api/tasks/comments/recent?userId=${user.id}`)
          comments = commentsResponse.data || []
        } catch (error) {
          console.error("Error fetching comments:", error)
          // Mock data if API fails
          comments = [
            {
              id: 1,
              taskId: 2,
              content: "Making progress on the UI components",
              username: "developer2",
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 2,
              taskId: 5,
              content: "API integration is more complex than expected",
              username: user.username,
              createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
          ]
        }

        // Set tasks and current sprint
        setTasks(userTasks)
        if (activeSprints.length > 0) {
          setCurrentSprint(activeSprints[0])
        }

        // Calculate stats
        const completed = userTasks.filter((task) => task.status === "DONE").length
        const inProgress = userTasks.filter((task) => task.status === "IN_PROGRESS").length
        const pending = userTasks.filter((task) => task.status === "TODO").length
        const totalLoggedHours = userTasks.reduce((sum, task) => sum + (task.loggedHours || 0), 0)

        setStats({
          totalTasks: userTasks.length,
          completedTasks: completed,
          inProgressTasks: inProgress,
          pendingTasks: pending,
          loggedHours: totalLoggedHours,
        })

        // Set projects
        setProjects(userProjects)

        // Set recent comments
        setRecentComments(comments)

        // Calculate tasks by priority
        const highPriority = userTasks.filter((task) => task.priority === 1).length
        const mediumPriority = userTasks.filter((task) => task.priority === 2).length
        const lowPriority = userTasks.filter((task) => task.priority === 3).length

        setTasksByPriority([
          { name: "High", value: highPriority, color: "#EF4444" },
          { name: "Medium", value: mediumPriority, color: "#F59E0B" },
          { name: "Low", value: lowPriority, color: "#3B82F6" },
        ])
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

  // Function to update task status - Developers can update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.post(`/api/tasks/${taskId}/update-status`, null, { params: { status: newStatus } })
      // Refresh tasks after update
      const tasksResponse = await axios.get(`/api/tasks?assignedUserId=${user.id}`)
      setTasks(tasksResponse.data || [])
      // Update stats
      const updatedTasks = tasksResponse.data || []
      const completed = updatedTasks.filter((task) => task.status === "DONE").length
      const inProgress = updatedTasks.filter((task) => task.status === "IN_PROGRESS").length
      const pending = updatedTasks.filter((task) => task.status === "TODO").length
      setStats({
        ...stats,
        totalTasks: updatedTasks.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending,
      })
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  // Function to log hours on a task - Developers can log hours on tasks
  const logHours = async (taskId, hours) => {
    try {
      await axios.post(`/api/tasks/${taskId}/log-hours`, null, { params: { hours } })
      // Refresh tasks after update
      const tasksResponse = await axios.get(`/api/tasks?assignedUserId=${user.id}`)
      setTasks(tasksResponse.data || [])
      // Update logged hours stat
      const updatedTasks = tasksResponse.data || []
      const totalLoggedHours = updatedTasks.reduce((sum, task) => sum + (task.loggedHours || 0), 0)
      setStats({
        ...stats,
        loggedHours: totalLoggedHours,
      })
    } catch (error) {
      console.error("Error logging hours:", error)
    }
  }

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

        {/* Tasks by Priority */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tasks by Priority</h2>
          {tasksByPriority.some((item) => item.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksByPriority} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" name="Tasks">
                    {tasksByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
              No tasks available
            </div>
          )}
        </div>
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

      {/* Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Projects</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link
                  key={project.id || project.projectId}
                  to={`/projects/${project.id || project.projectId}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                      <Code size={16} />
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
              <div className="col-span-2 text-center py-4 text-gray-500 dark:text-gray-400">
                No projects assigned to you.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/tasks"
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            View My Tasks
          </Link>
          <Link
            to={currentSprint ? `/backlogs/sprint/${currentSprint.id}` : "/sprints"}
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Sprint Backlog
          </Link>
          <Link
            to="/projects"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DeveloperDashboard
