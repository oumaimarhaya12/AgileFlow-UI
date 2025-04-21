"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { projectService } from "../../services"
import { toast } from "react-toastify"

const NewProject = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleSubmit function to better match the backend's expected structure
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Create project data object matching the ProjectDTO structure from the backend
      const projectData = {
        projectName: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "ACTIVE",
        userId: user.id, // Include the current user as the owner
      }

      console.log("Sending project data:", projectData)

      // First try the with-owner endpoint
      try {
        const response = await projectService.createProjectWithOwner(projectData)
        toast.success("Project created successfully!")
        navigate(`/projects/${response.data.projectId || response.data.id}`)
        return
      } catch (ownerError) {
        console.error("Error with createProjectWithOwner:", ownerError)

        // If that fails, try the regular create endpoint
        const response = await projectService.createProject(projectData)
        toast.success("Project created successfully!")
        navigate(`/projects/${response.data.projectId || response.data.id}`)
        return
      }
    } catch (error) {
      console.error("Error creating project:", error)

      // Show more detailed error information
      if (error.response) {
        toast.error(`Failed to create project: ${error.response.data?.message || error.response.statusText}`)
      } else if (error.request) {
        toast.error("Network error. Please check your connection and try again.")
      } else {
        toast.error("Failed to create project. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          to="/projects"
          className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Enter project name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter project description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.startDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.endDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to="/projects"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewProject
