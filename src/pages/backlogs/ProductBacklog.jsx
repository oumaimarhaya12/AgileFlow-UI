"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Plus, ArrowLeft, Edit, Trash2, ChevronUp, ChevronDown } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { productBacklogService, userStoryService, projectService } from "../../services"
import { toast } from "react-toastify"

const ProductBacklog = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [backlog, setBacklog] = useState(null)
  const [userStories, setUserStories] = useState([])
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBacklogData = async () => {
      try {
        setLoading(true)

        // Fetch project details
        const projectResponse = await projectService.getProjectById(projectId)
        setProject(projectResponse.data)

        // Fetch product backlog for this project
        const backlogResponse = await productBacklogService.getProductBacklogsByProject(projectId)

        // Assuming the first backlog is the main one for this project
        if (backlogResponse.data && backlogResponse.data.length > 0) {
          const mainBacklog = backlogResponse.data[0]
          setBacklog(mainBacklog)

          // Fetch user stories for this backlog
          // This is a mock - in a real app, you'd have an endpoint to get user stories by backlog ID
          const storiesResponse = await userStoryService.getAllUserStories()
          // Filter stories for this backlog (assuming there's a backlogId field)
          const backlogStories = storiesResponse.data.filter((story) => story.productBacklogId === mainBacklog.id) || []
          setUserStories(backlogStories)
        }
      } catch (error) {
        console.error("Error fetching backlog data:", error)
        toast.error("Failed to load product backlog")
      } finally {
        setLoading(false)
      }
    }

    fetchBacklogData()
  }, [projectId])

  const canEdit = user.role === "PRODUCT_OWNER" || user.role === "SCRUM_MASTER" || user.role === "ADMIN"

  const handlePriorityChange = async (storyId, direction) => {
    try {
      // Find the story and its current priority
      const story = userStories.find((s) => s.id === storyId)
      if (!story) return

      // Calculate new priority
      const newPriority = direction === "up" ? story.priority - 1 : story.priority + 1

      // Update priority in the backend
      await userStoryService.updateUserStoryPriority(storyId, newPriority)

      // Update local state
      const updatedStories = userStories.map((s) => {
        if (s.id === storyId) {
          return { ...s, priority: newPriority }
        }
        return s
      })

      // Sort by priority
      updatedStories.sort((a, b) => a.priority - b.priority)
      setUserStories(updatedStories)

      toast.success("Priority updated successfully")
    } catch (error) {
      console.error("Error updating priority:", error)
      toast.error("Failed to update priority")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to={`/projects/${projectId}`}
            className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Backlog</h1>
            {project && <p className="text-sm text-gray-500 dark:text-gray-400">Project: {project.name}</p>}
          </div>
        </div>

        {canEdit && (
          <Link
            to={`/backlogs/product/${projectId}/new-story`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            Add User Story
          </Link>
        )}
      </div>

      {/* Backlog Info */}
      {backlog ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {backlog.title || "Product Backlog"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {backlog.description || "No description provided"}
              </p>
            </div>
            {canEdit && (
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* User Stories List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">User Stories</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userStories.length} {userStories.length === 1 ? "item" : "items"}
              </p>
            </div>

            {userStories.length > 0 ? (
              <div className="space-y-3">
                {userStories.map((story) => (
                  <div key={story.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                            {story.storyPoints || 0} pts
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Priority: {story.priority || "Not set"}
                          </span>
                        </div>
                        <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">{story.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {story.description || "No description provided"}
                        </p>
                        {story.acceptanceCriteria && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Acceptance Criteria:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{story.acceptanceCriteria}</p>
                          </div>
                        )}
                      </div>

                      {canEdit && (
                        <div className="flex flex-col space-y-1 ml-4">
                          <button
                            onClick={() => handlePriorityChange(story.id, "up")}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            disabled={story.priority <= 1}
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => handlePriorityChange(story.id, "down")}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {canEdit && (
                      <div className="flex justify-end mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex space-x-2">
                          <Link
                            to={`/backlogs/product/${projectId}/edit-story/${story.id}`}
                            className="flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Link>
                          <button className="flex items-center px-2 py-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                          <Link
                            to={`/backlogs/sprint/add-story/${story.id}`}
                            className="flex items-center px-2 py-1 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Plus size={14} className="mr-1" />
                            Add to Sprint
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="mb-2">No user stories found in this backlog.</p>
                {canEdit && (
                  <Link
                    to={`/backlogs/product/${projectId}/new-story`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus size={16} className="mr-1" />
                    Add your first user story
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No product backlog found for this project.</p>
          {canEdit && (
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={async () => {
                try {
                  const response = await productBacklogService.addProductBacklog({
                    title: `${project?.name || "Project"} Backlog`,
                    projectId: Number.parseInt(projectId),
                  })
                  setBacklog(response.data)
                  toast.success("Product backlog created successfully")
                } catch (error) {
                  console.error("Error creating backlog:", error)
                  toast.error("Failed to create product backlog")
                }
              }}
            >
              <Plus size={18} className="mr-2" />
              Create Product Backlog
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductBacklog

