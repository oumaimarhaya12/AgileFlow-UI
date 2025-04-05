import api from "./api"

export const userStoryService = {
  /**
   * Create a new user story
   * @param {Object} userStoryDTO - User story data
   * @returns {Promise} - Promise with created user story
   */
  createUserStory: (userStoryDTO) => api.post("/api/userstories", userStoryDTO),

  /**
   * Get user story by ID
   * @param {number} id - User story ID
   * @returns {Promise} - Promise with user story data
   */
  getUserStoryById: (id) => api.get(`/api/userstories/${id}`),

  /**
   * Get all user stories
   * @returns {Promise} - Promise with user stories list
   */
  getAllUserStories: () => api.get("/api/userstories"),

  /**
   * Delete a user story
   * @param {number} id - User story ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteUserStory: (id) => api.delete(`/api/userstories/${id}`),

  /**
   * Link user story to epic
   * @param {number} userStoryId - User story ID
   * @param {number} epicId - Epic ID
   * @returns {Promise} - Promise with updated user story
   */
  linkUserStoryToEpic: (userStoryId, epicId) => api.post(`/api/userstories/${userStoryId}/epic/${epicId}`),

  /**
   * Get user stories by epic
   * @param {number} epicId - Epic ID
   * @returns {Promise} - Promise with user stories list
   */
  getUserStoriesByEpic: (epicId) => api.get(`/api/userstories/epic/${epicId}`),

  /**
   * Add user story to sprint backlog
   * @param {number} userStoryId - User story ID
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @returns {Promise} - Promise with updated user story
   */
  addUserStoryToSprintBacklog: (userStoryId, sprintBacklogId) =>
    api.post(`/api/userstories/${userStoryId}/sprint/${sprintBacklogId}`),

  /**
   * Get user stories by sprint backlog
   * @param {number} sprintBacklogId - Sprint backlog ID
   * @returns {Promise} - Promise with user stories list
   */
  getUserStoriesBySprintBacklog: (sprintBacklogId) => api.get(`/api/userstories/sprint/${sprintBacklogId}`),

  /**
   * Update user story priority
   * @param {number} userStoryId - User story ID
   * @param {number} newPriority - New priority
   * @returns {Promise} - Promise with updated user story
   */
  updateUserStoryPriority: (userStoryId, newPriority) =>
    api.patch(`/api/userstories/${userStoryId}/priority/${newPriority}`),

  /**
   * Update acceptance criteria
   * @param {number} userStoryId - User story ID
   * @param {string} acceptanceCriteria - New acceptance criteria
   * @returns {Promise} - Promise with updated user story
   */
  updateAcceptanceCriteria: (userStoryId, acceptanceCriteria) =>
    api.patch(`/api/userstories/${userStoryId}/criteria`, acceptanceCriteria),
}

