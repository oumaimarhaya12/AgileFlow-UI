import {
    mockUsers,
    mockProjects,
    mockProductBacklogs,
    mockSprintBacklogs,
    mockSprints,
    mockUserStories,
    mockTasks,
    mockProjectStatistics,
  } from "./mockData"
  
  // Helper function to simulate API delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  
  // Mock authentication service
  export const mockAuthService = {
    login: async (credentials) => {
      await delay(500) // Simulate network delay
  
      console.log("Mock auth service login called with:", credentials)
  
      // Find user by email
      const user = mockUsers.find((u) => u.email === credentials.email)
      console.log("Found user:", user)
  
      if (!user || credentials.password !== "password") {
        // Simple password check
        console.log("Login failed: Invalid credentials")
        throw {
          response: {
            status: 401,
            data: { message: "Invalid email or password" },
          },
        }
      }
  
      if (!user.active) {
        console.log("Login failed: Account inactive")
        throw {
          response: {
            status: 403,
            data: { message: "Account is inactive" },
          },
        }
      }
  
      // Return JWT response structure
      const response = {
        data: {
          token: "mock-jwt-token-" + user.id,
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      }
  
      console.log("Login successful, returning:", response)
      return response
    },
  
    signup: async (userData) => {
      await delay(700) // Simulate network delay
  
      // Check if email already exists
      if (mockUsers.some((u) => u.email === userData.email)) {
        throw {
          response: {
            status: 400,
            data: { message: "Email already in use" },
          },
        }
      }
  
      // Check if username already exists
      if (mockUsers.some((u) => u.username === userData.username)) {
        throw {
          response: {
            status: 400,
            data: { message: "Username already in use" },
          },
        }
      }
  
      // Return success response
      return {
        data: {
          message: "User registered successfully",
        },
      }
    },
  }
  
  // Mock user service
  export const mockUserService = {
    getAllUsers: async () => {
      await delay(500)
      return { data: mockUsers }
    },
  
    getUserById: async (id) => {
      await delay(300)
      const user = mockUsers.find((u) => u.id === Number.parseInt(id))
  
      if (!user) {
        throw {
          response: {
            status: 404,
            data: { message: "User not found" },
          },
        }
      }
  
      return { data: user }
    },
  
    getUsersByProjectId: async (projectId) => {
      await delay(500)
      // For simplicity, return a subset of users for any project
      return { data: mockUsers.filter((u) => u.active).slice(0, 5) }
    },
  
    getUsersByRole: async (role) => {
      await delay(500)
      return { data: mockUsers.filter((u) => u.role === role) }
    },
  
    deleteUser: async (id) => {
      await delay(700)
      return { data: { message: "User deleted successfully" } }
    },
  
    updateUser: async (id, userData) => {
      await delay(600)
      return { data: { ...mockUsers.find((u) => u.id === Number.parseInt(id)), ...userData } }
    },
  }
  
  // Mock project service
  export const mockProjectService = {
    getAllProjects: async () => {
      await delay(500)
      return { data: mockProjects }
    },
  
    getProjectById: async (id) => {
      await delay(300)
      const project = mockProjects.find((p) => p.id === Number.parseInt(id))
  
      if (!project) {
        throw {
          response: {
            status: 404,
            data: { message: "Project not found" },
          },
        }
      }
  
      return { data: project }
    },
  
    getProjectsByUser: async (userId) => {
      await delay(500)
      // For simplicity, return all projects for any user
      return { data: mockProjects }
    },
  
    createProject: async (projectData) => {
      await delay(700)
      return {
        data: {
          ...projectData,
          id: Math.max(...mockProjects.map((p) => p.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  
    updateProject: async (id, projectData) => {
      await delay(600)
      return { data: { ...mockProjects.find((p) => p.id === Number.parseInt(id)), ...projectData } }
    },
  
    deleteProject: async (id) => {
      await delay(700)
      return { data: { message: "Project deleted successfully" } }
    },
  
    getProjectStatistics: async () => {
      await delay(400)
      return { data: mockProjectStatistics }
    },
  }
  
  // Mock product backlog service
  export const mockProductBacklogService = {
    getAllProductBacklogs: async () => {
      await delay(500)
      return { data: mockProductBacklogs }
    },
  
    getProductBacklogsByProject: async (projectId) => {
      await delay(400)
      return { data: mockProductBacklogs.filter((b) => b.projectId === Number.parseInt(projectId)) }
    },
  
    addProductBacklog: async (backlogData) => {
      await delay(600)
      return {
        data: {
          ...backlogData,
          id: Math.max(...mockProductBacklogs.map((b) => b.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  }
  
  // Mock sprint backlog service
  export const mockSprintBacklogService = {
    getSprintBacklogById: async (id) => {
      await delay(300)
      const backlog = mockSprintBacklogs.find((b) => b.id === Number.parseInt(id))
  
      if (!backlog) {
        throw {
          response: {
            status: 404,
            data: { message: "Sprint backlog not found" },
          },
        }
      }
  
      return { data: backlog }
    },
  
    getUserStoriesInSprintBacklog: async (sprintBacklogId) => {
      await delay(400)
      return { data: mockUserStories.filter((s) => s.sprintBacklogId === Number.parseInt(sprintBacklogId)) }
    },
  
    calculateSprintProgress: async (sprintBacklogId) => {
      await delay(300)
      // Calculate progress based on tasks in the sprint
      const sprintId = mockSprintBacklogs.find((b) => b.id === Number.parseInt(sprintBacklogId))?.sprintId
      if (!sprintId) return { data: 0 }
  
      const sprintTasks = mockTasks.filter((t) => t.sprintId === sprintId)
      if (sprintTasks.length === 0) return { data: 0 }
  
      const completedTasks = sprintTasks.filter((t) => t.status === "DONE").length
      const progress = Math.round((completedTasks / sprintTasks.length) * 100)
  
      return { data: progress }
    },
  }
  
  // Mock sprint service
  export const mockSprintService = {
    getAllSprints: async () => {
      await delay(500)
      return { data: mockSprints }
    },
  
    getSprintById: async (id) => {
      await delay(300)
      const sprint = mockSprints.find((s) => s.id === Number.parseInt(id))
  
      if (!sprint) {
        throw {
          response: {
            status: 404,
            data: { message: "Sprint not found" },
          },
        }
      }
  
      return { data: sprint }
    },
  
    getActiveSprintsByDate: async (date) => {
      await delay(400)
      const now = date ? new Date(date) : new Date()
  
      // Find sprints where the current date is between start and end dates
      const activeSprints = mockSprints.filter((s) => {
        const startDate = new Date(s.startDate)
        const endDate = new Date(s.endDate)
        return now >= startDate && now <= endDate
      })
  
      return { data: activeSprints }
    },
  
    createSprint: async (name, startDate, endDate, sprintBacklogId) => {
      await delay(700)
      return {
        data: {
          id: Math.max(...mockSprints.map((s) => s.id)) + 1,
          name,
          startDate,
          endDate,
          sprintBacklogId: sprintBacklogId ? Number.parseInt(sprintBacklogId) : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  
    deleteSprint: async (id) => {
      await delay(600)
      return { data: { message: "Sprint deleted successfully" } }
    },
  }
  
  // Mock user story service
  export const mockUserStoryService = {
    getAllUserStories: async () => {
      await delay(500)
      return { data: mockUserStories }
    },
  
    getUserStoryById: async (id) => {
      await delay(300)
      const story = mockUserStories.find((s) => s.id === Number.parseInt(id))
  
      if (!story) {
        throw {
          response: {
            status: 404,
            data: { message: "User story not found" },
          },
        }
      }
  
      return { data: story }
    },
  
    createUserStory: async (userStoryDTO) => {
      await delay(700)
      return {
        data: {
          ...userStoryDTO,
          id: Math.max(...mockUserStories.map((s) => s.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  
    updateUserStoryPriority: async (userStoryId, newPriority) => {
      await delay(400)
      return { data: { message: "Priority updated successfully" } }
    },
  }
  
  // Mock task service
  export const mockTaskService = {
    getAllTasks: async () => {
      await delay(500)
      return { data: mockTasks }
    },
  
    getTaskById: async (id) => {
      await delay(300)
      const task = mockTasks.find((t) => t.id === Number.parseInt(id))
  
      if (!task) {
        throw {
          response: {
            status: 404,
            data: { message: "Task not found" },
          },
        }
      }
  
      return { data: task }
    },
  
    createTask: async (title, description, status, dueDate, priority, estimatedHours, userStoryId, assignedUserId) => {
      await delay(700)
      return {
        data: {
          id: Math.max(...mockTasks.map((t) => t.id)) + 1,
          title,
          description,
          status,
          dueDate,
          priority: Number.parseInt(priority),
          estimatedHours: Number.parseFloat(estimatedHours),
          userStoryId: userStoryId ? Number.parseInt(userStoryId) : null,
          assignedUserId: assignedUserId ? Number.parseInt(assignedUserId) : null,
          assignedUserName: assignedUserId
            ? mockUsers.find((u) => u.id === Number.parseInt(assignedUserId))?.username
            : null,
          assignedUserRole: assignedUserId ? mockUsers.find((u) => u.id === Number.parseInt(assignedUserId))?.role : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
        },
      }
    },
  
    updateTask: async (id, title, description, status, dueDate, priority, estimatedHours) => {
      await delay(600)
      return {
        data: {
          ...mockTasks.find((t) => t.id === Number.parseInt(id)),
          title,
          description,
          status,
          dueDate,
          priority,
          estimatedHours,
        },
      }
    },
  
    updateStatus: async (taskId, status) => {
      await delay(400)
      return { data: { message: "Status updated successfully" } }
    },
  
    assignTaskToUser: async (taskId, userId) => {
      await delay(500)
      const user = mockUsers.find((u) => u.id === Number.parseInt(userId))
      return {
        data: {
          ...mockTasks.find((t) => t.id === Number.parseInt(taskId)),
          assignedUserId: Number.parseInt(userId),
          assignedUserName: user?.username,
          assignedUserRole: user?.role,
        },
      }
    },
  
    logHours: async (taskId, hours) => {
      await delay(400)
      const task = mockTasks.find((t) => t.id === Number.parseInt(taskId))
      return {
        data: {
          ...task,
          loggedHours: (task.loggedHours || 0) + Number.parseFloat(hours),
        },
      }
    },
  
    addComment: async (taskId, userId, content) => {
      await delay(500)
      const user = mockUsers.find((u) => u.id === Number.parseInt(userId))
      return {
        data: {
          id: Math.floor(Math.random() * 1000),
          content,
          username: user?.username,
          createdAt: new Date().toISOString(),
        },
      }
    },
  
    deleteTask: async (id) => {
      await delay(600)
      return { data: { message: "Task deleted successfully" } }
    },
  }
  
  