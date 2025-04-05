import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import {
  mockAuthService,
  mockUserService,
  mockProjectService,
  mockProductBacklogService,
  mockSprintBacklogService,
  mockSprintService,
  mockUserStoryService,
  mockTaskService,
} from "./mockService"

// Create a mock adapter instance
const mock = new MockAdapter(axios, { delayResponse: 300 })

// Setup mock API endpoints
export const setupMockServices = () => {
  console.log("Setting up mock services...")

  // Auth endpoints
  mock.onPost("/api/auth/login").reply(async (config) => {
    try {
      const data = JSON.parse(config.data)
      console.log("Mock login request received:", data)
      const response = await mockAuthService.login(data)
      console.log("Mock login response:", response.data)
      return [200, response.data]
    } catch (error) {
      console.error("Mock login error:", error)
      return [error.response.status || 401, error.response.data || { message: "Invalid credentials" }]
    }
  })

  mock.onPost("/api/auth/signup").reply(async (config) => {
    try {
      const data = JSON.parse(config.data)
      const response = await mockAuthService.signup(data)
      return [200, response.data]
    } catch (error) {
      return [error.response.status, error.response.data]
    }
  })

  // User endpoints
  mock.onGet("/api/users").reply(async () => {
    const response = await mockUserService.getAllUsers()
    return [200, response.data]
  })

  mock.onGet(/\/api\/users\/\d+/).reply(async (config) => {
    try {
      const id = config.url.split("/").pop()
      const response = await mockUserService.getUserById(id)
      return [200, response.data]
    } catch (error) {
      return [error.response.status, error.response.data]
    }
  })

  mock.onGet(/\/api\/users\/project\/\d+/).reply(async (config) => {
    const projectId = config.url.split("/").pop()
    const response = await mockUserService.getUsersByProjectId(projectId)
    return [200, response.data]
  })

  mock.onGet("/api/users/role").reply(async (config) => {
    const role = config.params.role
    const response = await mockUserService.getUsersByRole(role)
    return [200, response.data]
  })

  mock.onDelete(/\/api\/users\/\d+/).reply(async (config) => {
    const id = config.url.split("/").pop()
    const response = await mockUserService.deleteUser(id)
    return [200, response.data]
  })

  mock.onPut(/\/api\/users\/\d+/).reply(async (config) => {
    const id = config.url.split("/").pop()
    const data = JSON.parse(config.data)
    const response = await mockUserService.updateUser(id, data)
    return [200, response.data]
  })

  // Project endpoints
  mock.onGet("/api/projects").reply(async () => {
    const response = await mockProjectService.getAllProjects()
    return [200, response.data]
  })

  mock.onGet(/\/api\/projects\/\d+/).reply(async (config) => {
    try {
      const id = config.url.split("/").pop()
      const response = await mockProjectService.getProjectById(id)
      return [200, response.data]
    } catch (error) {
      return [error.response.status, error.response.data]
    }
  })

  mock.onGet(/\/api\/projects\/user\/\d+/).reply(async (config) => {
    const userId = config.url.split("/").pop()
    const response = await mockProjectService.getProjectsByUser(userId)
    return [200, response.data]
  })

  mock.onPost("/api/projects").reply(async (config) => {
    const data = JSON.parse(config.data)
    const response = await mockProjectService.createProject(data)
    return [200, response.data]
  })

  mock.onPut(/\/api\/projects\/\d+/).reply(async (config) => {
    const id = config.url.split("/").pop()
    const data = JSON.parse(config.data)
    const response = await mockProjectService.updateProject(id, data)
    return [200, response.data]
  })

  mock.onDelete(/\/api\/projects\/\d+/).reply(async (config) => {
    const id = config.url.split("/").pop()
    const response = await mockProjectService.deleteProject(id)
    return [200, response.data]
  })

  mock.onGet("/api/projects/statistics").reply(async () => {
    const response = await mockProjectService.getProjectStatistics()
    return [200, response.data]
  })

  // Product Backlog endpoints
  mock.onGet("/api/productbacklogs").reply(async () => {
    const response = await mockProductBacklogService.getAllProductBacklogs()
    return [200, response.data]
  })

  mock.onGet(/\/api\/productbacklogs\/project\/\d+/).reply(async (config) => {
    const projectId = config.url.split("/").pop()
    const response = await mockProductBacklogService.getProductBacklogsByProject(projectId)
    return [200, response.data]
  })

  mock.onPost("/api/productbacklogs").reply(async (config) => {
    const data = JSON.parse(config.data)
    const response = await mockProductBacklogService.addProductBacklog(data)
    return [200, response.data]
  })

  // Sprint Backlog endpoints
  mock.onGet(/\/api\/sprint-backlogs\/\d+/).reply(async (config) => {
    try {
      const id = config.url.split("/").pop()
      const response = await mockSprintBacklogService.getSprintBacklogById(id)
      return [200, response.data]
    } catch (error) {
      return [error.response.status, error.response.data]
    }
  })

  mock.onGet(/\/api\/sprint-backlogs\/\d+\/user-stories/).reply(async (config) => {
    const id = config.url.split("/")[2]
    const response = await mockSprintBacklogService.getUserStoriesInSprintBacklog(id)
    return [200, response.data]
  })

  mock.onGet(/\/api\/sprint-backlogs\/\d+\/progress/).reply(async (config) => {
    const id = config.url.split("/")[2]
    const response = await mockSprintBacklogService.calculateSprintProgress(id)
    return [200, response.data]
  })

  // Sprint endpoints
  mock.onGet("/api/sprints").reply(async () => {
    const response = await mockSprintService.getAllSprints()
    return [200, response.data]
  })

  mock.onGet(/\/api\/sprints\/\d+/).reply(async (config) => {
    try {
      const id = config.url.split("/").pop()
      const response = await mockSprintService.getSprintById(id)
      return [200, response.data]
    } catch (error) {
      return [error.response.status, error.response.data]
    }
  })

  mock.onGet("/api/sprints/active").reply(async (config) => {
    const date = config.params?.date
    const response = await mockSprintService.getActiveSprintsByDate(date)
    return [200, response.data]
  })

  mock.onPost("/api/sprints").reply(async (config) => {
    const { name, startDate, endDate, sprintBacklogId } = config.params
    const response = await mockSprintService.createSprint(name, startDate, endDate, sprintBacklogId)
    return [200, response.data]
  })

  mock.onDelete(/\/api\/sprints\/\d+/).reply(async (config) => {
    const id = config.url.split("/").pop()
    const response = await mockSprintService.deleteSprint(id)
    return [200, response.data]
  })

  // User Story endpoints
  mock.onGet("/api/userstories").reply(async () => {
    const response = await mockUserStoryService.getAllUserStories()
    return [200, response.data]
  })

  mock.onGet(/\/api\/userstories\/\d+/).reply(async (config) => {
    try {
      const id = config.url.split("/").pop()
      const response = await mockUserStoryService.getUserStoryById(id)
      return [200, response.data]
    } catch (error) {
      return [error.response.status, error.response.data]
    }
  })

  mock.onPost("/api/userstories").reply(async (config) => {
    const data = JSON.parse(config.data)
    const response = await mockUserStoryService.createUserStory(data)
    return [200, response.data]
  })

  mock.onPatch(/\/api\/userstories\/\d+\/priority\/\d+/).reply(async (config) => {
    const parts = config.url.split("/")
    const userStoryId = parts[2]
    const newPriority = parts[4]
    const response = await mockUserStoryService.updateUserStoryPriority(userStoryId, newPriority)
    return [200, response.data]
  })

  // Task endpoints
  mock.onGet("/api/tasks").reply(async () => {
    const response = await mockTaskService.getAllTasks()
    return [200, response.data]
  })

  mock.onGet(/\/api\/tasks\/\d+/).reply(async (config) => {
    try {
      const id = config.url.split("/").pop()
      const response = await mockTaskService.getTaskById(id)
      return [200, response.data]
    } catch (error) {
      return [error.response.status, error.response.data]
    }
  })

  mock.onPost("/api/tasks").reply(async (config) => {
    const { title, description, status, dueDate, priority, estimatedHours, userStoryId, assignedUserId } = config.params
    const response = await mockTaskService.createTask(
      title,
      description,
      status,
      dueDate,
      priority,
      estimatedHours,
      userStoryId,
      assignedUserId,
    )
    return [200, response.data]
  })

  mock.onPut(/\/api\/tasks\/\d+/).reply(async (config) => {
    const id = config.url.split("/").pop()
    const { title, description, status, dueDate, priority, estimatedHours } = config.params
    const response = await mockTaskService.updateTask(id, title, description, status, dueDate, priority, estimatedHours)
    return [200, response.data]
  })

  mock.onPost(/\/api\/tasks\/\d+\/update-status/).reply(async (config) => {
    const id = config.url.split("/")[2]
    const { status } = config.params
    const response = await mockTaskService.updateStatus(id, status)
    return [200, response.data]
  })

  mock.onPost(/\/api\/tasks\/\d+\/assign\/\d+/).reply(async (config) => {
    const parts = config.url.split("/")
    const taskId = parts[2]
    const userId = parts[4]
    const response = await mockTaskService.assignTaskToUser(taskId, userId)
    return [200, response.data]
  })

  mock.onPost(/\/api\/tasks\/\d+\/log-hours/).reply(async (config) => {
    const id = config.url.split("/")[2]
    const { hours } = config.params
    const response = await mockTaskService.logHours(id, hours)
    return [200, response.data]
  })

  mock.onPost(/\/api\/tasks\/\d+\/comments/).reply(async (config) => {
    const id = config.url.split("/")[2]
    const { userId, content } = config.params
    const response = await mockTaskService.addComment(id, userId, content)
    return [200, response.data]
  })

  mock.onDelete(/\/api\/tasks\/\d+/).reply(async (config) => {
    const id = config.url.split("/").pop()
    const response = await mockTaskService.deleteTask(id)
    return [200, response.data]
  })

  console.log("Mock services setup complete")
}

