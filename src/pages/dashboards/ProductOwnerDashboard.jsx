"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Briefcase, List, CheckSquare, Users, Calendar, ArrowUp, ArrowDown } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { projectService } from "../../services"
import { toast } from "react-toastify"

const ProductOwnerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    projects: 0,
    backlogs: 0,
    tasks: 0,
    completedTasks: 0,
    users: 0,
    sprints: 0,
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [taskStatusData, setTaskStatusData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Try to fetch project statistics using the dedicated endpoint
        let statsData
        let projectsData = []

        try {
          const statsResponse = await projectService.getProjectStatistics()
          statsData = statsResponse.data
        } catch (error) {
          console.error("Error fetching project statistics:", error)
          // Use mock data if API fails
          statsData = projectService.getMockStatistics()
          toast.warning("Using mock statistics data due to API error")
        }

        // Try to fetch projects assigned to the current user
        try {
          const projectsResponse = await projectService.getProjectsByUser(user.id)
          projectsData = projectsResponse.data || []
        } catch (error) {
          console.error("Error fetching user projects:", error)
          // Use mock data if API fails
          projectsData = projectService.getMockProjects()
          toast.warning("Using mock project data due to API error")
        }

        // Generate mock task status data
        const taskStatusCounts = {
          TODO: 15,
          IN_PROGRESS: 10,
          TESTING: 8,
          DONE: 12,
        }

        const taskStatusChartData = Object.keys(taskStatusCounts).map((status) => ({
          name: status.replace("_", " "),
          value: taskStatusCounts[status],
        }))

        // Update state with fetched or mock data
        setStats({
          projects: statsData.totalProjects || 0,
          backlogs: statsData.projectsWithBacklog || 0,
          tasks: statsData.totalTasks || 0,
          completedTasks: statsData.completedTasks || 0,
          users: statsData.totalUsers || 0,
          sprints: statsData.totalSprints || 0,
        })

        // Sort projects by most recently created/updated
        const sortedProjects = projectsData
          ? [...projectsData].sort((a, b) => {
              // Sort by creation date if available, otherwise by ID
              if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt) - new Date(a.createdAt)
              }
              return b.id - a.id
            })
          : []

        setRecentProjects(sortedProjects.slice(0, 5))
        setTaskStatusData(taskStatusChartData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user.id])

  // Calculate task completion rate
  const completionRate = stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0

  // Determine if completion rate is up or down (mock data)
  const isCompletionRateUp = true
  const completionRateChange = 5 // percentage points

  // Add this function to handle creating a new project
  const handleCreateProject = () => {
    navigate("/projects/new")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Owner Dashboard</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.username}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.projects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-4">
              <List size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Backlogs</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.backlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sprints</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.sprints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-4">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.tasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-4">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Members</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.users}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 mr-4">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{completionRate}%</p>
                <div className={`ml-2 flex items-center ${isCompletionRateUp ? "text-green-500" : "text-red-500"}`}>
                  {isCompletionRateUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  <span className="text-xs ml-1">{completionRateChange}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Task Status</h2>
          <div className="h-64">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            )}
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
            <div className="space-y-3">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <Link
                    key={project.projectId || project.id}
                    to={`/projects/${project.projectId || project.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {project.projectName || project.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.description?.substring(0, 60) || "No description"}
                          {project.description?.length > 60 ? "..." : ""}
                        </p>
                      </div>
                      <div className="flex items-center">
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
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No projects found. Create your first project!
                </p>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleCreateProject}
                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create New Project
              </button>

              <Link
                to="/cors-test"
                className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                CORS Test Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductOwnerDashboard

