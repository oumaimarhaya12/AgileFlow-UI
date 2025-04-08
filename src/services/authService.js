import api from "./api"

export const authService = {
  /**
   * Login with username and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - User password
   * @returns {Promise} - Promise with login response
   */
  login: (credentials) => {
    console.log("Sending login request to /api/auth/login with:", credentials)
    // Make sure we're sending the exact structure expected by the backend LoginRequest class
    const loginRequest = {
      username: credentials.username,
      password: credentials.password,
    }
    return api.post("/api/auth/login", loginRequest)
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration response
   */
  signup: (userData) => {
    console.log("Sending signup request to /api/auth/signup with:", userData)
    return api.post("/api/auth/signup", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    })
  },

  /**
   * Test authentication endpoint
   * @returns {Promise} - Promise with test response
   */
  testAuth: () => {
    return api.get("/api/auth/test")
  },
}
