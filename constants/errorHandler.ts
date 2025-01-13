// utils/errorHandler.ts
export const getErrorMessage = (error: any, defaultMessage: string = "An error occurred"): string => {
    // Log the full error for debugging
    console.error("Full error object:", error);
    console.error("Response data:", error?.response?.data);
  
    // Check for network or timeout errors
    if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
      return "Connection timeout. Please check your internet connection and try again.";
    }
  
    // Check for 504 error first
    if (error?.response?.status === 504 || error?.response?.data?.error?.code === "504") {
      return "Something went wrong, please try again later";
    }
  
    // Check for other specific status codes
    if (error?.response?.status === 401) {
      return "Session expired. Please login again.";
    }
  
    if (error?.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
  
    if (error?.response?.status === 429) {
      const retryAfter = error?.response?.headers?.['retry-after'];
      if (retryAfter) {
        return `Too many requests. Please try again in ${retryAfter} seconds.`;
      }
      return "Too many requests. Please try again later.";
    }
  
    // Handle nested error object
    if (error?.response?.data?.error) {
      if (typeof error.response.data.error === 'object') {
        return error.response.data.error.message || defaultMessage;
      }
      return error.response.data.error;
    }
  
    // Check other common error locations
    if (error?.response?.data?.detail) {
      return error.response.data.detail;
    }
  
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
  
    if (error?.message && !error.message.includes("Network Error")) {
      return error.message;
    }
   
    
  
    return defaultMessage;
  };