/**
 * Server Configuration
 * 
 * Centralized configuration management for the application.
 * All environment variables should be accessed through this module.
 */

const env = process.env;

/**
 * Application Environment
 */
export const NODE_ENV = env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_TEST = NODE_ENV === 'test';

/**
 * Server Configuration
 */
export const SERVER_CONFIG = {
  port: parseInt(env.PORT || '5000', 10),
  host: env.HOST || '0.0.0.0',
  corsOrigins: IS_PRODUCTION
    ? (env.CORS_ORIGINS || '').split(',').filter(Boolean)
    : ['http://localhost:5000', 'http://localhost:5173'],
} as const;

/**
 * Database Configuration
 */
export const DATABASE_CONFIG = {
  url: env.DATABASE_URL,
  maxConnections: parseInt(env.DB_MAX_CONNECTIONS || '20', 10),
  idleTimeout: parseInt(env.DB_IDLE_TIMEOUT || '30000', 10), // 30 seconds
} as const;

/**
 * Redis Configuration (for production rate limiting and sessions)
 */
export const REDIS_CONFIG = {
  url: env.REDIS_URL,
  enabled: IS_PRODUCTION && Boolean(env.REDIS_URL),
} as const;

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  jwtSecret: env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: env.JWT_EXPIRES_IN || '7d',
  otpExpiryMinutes: parseInt(env.OTP_EXPIRY_MINUTES || '10', 10),
  otpMode: env.OTP_MODE || (IS_DEVELOPMENT ? 'mock' : 'real'), // mock | real
  maxOtpAttempts: parseInt(env.MAX_OTP_ATTEMPTS || '3', 10),
} as const;

/**
 * Rate Limiting Configuration
 */
export const RATE_LIMIT_CONFIG = {
  enabled: env.RATE_LIMIT_ENABLED !== 'false', // Enabled by default
  storage: REDIS_CONFIG.enabled ? 'redis' : 'memory',
  
  // Per-endpoint limits
  limits: {
    OTP_GENERATION: { 
      maxAttempts: parseInt(env.RATE_LIMIT_OTP_GEN || '3', 10),
      windowMs: 15 * 60 * 1000 
    },
    OTP_VERIFICATION: { 
      maxAttempts: parseInt(env.RATE_LIMIT_OTP_VERIFY || '5', 10),
      windowMs: 15 * 60 * 1000 
    },
    LOAN_APPLICATION: { 
      maxAttempts: parseInt(env.RATE_LIMIT_LOAN_APP || '3', 10),
      windowMs: 60 * 60 * 1000 
    },
    GENERAL_API: { 
      maxAttempts: parseInt(env.RATE_LIMIT_GENERAL || '100', 10),
      windowMs: 15 * 60 * 1000 
    },
    UPI_PAYMENT: { 
      maxAttempts: parseInt(env.RATE_LIMIT_UPI || '20', 10),
      windowMs: 15 * 60 * 1000 
    },
    UPI_COLLECT: { 
      maxAttempts: parseInt(env.RATE_LIMIT_UPI_COLLECT || '10', 10),
      windowMs: 15 * 60 * 1000 
    },
    UPI_BILL_PAYMENT: { 
      maxAttempts: parseInt(env.RATE_LIMIT_BILL || '15', 10),
      windowMs: 15 * 60 * 1000 
    },
    UPI_EMI_PAYMENT: { 
      maxAttempts: parseInt(env.RATE_LIMIT_EMI || '5', 10),
      windowMs: 60 * 60 * 1000 
    },
    BOOKING_CREATION: { 
      maxAttempts: parseInt(env.RATE_LIMIT_BOOKING || '10', 10),
      windowMs: 15 * 60 * 1000 
    },
    HOLD_CREATION: { 
      maxAttempts: parseInt(env.RATE_LIMIT_HOLD || '20', 10),
      windowMs: 15 * 60 * 1000 
    },
    CARD_CREATION: { 
      maxAttempts: parseInt(env.RATE_LIMIT_CARD || '5', 10),
      windowMs: 60 * 60 * 1000 
    },
    REVIEW_CREATION: { 
      maxAttempts: parseInt(env.RATE_LIMIT_REVIEW || '10', 10),
      windowMs: 15 * 60 * 1000 
    },
  },
} as const;

/**
 * Security Configuration
 */
export const SECURITY_CONFIG = {
  // Content Security Policy
  csp: {
    enabled: env.CSP_ENABLED !== 'false', // Enabled by default
    reportOnly: env.CSP_REPORT_ONLY === 'true', // Report-only mode for testing
    reportUri: env.CSP_REPORT_URI || null,
    
    // Allowed domains (production should whitelist specific domains)
    allowedScriptSources: IS_PRODUCTION
      ? (env.CSP_SCRIPT_SRC || 'self').split(',')
      : ['self', 'unsafe-inline', 'unsafe-eval'], // Development allows inline
    
    allowedStyleSources: IS_PRODUCTION
      ? (env.CSP_STYLE_SRC || 'self https://fonts.googleapis.com').split(',')
      : ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
    
    allowedFontSources: ['self', 'https://fonts.gstatic.com'],
    
    allowedImageSources: ['self', 'data:', 'https:'],
    
    allowedConnectSources: IS_PRODUCTION
      ? (env.CSP_CONNECT_SRC || 'self').split(',')
      : ['self', 'https://api.openai.com', 'wss:', 'ws:'],
  },
  
  // CORS
  cors: {
    enabled: env.CORS_ENABLED !== 'false',
    credentials: true,
  },
  
  // Headers
  headers: {
    hsts: {
      enabled: IS_PRODUCTION,
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    frameOptions: 'DENY',
    xssProtection: true,
  },
  
  // Input Sanitization
  sanitization: {
    enabled: env.SANITIZATION_ENABLED !== 'false',
  },
} as const;

/**
 * Payment Configuration
 */
export const PAYMENT_CONFIG = {
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    enabled: Boolean(env.STRIPE_SECRET_KEY),
  },
} as const;

/**
 * External Services Configuration
 */
export const SERVICES_CONFIG = {
  openai: {
    apiKey: env.OPENAI_API_KEY,
    enabled: Boolean(env.OPENAI_API_KEY),
  },
  sms: {
    provider: env.SMS_PROVIDER || 'mock',
    apiKey: env.SMS_API_KEY,
    enabled: env.SMS_PROVIDER !== 'mock' && Boolean(env.SMS_API_KEY),
  },
} as const;

/**
 * Logging Configuration
 */
export const LOGGING_CONFIG = {
  level: env.LOG_LEVEL || (IS_PRODUCTION ? 'info' : 'debug'),
  format: env.LOG_FORMAT || (IS_PRODUCTION ? 'json' : 'pretty'),
  
  // Sentry or other error tracking
  errorTracking: {
    enabled: IS_PRODUCTION && Boolean(env.SENTRY_DSN),
    dsn: env.SENTRY_DSN,
    environment: NODE_ENV,
    tracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  },
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  maintenanceMode: env.MAINTENANCE_MODE === 'true',
  newUserRegistration: env.ALLOW_REGISTRATION !== 'false',
  aiFeatures: SERVICES_CONFIG.openai.enabled,
  paymentProcessing: PAYMENT_CONFIG.stripe.enabled,
} as const;

/**
 * Validate critical configuration on startup
 */
export function validateConfig(): void {
  const errors: string[] = [];
  
  // Critical validations for production
  if (IS_PRODUCTION) {
    if (!env.DATABASE_URL) {
      errors.push('DATABASE_URL is required in production');
    }
    
    if (AUTH_CONFIG.jwtSecret === 'dev-secret-change-in-production') {
      errors.push('JWT_SECRET must be set to a secure value in production');
    }
    
    if (!REDIS_CONFIG.url) {
      console.warn('⚠️  REDIS_URL not set - using in-memory storage (not recommended for production)');
    }
    
    if (SECURITY_CONFIG.csp.allowedScriptSources.includes('unsafe-inline') ||
        SECURITY_CONFIG.csp.allowedScriptSources.includes('unsafe-eval')) {
      console.warn('⚠️  CSP allows unsafe-inline or unsafe-eval in production - security risk!');
    }
  }
  
  // General validations
  if (PAYMENT_CONFIG.stripe.enabled && !PAYMENT_CONFIG.stripe.webhookSecret) {
    console.warn('⚠️  Stripe enabled but STRIPE_WEBHOOK_SECRET not set');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    throw new Error('Invalid configuration - cannot start server');
  }
  
  // Log configuration status
  console.log('✅ Configuration validated successfully');
  console.log(`   Environment: ${NODE_ENV}`);
  console.log(`   Database: ${env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`   Redis: ${REDIS_CONFIG.enabled ? 'Enabled' : 'Disabled (using in-memory)'}`);
  console.log(`   Rate Limiting: ${RATE_LIMIT_CONFIG.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   Stripe: ${PAYMENT_CONFIG.stripe.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   OpenAI: ${SERVICES_CONFIG.openai.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   CSP: ${SECURITY_CONFIG.csp.enabled ? 'Enabled' : 'Disabled'}`);
}

/**
 * Export all configuration
 */
export const config = {
  env: NODE_ENV,
  isProduction: IS_PRODUCTION,
  isDevelopment: IS_DEVELOPMENT,
  isTest: IS_TEST,
  server: SERVER_CONFIG,
  database: DATABASE_CONFIG,
  redis: REDIS_CONFIG,
  auth: AUTH_CONFIG,
  rateLimit: RATE_LIMIT_CONFIG,
  security: SECURITY_CONFIG,
  payment: PAYMENT_CONFIG,
  services: SERVICES_CONFIG,
  logging: LOGGING_CONFIG,
  features: FEATURE_FLAGS,
} as const;

export default config;
