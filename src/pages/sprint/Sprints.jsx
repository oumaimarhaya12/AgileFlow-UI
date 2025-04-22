"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Calendar, Search, Filter, Clock } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { sprintService } from "../../services"
import { toast } from "react-toastify"

const Sprints = () => {
  const { user } = useAuth()
  const [sprints, setSprints] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSprints, setFilteredSprints] = useState([])
  const [filter, setFilter] = useState("all") // 'all', 'active', 'upcoming', 'completed'

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        setLoading(true)
        const response = await sprintService.getAllSprints()
        setSprints(response.data || [])
      } catch (error) {
        console.error("Error fetching sprints:", error)
        toast.error("Failed to load sprints")
      } finally {
        setLoading(false)
      }
    }

    fetchSprints()
  }, [])

  // Filter sprints based on search term and filter
  useEffect(() => {
    let filtered = sprints

    // Apply status filter
    if (filter === "active") {
      filtered = sprints.filter(
        (sprint) => new Date() >= new Date(sprint.startDate) && new Date() <= new Date(sprint.endDate),
      )
    } else if (filter === "upcoming") {
      filtered = sprints.filter((sprint) => new Date() < new Date(sprint.startDate))
    } else if (filter === "completed") {
      filtered = sprints.filter((sprint) => new Date() > new Date(sprint.endDate))
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((sprint) => sprint.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredSprints(filtered)
  }, [searchTerm, filter, sprints])

  const canCreate = user.role === "PRODUCT_OWNER" || user.role === "SCRUM_MASTER" || user.role === "ADMIN"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sprints</h1>
        {canCreate && (
          <Link
            to="/sprints/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            New Sprint
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
            placeholder="Search sprints..."
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Sprints</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sprints List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSprints.length > 0 ? (
            filteredSprints.map((sprint) => (
              <Link
                key={sprint.id}
                to={`/sprints/${sprint.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                      <Calendar size={20} />
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        new Date() < new Date(sprint.startDate)
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : new Date() > new Date(sprint.endDate)
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {new Date() < new Date(sprint.startDate)
                        ? "UPCOMING"
                        : new Date() > new Date(sprint.endDate)
                          ? "COMPLETED"
                          : "ACTIVE"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">{sprint.name}</h3>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {sprint.startDate && <span>Start: {new Date(sprint.startDate).toLocaleDateString()}</span>}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {sprint.endDate && <span>End: {new Date(sprint.endDate).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {new Date() < new Date(sprint.startDate)
                        ? `Starts in ${Math.ceil((new Date(sprint.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days`
                        : new Date() > new Date(sprint.endDate)
                          ? `Ended ${Math.ceil((new Date() - new Date(sprint.endDate)) / (1000 * 60 * 60 * 24))} days ago`
                          : `${Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar size={48} className="mb-4 opacity-40" />
              <p className="text-lg font-medium">No sprints found</p>
              <p className="text-sm">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first sprint to get started"}
              </p>
              {canCreate && !searchTerm && filter === "all" && (
                <Link
                  to="/sprints/new"
                  className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={18} className="mr-2" />
                  Create Sprint
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Sprints
