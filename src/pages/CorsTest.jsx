"use client"

import { useState } from "react"
import { ArrowLeft } from "react-feather"
import { Link } from "react-router-dom"
import { testCorsConfiguration, getCorsFixInstructions } from "../services/CorsHelper"

const CorsTest = () => {
  const [testResults, setTestResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [backendUrl, setBackendUrl] = useState("http://localhost:8084")
  const [showInstructions, setShowInstructions] = useState(false)

  const runCorsTest = async () => {
    setLoading(true)
    try {
      const results = await testCorsConfiguration(backendUrl)
      setTestResults(results)
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message,
        message: "Error running CORS test",
      })
    } finally {
      setLoading(false)
    }
  }

  const instructions = getCorsFixInstructions()

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          to="/dashboard/product-owner"
          className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CORS Configuration Test</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This tool helps diagnose CORS (Cross-Origin Resource Sharing) issues with your backend server.
        </p>

        <div className="mb-4">
          <label htmlFor="backendUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Backend URL
          </label>
          <input
            type="text"
            id="backendUrl"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={runCorsTest}
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Testing..." : "Test CORS Configuration"}
        </button>

        {testResults && (
          <div
            className={`mt-6 p-4 rounded-md ${testResults.success ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900"}`}
          >
            <h3
              className={`text-lg font-medium ${testResults.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
            >
              {testResults.success ? "Success" : "Error"}
            </h3>
            <p
              className={`mt-1 text-sm ${testResults.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
            >
              {testResults.message}
            </p>

            {testResults.corsHeaders && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">CORS Headers:</h4>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-xs overflow-auto">
                  {JSON.stringify(testResults.corsHeaders, null, 2)}
                </pre>
              </div>
            )}

            {!testResults.success && (
              <div className="mt-4">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showInstructions ? "Hide" : "Show"} CORS Fix Instructions
                </button>
              </div>
            )}
          </div>
        )}

        {showInstructions && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
              How to Fix CORS Issues in Spring Boot
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Add the following configuration class to your Spring Boot application:
            </p>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-xs overflow-auto">
              {instructions.springBootConfig}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Common API Issues</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Network Error</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
              <li>Make sure your backend server is running</li>
              <li>Check for CORS issues (run the test above)</li>
              <li>Verify the baseURL in your API configuration</li>
              <li>Check if your browser is blocking the request</li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">401 Unauthorized</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
              <li>Your authentication token may be invalid or expired</li>
              <li>Try logging out and logging back in</li>
              <li>Check the Authorization header in your requests</li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">400 Bad Request</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
              <li>The server couldn't understand the request</li>
              <li>Check the request payload structure</li>
              <li>Verify that all required fields are provided</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CorsTest

