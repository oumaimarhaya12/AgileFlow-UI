/**
 * Helper functions to diagnose and fix CORS issues
 */

/**
 * Tests if the backend server is accessible and CORS is properly configured
 * @param {string} baseUrl - The base URL of the backend server
 * @returns {Promise<Object>} - Promise with test results
 */
export const testCorsConfiguration = async (baseUrl = "http://localhost:8084") => {
    try {
      // Create a simple OPTIONS request to test CORS preflight
      const response = await fetch(`${baseUrl}/api/auth/test`, {
        method: "OPTIONS",
        headers: {
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
          Origin: window.location.origin,
        },
      })
  
      // Check if the response has the necessary CORS headers
      const corsHeaders = {
        "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
        "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
        "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
        "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials"),
      }
  
      return {
        success: response.ok,
        status: response.status,
        corsHeaders,
        message: response.ok ? "CORS is properly configured" : "CORS preflight request failed",
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Could not connect to the backend server. Make sure it's running and accessible.",
      }
    }
  }
  
  /**
   * Provides instructions for fixing CORS issues in Spring Boot
   * @returns {Object} - Object with instructions
   */
  export const getCorsFixInstructions = () => {
    return {
      springBootConfig: `
      // Add this class to your Spring Boot application
      
      import org.springframework.context.annotation.Bean;
      import org.springframework.context.annotation.Configuration;
      import org.springframework.web.cors.CorsConfiguration;
      import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
      import org.springframework.web.filter.CorsFilter;
  
      @Configuration
      public class CorsConfig {
          @Bean
          public CorsFilter corsFilter() {
              UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
              CorsConfiguration config = new CorsConfiguration();
              
              // Allow all origins, or specify your frontend URL
              config.addAllowedOrigin("*");
              // Allow credentials if needed
              config.setAllowCredentials(false);
              // Allow common HTTP methods
              config.addAllowedMethod("GET");
              config.addAllowedMethod("POST");
              config.addAllowedMethod("PUT");
              config.addAllowedMethod("DELETE");
              config.addAllowedMethod("OPTIONS");
              // Allow common headers
              config.addAllowedHeader("Origin");
              config.addAllowedHeader("Content-Type");
              config.addAllowedHeader("Accept");
              config.addAllowedHeader("Authorization");
              
              source.registerCorsConfiguration("/**", config);
              return new CorsFilter(source);
          }
      }
      `,
    }
  }
  
  /**
   * Diagnoses common API issues
   * @param {Error} error - The error object from an API call
   * @returns {Object} - Object with diagnosis and potential solutions
   */
  export const diagnoseApiIssue = (error) => {
    const diagnosis = {
      issue: "Unknown error",
      solutions: ["Check the browser console for more details"],
    }
  
    if (!error) {
      return diagnosis
    }
  
    if (error.message === "Network Error") {
      diagnosis.issue = "Network Error"
      diagnosis.solutions = [
        "Make sure your backend server is running",
        "Check for CORS issues (see testCorsConfiguration)",
        "Verify the baseURL in your API configuration",
        "Check if your browser is blocking the request",
      ]
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      diagnosis.issue = `Server responded with status ${error.response.status}`
  
      if (error.response.status === 401) {
        diagnosis.solutions = [
          "Your authentication token may be invalid or expired",
          "Try logging out and logging back in",
          "Check the Authorization header in your requests",
        ]
      } else if (error.response.status === 403) {
        diagnosis.solutions = [
          "You don't have permission to access this resource",
          "Check your user role and permissions",
        ]
      } else if (error.response.status === 404) {
        diagnosis.solutions = [
          "The requested resource was not found",
          "Check the URL path in your API call",
          "Verify that the endpoint exists on your backend",
        ]
      } else if (error.response.status === 400) {
        diagnosis.solutions = [
          "The server couldn't understand the request",
          "Check the request payload structure",
          "Verify that all required fields are provided",
        ]
      } else if (error.response.status === 500) {
        diagnosis.solutions = [
          "Server encountered an error",
          "Check your backend logs for more details",
          "This is likely a backend issue, not a frontend issue",
        ]
      }
    } else if (error.request) {
      // The request was made but no response was received
      diagnosis.issue = "No response received from server"
      diagnosis.solutions = [
        "Check if your backend server is running",
        "Verify network connectivity",
        "Check for CORS issues (see testCorsConfiguration)",
      ]
    }
  
    return diagnosis
  }
  
  