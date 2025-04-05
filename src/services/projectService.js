import api from "./api"

export const projectService = {
  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise} - Promise with created project
   */
  createProject: (projectData) => api.post("/api/projects", projectData),

  /**
   * Create a project with owner
   * @param {Object} projectData - Project data with userId
   * @returns {Promise} - Promise with created project
   */
  createProjectWithOwner: (projectData) => api.post("/api/projects/with-owner", projectData),

  /**
   * Update a project
   * @param {number} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise} - Promise with updated project
   */
  updateProject: (id, projectData) => api.put(`/api/projects/${id}`, projectData),

  /**
   * Get project by ID
   * @param {number} id - Project ID
   * @returns {Promise} - Promise with project data
   */
  getProjectById: (id) => api.get(`/api/projects/${id}`),

  /**
   * Get all projects
   * @returns {Promise} - Promise with projects list
   */
  getAllProjects: () => api.get("/api/projects"),

  /**
   * Get projects by user
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with projects list
   */
  getProjectsByUser: (userId) => api.get(`/api/projects/user/${userId}`),

  /**
   * Delete a project
   * @param {number} id - Project ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteProject: (id) => api.delete(`/api/projects/${id}`),

  /**
   * Get project by name
   * @param {string} projectName - Project name
   * @returns {Promise} - Promise with project data
   */
  getProjectByName: (projectName) => api.get(`/api/projects/name/${projectName}`),

  /**
   * Assign user to project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with assignment response
   */
  assignUserToProject: (projectId, userId) => api.put(`/api/projects/${projectId}/assign-user/${userId}`),

  /**
   * Remove user from project
   * @param {number} projectId - Project ID
   * @returns {Promise} - Promise with removal response
   */
  removeUserFromProject: (projectId) => api.put(`/api/projects/${projectId}/remove-user`),

  /**
   * Link project to backlog
   * @param {number} projectId - Project ID
   * @param {number} backlogId - Backlog ID
   * @returns {Promise} - Promise with link response
   */
  linkProjectToBacklog: (projectId, backlogId) => api.put(`/api/projects/${projectId}/link-backlog/${backlogId}`),

  /**
   * Unlink project from backlog
   * @param {number} projectId - Project ID
   * @returns {Promise} - Promise with unlink response
   */
  unlinkProjectFromBacklog: (projectId) => api.put(`/api/projects/${projectId}/unlink-backlog`),

  /**
   * Get project statistics
   * @returns {Promise} - Promise with statistics
   */
  getProjectStatistics: () => api.get("/api/projects/statistics"),
}

