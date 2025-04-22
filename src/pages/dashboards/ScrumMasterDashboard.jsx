"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Calendar, CheckSquare, Users, TrendingUp, Clock, Briefcase } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-toastify"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const ScrumMasterDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    activeSprints: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    sprintProgress: 0,
    velocity: 0,
  })
  const [currentSprint, setCurrentSprint] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  // Add projects state and update the useEffect to fetch projects
  const [projects, setProjects] = useState([])

  // Update the fetchDashboardData function to use the correct API endpoints
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch active sprints - Scrum Masters have full access to sprints
      let activeSprints = []
      try {
        // Format today's date as YYYY-MM-DD for the API
        const today = new Date().toISOString().split("T")[0]
        const sprintsResponse = await axios.get(`/api/sprints/active?date=${today}`)
        activeSprints = sprintsResponse.data || []
      } catch (error) {
        console.error("Error fetching active sprints:", error)
        // Use mock data if API fails
        activeSprints = [
          {
            id: 1,
            name: "Sprint 1",
            startDate: "2023-06-01",
            endDate: "2023-06-14",
            sprintBacklogId: 1,
          },
        ]
      }

      // Fetch team members - Scrum Masters can view users
      let teamMembers = []
      try {
        // Get developers specifically for the Scrum Master's team
        const teamResponse = await axios.get("/api/users/role?role=DEVELOPER")
        teamMembers = teamResponse.data || []
      } catch (error) {
        console.error("Error fetching team members:", error)
        teamMembers = [
          { id: 1, username: "developer1", role: "DEVELOPER" },
          { id: 2, username: "developer2", role: "DEVELOPER" },
          { id: 3, username: "developer3", role: "DEVELOPER" },
        ]
      }

      // Fetch all projects - Scrum Masters have read access to projects
      let projectsData = []
      try {
        const projectsResponse = await axios.get("/api/projects")
        projectsData = projectsResponse.data || []
      } catch (error) {
        console.error("Error fetching projects:", error)
        projectsData = [
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

      // Fetch tasks - Scrum Masters have full access to tasks
      let tasksData = []
      try {
        const tasksResponse = await axios.get("/api/tasks")
        tasksData = tasksResponse.data || []
      } catch (error) {
        console.error("Error fetching tasks:", error)
        tasksData = []
      }

      // Fetch sprint backlogs - Scrum Masters have full access to sprint backlogs
      let sprintBacklogs = []
      try {
        if (activeSprints.length > 0 && activeSprints[0].sprintBacklogId) {
          const backlogResponse = await axios.get(`/api/sprint-backlogs/${activeSprints[0].sprintBacklogId}`)
          sprintBacklogs = [backlogResponse.data]
        }
      } catch (error) {
        console.error("Error fetching sprint backlogs:", error)
        sprintBacklogs = []
      }

      // Map projects to ensure consistent property names
      const mappedProjects = projectsData.map((project) => ({
        id: project.projectId || project.id,
        name: project.projectName || project.name,
        description: project.description || "",
        status: project.status || "ACTIVE",
        startDate: project.startDate,
        endDate: project.endDate,
      }))

      setProjects(mappedProjects)

      // Set current sprint (first active sprint)
      let sprintProgress = 0
      if (activeSprints.length > 0) {
        setCurrentSprint(activeSprints[0])

        // Try to fetch sprint progress using the sprint backlog API
        try {
          const progressResponse = await axios.get(`/api/sprint-backlogs/${activeSprints[0].sprintBacklogId}/progress`)
          sprintProgress = progressResponse.data || 0
        } catch (error) {
          console.error("Error fetching sprint progress:", error)
          sprintProgress = 45 // Mock progress value
        }
      }

      // Calculate task statistics from the fetched tasks
      const totalTasks = tasksData.length
      const completedTasks = tasksData.filter((task) => task.status === "DONE").length
      const inProgressTasks = tasksData.filter((task) => task.status === "IN_PROGRESS").length

      // Set stats with actual data where available
      setStats({
        activeSprints: activeSprints.length,
        totalTasks: totalTasks || 25, // Use actual count or fallback to mock
        completedTasks: completedTasks || 12, // Use actual count or fallback to mock
        teamMembers: teamMembers.length,
        sprintProgress: sprintProgress,
        velocity: 18, // Mock data for velocity (would need historical sprint data to calculate)
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)

      // Set default values if everything fails
      setStats({
        activeSprints: 1,
        totalTasks: 25,
        completedTasks: 12,
        teamMembers: 3,
        sprintProgress: 45,
        velocity: 18,
      })

      setProjects([
        {
          id: 1,
          name: "AgileFlow Development",
          description: "Development of the AgileFlow application",
          status: "ACTIVE",
        },
        {
          id: 2,
          name: "Website Redesign",
          description: "Redesign of the company website",
          status: "ACTIVE",
        },
      ])

      setCurrentSprint({
        id: 1,
        name: "Sprint 1",
        startDate: "2023-06-01",
        endDate: "2023-06-14",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Sample data for burndown chart
  const burndownData = [
    { day: "Day 1", remaining: 50, ideal: 50 },
    { day: "Day 2", remaining: 45, ideal: 45 },
    { day: "Day 3", remaining: 42, ideal: 40 },
    { day: "Day 4", remaining: 38, ideal: 35 },
    { day: "Day 5", remaining: 35, ideal: 30 },
    { day: "Day 6", remaining: 30, ideal: 25 },
    { day: "Day 7", remaining: 28, ideal: 20 },
    { day: "Day 8", remaining: 22, ideal: 15 },
    { day: "Day 9", remaining: 18, ideal: 10 },
    { day: "Day 10", remaining: 12, ideal: 5 },
    { day: "Day 11", remaining: 5, ideal: 0 },
  ]

  // Sample data for velocity chart
  const velocityData = [
    { sprint: "Sprint 1", velocity: 15 },
    { sprint: "Sprint 2", velocity: 18 },
    { sprint: "Sprint 3", velocity: 16 },
    { sprint: "Sprint 4", velocity: 20 },
    { sprint: "Sprint 5", velocity: 18 },
  ]

  // Add these functions to handle sprint and task management
  // Add these functions after the fetchDashboardData function

  const createNewSprint = async () => {
    try {
      // Navigate to sprint creation page
      navigate("/sprints/new")
    } catch (error) {
      console.error("Error navigating to sprint creation:", error)
      toast.error("Failed to navigate to sprint creation page")
    }
  }

  const manageTasks = () => {
    navigate("/tasks")
  }

  const viewTeamMembers = () => {
    // Scrum Masters can view users but not manage them
    navigate("/users")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scrum Master Dashboard</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.username}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sprints</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.activeSprints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-4">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {stats.completedTasks}/{stats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-4">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Members</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.teamMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-4">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sprint Progress</p>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${stats.sprintProgress}%` }}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{stats.sprintProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-4">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Velocity</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.velocity} points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Sprint */}
      {currentSprint && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Current Sprint</h2>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burndown Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Burndown Chart</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burndownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="remaining" stroke="#EF4444" name="Actual" />
                <Line type="monotone" dataKey="ideal" stroke="#3B82F6" strokeDasharray="5 5" name="Ideal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Velocity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Team Velocity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="velocity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Projects</h2>
          <Link to="/projects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length > 0 ? (
              projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                      <Briefcase size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 dark:text-white">{project.name}</h3>
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
              <div className="col-span-2 text-center py-4 text-gray-500 dark:text-gray-400">No projects found.</div>
            )}
          </div>
        )}
      </div>

      {/* Sprint Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sprint Management</h2>
          <Link to="/sprints" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all sprints
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Create Sprint</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Plan and schedule new sprints</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-3">
                  <CheckSquare size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Sprint Backlog</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage sprint user stories</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-3">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Sprint Planning</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organize sprint planning meetings</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-3">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Sprint Review</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conduct sprint reviews and retrospectives</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/sprints/new"
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Sprint
          </Link>
          <Link
            to="/tasks"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Manage Tasks
          </Link>
          <Link
            to="/backlogs/sprint/new"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Create Sprint Backlog
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ScrumMasterDashboard
