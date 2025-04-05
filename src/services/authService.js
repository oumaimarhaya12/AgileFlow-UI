import axios from "axios"

export const authService = {
  /**
   * Login with email and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} - Promise with login response
   */
  login: (credentials) => {
    console.log("Sending login request to /api/auth/login with:", credentials)
    // Make sure we're sending the exact structure expected by the backend
    const loginRequest = {
      email: credentials.email,
      password: credentials.password,
    }
    return axios.post("/api/auth/login", loginRequest)
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration response
   */
  signup: (userData) => {
    console.log("Sending signup request to /api/auth/signup with:", userData)
    // Make sure we're sending the exact structure expected by the backend
    const signupRequest = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    }
    return axios.post("/api/auth/signup", signupRequest)
  },
}

