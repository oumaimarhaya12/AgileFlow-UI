import api from "./api"

export const userService = {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} password - User password
   * @returns {Promise} - Promise with created user
   */
  createUser: (userData, password) => api.post("/api/users", userData, { params: { password } }),

  /**
   * Get all users
   * @returns {Promise} - Promise with users list
   */
  getAllUsers: () => api.get("/api/users"),

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise} - Promise with user data
   */
  getUserById: (id) => api.get(`/api/users/${id}`),

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with updated user
   */
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteUser: (id) => api.delete(`/api/users/${id}`),

  /**
   * Search users by username or email
   * @param {string} searchTerm - Search term
   * @returns {Promise} - Promise with search results
   */
  searchUsers: (searchTerm) => api.get("/api/users/search", { params: { searchTerm } }),

  /**
   * Check if username is available
   * @param {string} username - Username to check
   * @returns {Promise} - Promise with availability status
   */
  isUsernameAvailable: (username) => api.get("/api/users/username-available", { params: { username } }),

  /**
   * Check if email is available
   * @param {string} email - Email to check
   * @returns {Promise} - Promise with availability status
   */
  isEmailAvailable: (email) => api.get("/api/users/email-available", { params: { email } }),

  /**
   * Get users by role
   * @param {string} role - User role
   * @returns {Promise} - Promise with users list
   */
  getUsersByRole: (role) => api.get("/api/users/role", { params: { role } }),

  /**
   * Get users by multiple roles
   * @param {Array} roles - List of roles
   * @returns {Promise} - Promise with users list
   */
  getUsersByRoles: (roles) => api.get("/api/users/roles", { params: { roles } }),

  /**
   * Get users by project ID
   * @param {number} projectId - Project ID
   * @returns {Promise} - Promise with users list
   */
  getUsersByProjectId: (projectId) => api.get(`/api/users/project/${projectId}`),

  /**
   * Count users by role
   * @param {string} role - User role
   * @returns {Promise} - Promise with count
   */
  countUsersByRole: (role) => api.get("/api/users/count-by-role", { params: { role } }),
}
