import api from "./api"

export const sprintService = {
  /**
   * Create a sprint
   * @param {string} name - Sprint name
   * @param {string} startDate - Sprint start date
   * @param {string} endDate - Sprint end date
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @returns {Promise} - Promise with created sprint
   */
  createSprint: (name, startDate, endDate, sprintBacklogId) =>
    api.post("/api/sprints", null, { params: { name, startDate, endDate, sprintBacklogId } }),

  /**
   * Get sprint by ID
   * @param {number} id - Sprint ID
   * @returns {Promise} - Promise with sprint data
   */
  getSprintById: (id) => api.get(`/api/sprints/${id}`),

  /**
   * Get all sprints
   * @returns {Promise} - Promise with sprints list
   */
  getAllSprints: () => api.get("/api/sprints"),

  /**
   * Update a sprint
   * @param {number} id - Sprint ID
   * @param {string} name - Updated sprint name
   * @param {string} startDate - Updated sprint start date
   * @param {string} endDate - Updated sprint end date
   * @returns {Promise} - Promise with updated sprint
   */
  updateSprint: (id, name, startDate, endDate) =>
    api.put(`/api/sprints/${id}`, null, { params: { name, startDate, endDate } }),

  /**
   * Delete a sprint
   * @param {number} id - Sprint ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteSprint: (id) => api.delete(`/api/sprints/${id}`),

  /**
   * Get sprints by sprint backlog ID
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @returns {Promise} - Promise with sprints list
   */
  getSprintsBySprintBacklogId: (sprintBacklogId) => api.get(`/api/sprints/backlog/${sprintBacklogId}`),

  /**
   * Get active sprints by date
   * @param {string} date - Date to check (optional)
   * @returns {Promise} - Promise with active sprints list
   */
  getActiveSprintsByDate: (date) => api.get("/api/sprints/active", { params: date ? { date } : {} }),

  /**
   * Get upcoming sprints
   * @returns {Promise} - Promise with upcoming sprints list
   */
  getUpcomingSprints: () => api.get("/api/sprints/upcoming"),

  /**
   * Get completed sprints
   * @returns {Promise} - Promise with completed sprints list
   */
  getCompletedSprints: () => api.get("/api/sprints/completed"),

  /**
   * Assign sprint to sprint backlog
   * @param {number} sprintId - Sprint ID
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @returns {Promise} - Promise with updated sprint
   */
  assignSprintToSprintBacklog: (sprintId, sprintBacklogId) =>
    api.post(`/api/sprints/${sprintId}/assign/${sprintBacklogId}`),

  /**
   * Remove sprint from sprint backlog
   * @param {number} sprintId - Sprint ID
   * @returns {Promise} - Promise with updated sprint
   */
  removeSprintFromSprintBacklog: (sprintId) => api.post(`/api/sprints/${sprintId}/remove-backlog`),

  /**
   * Get sprints by project ID
   * @param {number} projectId - Project ID
   * @returns {Promise} - Promise with sprints list
   */
  getSprintsByProjectId: (projectId) => api.get(`/api/sprints/project/${projectId}`),
}
