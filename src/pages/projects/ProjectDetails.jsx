"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Edit, Trash2, Users, List, Calendar, CheckSquare, ArrowLeft, Clock } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { projectService, userService, taskService, sprintService } from "../../services"
import { toast } from "react-toastify"

const ProjectDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [sprints, setSprints] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true)

        // Fetch project details
        const projectResponse = await projectService.getProjectById(id)
        const projectData = projectResponse.data

        // Map the project data to ensure consistent property names
        const mappedProject = {
          id: projectData.projectId || projectData.id,
          name: projectData.projectName || projectData.name,
          description: projectData.description || "",
          status: projectData.status || "ACTIVE",
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          ownerName: projectData.ownerName || (projectData.user ? projectData.user.username : "Not assigned"),
        }

        setProject(mappedProject)

        // Fetch team members, tasks, and sprints
        // These will be implemented with real API calls when those endpoints are available
        const teamMembersResponse = await userService.getUsersByProjectId(id)
        setTeamMembers(teamMembersResponse.data || [])

        const tasksResponse = await taskService.getAllTasks()
        const projectTasks = tasksResponse.data.filter((task) => task.projectId === Number.parseInt(id)) || []
        setTasks(projectTasks)

        const sprintsResponse = await sprintService.getSprintsByProjectId(id)
        setSprints(sprintsResponse.data || [])
      } catch (error) {
        console.error("Error in project details component:", error)
        toast.error("Failed to load project details")

        // Set empty data
        setTeamMembers([])
        setTasks([])
        setSprints([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id])

  // Update the handleDelete function to use the updated projectService
  const handleDelete = async () => {
    try {
      await projectService.deleteProject(id)
      toast.success("Project deleted successfully")
      navigate("/projects")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
      // Navigate anyway for demo purposes
      navigate("/projects")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">Project not found</p>
        <Link to="/projects" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </Link>
      </div>
    )
  }

  const canEdit = user.role === "PRODUCT_OWNER" || user.role === "ADMIN"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/projects"
            className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          <span
            className={`ml-4 px-2 py-1 text-xs rounded-full ${
              project.status === "ACTIVE"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : project.status === "COMPLETED"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {project.status || "N/A"}
          </span>
        </div>

        {canEdit && (
          <div className="flex space-x-2">
            <Link
              to={`/projects/${id}/edit`}
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

      {/* Project Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Project Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                <p className="text-gray-800 dark:text-white">{project.description || "No description provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="text-gray-800 dark:text-white">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="text-gray-800 dark:text-white">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</p>
                <p className="text-gray-800 dark:text-white">{project.ownerName || "Not assigned"}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Project Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Members</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{teamMembers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-3">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sprints</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{sprints.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-3">
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{tasks.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-3">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Left</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {project.endDate
                        ? Math.max(0, Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={`/backlogs/product/${id}`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
              <List size={20} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white">Product Backlog</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">View and manage user stories</p>
            </div>
          </div>
        </Link>

        <Link
          to={`/sprints?projectId=${id}`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-3">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white">Sprints</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage project sprints</p>
            </div>
          </div>
        </Link>

        <Link
          to={`/tasks?projectId=${id}`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-3">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white">Tasks</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">View and manage tasks</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Team Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Team Members</h2>
          {canEdit && <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Manage Team</button>}
        </div>

        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 mr-3">
                  <span className="text-sm font-medium">{member.username?.substring(0, 2).toUpperCase() || "U"}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{member.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role?.replace("_", " ") || "Team Member"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500 dark:text-gray-400">
            No team members assigned to this project yet.
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
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

export default ProjectDetails
