import api from "./api"

export const sprintBacklogService = {
  /**
   * Create a sprint backlog
   * @param {string} title - Sprint backlog title
   * @returns {Promise} - Promise with created sprint backlog
   */
  createSprintBacklog: (title) => api.post("/api/sprint-backlogs/create", null, { params: { title } }),

  /**
   * Get sprint backlog by ID
   * @param {number} id - Sprint backlog ID
   * @returns {Promise} - Promise with sprint backlog data
   */
  getSprintBacklogById: (id) => api.get(`/api/sprint-backlogs/${id}`),

  /**
   * Get all sprint backlogs
   * @returns {Promise} - Promise with sprint backlogs list
   */
  getAllSprintBacklogs: () => api.get("/api/sprint-backlogs/all"),

  /**
   * Update a sprint backlog
   * @param {number} id - Sprint backlog ID
   * @param {string} title - Updated sprint backlog title
   * @returns {Promise} - Promise with updated sprint backlog
   */
  updateSprintBacklog: (id, title) => api.put(`/api/sprint-backlogs/update/${id}`, null, { params: { title } }),

  /**
   * Delete a sprint backlog
   * @param {number} id - Sprint backlog ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteSprintBacklog: (id) => api.delete(`/api/sprint-backlogs/delete/${id}`),

  /**
   * Add user story to sprint backlog
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @param {number} userStoryId - User story ID
   * @returns {Promise} - Promise with updated sprint backlog
   */
  addUserStoryToSprintBacklog: (sprintBacklogId, userStoryId) =>
    api.post(`/api/sprint-backlogs/${sprintBacklogId}/add-user-story/${userStoryId}`),

  /**
   * Get user stories in sprint backlog
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @returns {Promise} - Promise with user stories list
   */
  getUserStoriesInSprintBacklog: (sprintBacklogId) => api.get(`/api/sprint-backlogs/${sprintBacklogId}/user-stories`),

  /**
   * Get tasks by status in sprint backlog
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @param {string} status - Task status
   * @returns {Promise} - Promise with tasks list
   */
  getTasksByStatus: (sprintBacklogId, status) =>
    api.get(`/api/sprint-backlogs/${sprintBacklogId}/tasks-by-status`, { params: { status } }),

  /**
   * Calculate sprint progress
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @returns {Promise} - Promise with progress percentage
   */
  calculateSprintProgress: (sprintBacklogId) => api.get(`/api/sprint-backlogs/${sprintBacklogId}/progress`),
}

