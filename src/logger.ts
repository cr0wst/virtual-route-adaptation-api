// logger.ts

import { createLogger, format, transports } from "winston";

// Define the log format
const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create the logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info", // Minimum level of messages to log
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // Include stack trace
    format.splat(), // Support for string interpolation
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize the output
        logFormat,
      ),
    }),
    // You can add more transports here (e.g., File, HTTP)
  ],
});

// Export the logger instance
export default logger;
