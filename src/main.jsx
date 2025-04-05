import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { mockUsers } from "./services/mockData"

// Log available test users
console.log("Available test users:")
mockUsers.forEach((user) => {
  console.log(`- ${user.email} (${user.role}) - use password: "password"`)
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

