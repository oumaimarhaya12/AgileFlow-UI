"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Calendar, CheckSquare, Users, TrendingUp, Clock } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        // Fetch active sprints
        const sprintsResponse = await axios.get("/api/sprints/active")
        const activeSprints = sprintsResponse.data || []

        // Fetch team members
        const teamResponse = await axios.get("/api/users/role?role=DEVELOPER")
        const teamMembers = teamResponse.data || []

        // Set current sprint (first active sprint)
        if (activeSprints.length > 0) {
          setCurrentSprint(activeSprints[0])

          // Fetch sprint progress
          const progressResponse = await axios.get(`/api/sprint-backlogs/${activeSprints[0].sprintBacklogId}/progress`)

          setStats({
            activeSprints: activeSprints.length,
            totalTasks: 25, // Mock data
            completedTasks: 12, // Mock data
            teamMembers: teamMembers.length,
            sprintProgress: progressResponse.data || 0,
            velocity: 18, // Mock data
          })
        } else {
          setStats({
            activeSprints: 0,
            totalTasks: 0,
            completedTasks: 0,
            teamMembers: teamMembers.length,
            sprintProgress: 0,
            velocity: 0,
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

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
            to="/users"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Team Members
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ScrumMasterDashboard
