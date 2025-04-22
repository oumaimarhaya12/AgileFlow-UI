import api from "./api"

export const taskService = {
  /**
   * Create a new task
   * @param {string} title - Task title
   * @param {string} description - Task description
   * @param {string} status - Task status
   * @param {string} dueDate - Task due date
   * @param {number} priority - Task priority
   * @param {number} estimatedHours - Estimated hours
   * @param {number} userStoryId - User story ID (optional)
   * @param {number} assignedUserId - Assigned user ID (optional)
   * @returns {Promise} - Promise with created task
   */
  createTask: (title, description, status, dueDate, priority, estimatedHours, userStoryId, assignedUserId) =>
    api.post("/api/tasks", null, {
      params: {
        title,
        description,
        status,
        dueDate,
        priority,
        estimatedHours,
        userStoryId,
        assignedUserId,
      },
    }),

  /**
   * Get all tasks
   * @returns {Promise} - Promise with tasks list
   */
  getAllTasks: () => api.get("/api/tasks"),

  /**
   * Get task by ID
   * @param {number} id - Task ID
   * @returns {Promise} - Promise with task data
   */
  getTaskById: (id) => api.get(`/api/tasks/${id}`),

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {string} title - Updated task title (optional)
   * @param {string} description - Updated task description (optional)
   * @param {string} status - Updated task status (optional)
   * @param {string} dueDate - Updated task due date (optional)
   * @param {number} priority - Updated task priority (optional)
   * @param {number} estimatedHours - Updated estimated hours (optional)
   * @returns {Promise} - Promise with updated task
   */
  updateTask: (id, title, description, status, dueDate, priority, estimatedHours) =>
    api.put(`/api/tasks/${id}`, null, {
      params: {
        title,
        description,
        status,
        dueDate,
        priority,
        estimatedHours,
      },
    }),

  /**
   * Assign task to user
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with updated task
   */
  assignTaskToUser: (taskId, userId) => api.post(`/api/tasks/${taskId}/assign/${userId}`),

  /**
   * Log hours for a task
   * @param {number} taskId - Task ID
   * @param {number} hours - Hours to log
   * @returns {Promise} - Promise with updated task
   */
  logHours: (taskId, hours) => api.post(`/api/tasks/${taskId}/log-hours`, null, { params: { hours } }),

  /**
   * Update task status
   * @param {number} taskId - Task ID
   * @param {string} status - New status
   * @returns {Promise} - Promise with updated task
   */
  updateStatus: (taskId, status) => api.post(`/api/tasks/${taskId}/update-status`, null, { params: { status } }),

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),

  /**
   * Add a comment to a task
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID
   * @param {string} content - Comment content
   * @returns {Promise} - Promise with updated task
   */
  addComment: (taskId, userId, content) =>
    api.post(`/api/tasks/${taskId}/comments`, null, { params: { userId, content } }),
}
