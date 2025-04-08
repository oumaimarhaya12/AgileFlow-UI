"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Layouts
import MainLayout from "./layouts/MainLayout"

// Auth Pages
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import TestAuth from "./pages/auth/TestAuth"

// Dashboard Pages
import ProductOwnerDashboard from "./pages/dashboards/ProductOwnerDashboard"
import ScrumMasterDashboard from "./pages/dashboards/ScrumMasterDashboard"
import DeveloperDashboard from "./pages/dashboards/DeveloperDashboard"
import TesterDashboard from "./pages/dashboards/TesterDashboard"
import AdminDashboard from "./pages/dashboards/AdminDashboard"

// Project Pages
import Projects from "./pages/projects/Projects"
import ProjectDetails from "./pages/projects/ProjectDetails"
import NewProject from "./pages/projects/NewProject"
import EditProject from "./pages/projects/EditProject"

// Backlog Pages
import ProductBacklog from "./pages/backlogs/ProductBacklog"
import SprintBacklog from "./pages/backlogs/SprintBacklog"

// Sprint Pages
import Sprints from "./pages/sprint/Sprints"
import SprintDetails from "./pages/sprint/SprintDetails"

// Task Pages
import Tasks from "./pages/tasks/Tasks"
import TaskDetails from "./pages/tasks/TaskDetails"

// User Pages
import Users from "./pages/users/Users"
import UserDetails from "./pages/users/UserDetails"

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"

// Add this import
import ThemeToggle from "./components/common/ThemeToggle"

// Add the CorsTest route to the App.jsx file
import CorsTest from "./pages/CorsTest"

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case "PRODUCT_OWNER":
        return <Navigate to="/dashboard/product-owner" />
      case "SCRUM_MASTER":
        return <Navigate to="/dashboard/scrum-master" />
      case "DEVELOPER":
        return <Navigate to="/dashboard/developer" />
      case "TESTER":
        return <Navigate to="/dashboard/tester" />
      case "ADMIN":
        return <Navigate to="/dashboard/admin" />
      default:
        return <Navigate to="/login" />
    }
  }

  return children
}

// Auth Route Wrapper
const AuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  // If user is authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case "PRODUCT_OWNER":
        return <Navigate to="/dashboard/product-owner" />
      case "SCRUM_MASTER":
        return <Navigate to="/dashboard/scrum-master" />
      case "DEVELOPER":
        return <Navigate to="/dashboard/developer" />
      case "TESTER":
        return <Navigate to="/dashboard/tester" />
      case "ADMIN":
        return <Navigate to="/dashboard/admin" />
      default:
        return <Navigate to="/login" />
    }
  }

  return (
    <div className={`min-h-screen flex flex-col`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AgileFlow</h1>
            <p className="text-gray-600 dark:text-gray-400">Agile Project Management</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Root Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth Routes - Using direct components with AuthRoute wrapper */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              }
            />

            {/* Test Auth Route */}
            <Route
              path="/test-auth"
              element={
                <AuthRoute>
                  <TestAuth />
                </AuthRoute>
              }
            />

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              {/* Dashboard Routes */}
              <Route
                path="/dashboard/product-owner"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER"]}>
                    <ProductOwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/scrum-master"
                element={
                  <ProtectedRoute allowedRoles={["SCRUM_MASTER"]}>
                    <ScrumMasterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/developer"
                element={
                  <ProtectedRoute allowedRoles={["DEVELOPER"]}>
                    <DeveloperDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/tester"
                element={
                  <ProtectedRoute allowedRoles={["TESTER"]}>
                    <TesterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Project Routes */}
              <Route
                path="/projects"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "ADMIN"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "ADMIN"]}>
                    <NewProject />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "DEVELOPER", "TESTER", "ADMIN"]}>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "ADMIN"]}>
                    <EditProject />
                  </ProtectedRoute>
                }
              />

              {/* Backlog Routes */}
              <Route
                path="/backlogs/product/:projectId"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "ADMIN"]}>
                    <ProductBacklog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backlogs/sprint/:sprintId"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "DEVELOPER", "TESTER", "ADMIN"]}>
                    <SprintBacklog />
                  </ProtectedRoute>
                }
              />

              {/* Sprint Routes */}
              <Route
                path="/sprints"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "ADMIN"]}>
                    <Sprints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sprints/:id"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "DEVELOPER", "TESTER", "ADMIN"]}>
                    <SprintDetails />
                  </ProtectedRoute>
                }
              />

              {/* Task Routes */}
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "DEVELOPER", "TESTER", "ADMIN"]}>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute allowedRoles={["PRODUCT_OWNER", "SCRUM_MASTER", "DEVELOPER", "TESTER", "ADMIN"]}>
                    <TaskDetails />
                  </ProtectedRoute>
                }
              />

              {/* User Routes (Admin Only) */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <UserDetails />
                  </ProtectedRoute>
                }
              />
              {/* Add this route inside the Routes component */}
              <Route
                path="/cors-test"
                element={
                  <ProtectedRoute>
                    <CorsTest />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

