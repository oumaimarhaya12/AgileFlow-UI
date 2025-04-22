"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { CheckSquare, AlertTriangle, CheckCircle, XCircle, Calendar } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { toast } from "react-toastify"

const TesterDashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    passedTasks: 0,
    failedTasks: 0,
    pendingTasks: 0,
  })
  const [currentSprint, setCurrentSprint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentTestResults, setRecentTestResults] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch tasks assigned to the user for testing
        let tasksData = []
        try {
          const tasksResponse = await axios.get(`/api/tasks?assignedUserId=${user.id}`)
          tasksData = tasksResponse.data || []
        } catch (error) {
          console.error("Error fetching tasks:", error)
          toast.warning("Using mock task data due to API error")
          // Mock data for tasks
          tasksData = [
            { id: 1, title: "Test login functionality", status: "TESTING", description: "Verify all login scenarios" },
            { id: 2, title: "Test user registration", status: "DONE", description: "Verify registration process" },
            { id: 3, title: "Test password reset", status: "FAILED", description: "Verify password reset flow" },
            { id: 4, title: "Test dashboard UI", status: "TESTING", description: "Verify dashboard components" },
            { id: 5, title: "Test project creation", status: "TESTING", description: "Verify project creation flow" },
          ]
        }

        // Fetch active sprint
        let activeSprint = null
        try {
          const sprintsResponse = await axios.get("/api/sprints/active")
          const activeSprints = sprintsResponse.data || []
          if (activeSprints.length > 0) {
            activeSprint = activeSprints[0]
          }
        } catch (error) {
          console.error("Error fetching active sprint:", error)
          toast.warning("Using mock sprint data due to API error")
          // Mock data for active sprint
          activeSprint = {
            id: 1,
            name: "Sprint 1",
            startDate: "2023-06-01",
            endDate: "2023-06-14",
          }
        }

        // Fetch recent test results
        let testResults = []
        try {
          const testResultsResponse = await axios.get(`/api/tasks/test-results?testerId=${user.id}&limit=5`)
          testResults = testResultsResponse.data || []
        } catch (error) {
          console.error("Error fetching test results:", error)
          // Mock data for test results
          testResults = [
            { id: 1, taskId: 1, taskTitle: "Test login functionality", status: "PASSED", date: "2023-06-05" },
            { id: 2, taskId: 3, taskTitle: "Test password reset", status: "FAILED", date: "2023-06-04" },
            { id: 3, taskId: 2, taskTitle: "Test user registration", status: "PASSED", date: "2023-06-03" },
          ]
        }

        // Set tasks and current sprint
        setTasks(tasksData)
        setCurrentSprint(activeSprint)
        setRecentTestResults(testResults)

        // Calculate stats
        const passed = tasksData.filter((task) => task.status === "DONE").length
        const failed = tasksData.filter((task) => task.status === "FAILED").length
        const pending = tasksData.filter((task) => task.status === "TESTING").length

        setStats({
          totalTasks: tasksData.length,
          passedTasks: passed,
          failedTasks: failed,
          pendingTasks: pending,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")

        // Set default values if everything fails
        setStats({
          totalTasks: 0,
          passedTasks: 0,
          failedTasks: 0,
          pendingTasks: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user.id])

  // Function to update task status (PASS/FAIL)
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.post(`/api/tasks/${taskId}/update-status`, null, { params: { status: newStatus } })

      // Update local state
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

      // Update stats
      const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))

      const passed = updatedTasks.filter((task) => task.status === "DONE").length
      const failed = updatedTasks.filter((task) => task.status === "FAILED").length
      const pending = updatedTasks.filter((task) => task.status === "TESTING").length

      setStats({
        totalTasks: updatedTasks.length,
        passedTasks: passed,
        failedTasks: failed,
        pendingTasks: pending,
      })

      toast.success(`Task marked as ${newStatus}`)
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Failed to update task status")
    }
  }

  // Function to add test comment
  const addTestComment = async (taskId, comment) => {
    try {
      await axios.post(`/api/tasks/${taskId}/comments`, null, {
        params: {
          userId: user.id,
          content: comment,
        },
      })
      toast.success("Test comment added successfully")
    } catch (error) {
      console.error("Error adding test comment:", error)
      toast.error("Failed to add test comment")
    }
  }

  // Data for test status pie chart
  const testStatusData = [
    { name: "Passed", value: stats.passedTasks, color: "#10B981" },
    { name: "Failed", value: stats.failedTasks, color: "#EF4444" },
    { name: "Pending", value: stats.pendingTasks, color: "#F59E0B" },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tester Dashboard</h1>
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tests</p>
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Passed</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.passedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-4">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.failedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-4">
              <AlertTriangle size={20} />
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
        {/* Test Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Test Status</h2>
          {testStatusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={testStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {testStatusData.map((entry, index) => (
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
              No tests available
            </div>
          )}
        </div>

        {/* Recent Test Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Test Results</h2>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTestResults.length > 0 ? (
                recentTestResults.map((result) => (
                  <div key={result.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{result.taskTitle}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(result.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          result.status === "PASSED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No recent test results.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tasks to Test */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Tasks to Test</h2>
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
              tasks
                .filter((task) => task.status === "TESTING")
                .map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{task.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {task.description?.substring(0, 60) || "No description"}
                          {task.description?.length > 60 ? "..." : ""}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateTaskStatus(task.id, "DONE")}
                          className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-xs hover:bg-green-200 dark:hover:bg-green-800"
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, "FAILED")}
                          className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md text-xs hover:bg-red-200 dark:hover:bg-red-800"
                        >
                          Fail
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">No tasks assigned for testing.</p>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/tasks/testing"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Testing Tasks
          </Link>
        </div>
      </div>

      {/* Bug Reporting */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Bug Reporting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-3">
                <XCircle size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Report Bug</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create detailed bug reports</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-3">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Test Cases</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage test cases</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/bugs/report"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Report New Bug
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/tasks/testing"
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            View Testing Tasks
          </Link>
          <Link
            to="/bugs/report"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Report Bug
          </Link>
          <Link
            to="/test-cases"
            className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Manage Test Cases
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TesterDashboard
