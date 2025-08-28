// Centralized logging utility
const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  error: (message, error) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    }
    // In production, you could send to error tracking service
    // like Sentry, LogRocket, etc.
  },
  
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}; 