"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, Briefcase } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { projectService } from "../../services"
import { toast } from "react-toastify"

const Projects = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        let response

        // If user is admin, fetch all projects, otherwise fetch user's projects
        if (user.role === "ADMIN") {
          response = await projectService.getAllProjects()
        } else {
          response = await projectService.getProjectsByUser(user.id)
        }

        setProjects(response.data || [])
        setFilteredProjects(response.data || [])
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast.error("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user.id, user.role])

  // Filter projects based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredProjects(filtered)
    }
  }, [searchTerm, projects])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        {(user.role === "PRODUCT_OWNER" || user.role === "ADMIN") && (
          <Link
            to="/projects/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            New Project
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
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="sm:w-48">
          <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter size={18} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                      <Briefcase size={20} />
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
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
                  <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">{project.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {project.description || "No description provided"}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {project.startDate && <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {project.endDate && <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <Briefcase size={48} className="mb-4 opacity-40" />
              <p className="text-lg font-medium">No projects found</p>
              <p className="text-sm">
                {searchTerm ? "Try adjusting your search criteria" : "Create your first project to get started"}
              </p>
              {(user.role === "PRODUCT_OWNER" || user.role === "ADMIN") && !searchTerm && (
                <Link
                  to="/projects/new"
                  className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={18} className="mr-2" />
                  Create Project
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Projects

