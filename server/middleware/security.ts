import type { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromRequest } from "../jwt";
import { RATE_LIMIT_CONFIG, SECURITY_CONFIG, IS_PRODUCTION } from "../config";

// Rate limiting store - uses in-memory Map for now, should use Redis in production
// TODO: Implement Redis adapter when REDIS_URL is configured
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Log warning if using in-memory rate limiting in production
if (IS_PRODUCTION && !process.env.REDIS_URL) {
  console.warn('⚠️  WARNING: Using in-memory rate limiting in production. This is not recommended for production deployments.');
  console.warn('   Set REDIS_URL environment variable to use Redis-backed rate limiting.');
}

// Get client identifier (IP + User-Agent)
function getClientId(req: Request): string {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return `${ip}:${Buffer.from(userAgent).toString('base64').slice(0, 20)}`;
}

// Rate limiting middleware
export function createRateLimiter(type: keyof typeof RATE_LIMIT_CONFIG.limits) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting if disabled
    if (!RATE_LIMIT_CONFIG.enabled) {
      return next();
    }
    
    const clientId = getClientId(req);
    const key = `${type}:${clientId}`;
    const config = RATE_LIMIT_CONFIG.limits[type];
    const now = Date.now();
    
    let record = rateLimitStore.get(key);
    
    // Reset if window has expired
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + config.windowMs };
    }
    
    record.count++;
    rateLimitStore.set(key, record);
    
    if (record.count > config.maxAttempts) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', retryAfter.toString());
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
        retryAfter
      });
    }
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': config.maxAttempts.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.maxAttempts - record.count).toString(),
      'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
    });
    
    next();
  };
}

// Helper function to quote CSP keywords
function quoteCspSource(src: string): string {
  // CSP keywords need to be quoted: 'self', 'unsafe-inline', 'unsafe-eval', 'none', etc.
  const keywords = ['self', 'unsafe-inline', 'unsafe-eval', 'none', 'strict-dynamic', 'unsafe-hashes'];
  if (keywords.includes(src)) {
    return `'${src}'`;
  }
  // Already quoted or is a URL
  return src;
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Skip if CSP is disabled
  if (!SECURITY_CONFIG.csp.enabled) {
    return addSecurityHeaders(res, next);
  }
  
  // Build CSP directives from configuration
  const cspDirectives = [
    "default-src 'self'",
    `script-src ${SECURITY_CONFIG.csp.allowedScriptSources.map(quoteCspSource).join(' ')}`,
    `style-src ${SECURITY_CONFIG.csp.allowedStyleSources.map(quoteCspSource).join(' ')}`,
    `font-src ${SECURITY_CONFIG.csp.allowedFontSources.map(quoteCspSource).join(' ')}`,
    `img-src ${SECURITY_CONFIG.csp.allowedImageSources.map(quoteCspSource).join(' ')}`,
    `connect-src ${SECURITY_CONFIG.csp.allowedConnectSources.map(quoteCspSource).join(' ')}`,
    "frame-ancestors 'none'"
  ];
  
  // Add report-uri if configured
  if (SECURITY_CONFIG.csp.reportUri) {
    cspDirectives.push(`report-uri ${SECURITY_CONFIG.csp.reportUri}`);
  }
  
  const cspHeader = cspDirectives.join('; ');
  
  // Use report-only mode if configured
  if (SECURITY_CONFIG.csp.reportOnly) {
    res.set('Content-Security-Policy-Report-Only', cspHeader);
  } else {
    res.set('Content-Security-Policy', cspHeader);
  }
  
  addSecurityHeaders(res, next);
}

// Helper function to add other security headers
function addSecurityHeaders(res: Response, next: NextFunction) {
  const headers: Record<string, string> = {};
  
  // Content type options
  if (SECURITY_CONFIG.headers.noSniff) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }
  
  // Frame options
  if (SECURITY_CONFIG.headers.frameOptions) {
    headers['X-Frame-Options'] = SECURITY_CONFIG.headers.frameOptions;
  }
  
  // XSS Protection
  if (SECURITY_CONFIG.headers.xssProtection) {
    headers['X-XSS-Protection'] = '1; mode=block';
  }
  
  // HSTS (only in production with HTTPS)
  if (SECURITY_CONFIG.headers.hsts.enabled) {
    const hstsValue = [
      `max-age=${SECURITY_CONFIG.headers.hsts.maxAge}`,
      SECURITY_CONFIG.headers.hsts.includeSubDomains && 'includeSubDomains',
      SECURITY_CONFIG.headers.hsts.preload && 'preload'
    ].filter(Boolean).join('; ');
    headers['Strict-Transport-Security'] = hstsValue;
  }
  
  // Other headers
  headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  headers['Permissions-Policy'] = 'camera=(), microphone=(), location=(), payment=()';
  
  res.set(headers);
  next();
}

// Enhanced error handler
export function enhancedErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log error details for debugging (without sensitive data)
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status: err.status || 500,
    message: err.message,
    userAgent: req.headers['user-agent'],
    ip: req.ip
  };
  
  // In production, send to logging service
  console.error('API Error:', errorLog);
  
  // Sanitize error response
  const status = err.status || err.statusCode || 500;
  let message = 'An unexpected error occurred. Please try again.';
  
  // Only expose specific error types to client
  if (status === 400) {
    message = err.message || 'Invalid request data';
  } else if (status === 401) {
    message = 'Authentication required';
  } else if (status === 403) {
    message = 'Access forbidden';
  } else if (status === 404) {
    message = 'Resource not found';
  } else if (status === 429) {
    message = err.message || 'Too many requests';
  }
  
  res.status(status).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || generateRequestId()
  });
}

// Request ID generator
function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Request ID middleware
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  req.headers['x-request-id'] = req.headers['x-request-id'] || generateRequestId();
  res.set('X-Request-ID', req.headers['x-request-id'] as string);
  next();
}

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Skip if sanitization is disabled
  if (!SECURITY_CONFIG.sanitization.enabled) {
    return next();
  }
  
  // Basic input sanitization for strings
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potential XSS patterns
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    } else if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };
  
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  next();
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractTokenFromRequest(req);
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.'
    });
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
  
  // Add user info to request for use in route handlers
  req.user = { 
    id: payload.userId,
    phone: payload.phone 
  };
  next();
}

// Optional authentication middleware - populates req.user if token exists, but doesn't fail if missing
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractTokenFromRequest(req);
  
  if (token) {
    const payload = verifyToken(token);
    
    if (payload) {
      // Add user info to request if valid token exists
      req.user = { 
        id: payload.userId,
        phone: payload.phone 
      };
    }
  }
  
  // Continue regardless of authentication status
  next();
}

// Extend Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; phone?: string };
    }
  }
}