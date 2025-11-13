import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { User } from '@shared/schema';

// JWT secret - MUST be set via environment variable for security
// SECURITY: Fail immediately if JWT_SECRET is not configured
// This prevents deployment with insecure default secrets
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    // In development, use a secure random secret but warn
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  WARNING: JWT_SECRET not set. Using random secret for development only.');
      // Generate a random secret for development
      return crypto.randomBytes(32).toString('hex');
    } else {
      // In production, FAIL HARD - never use a default secret
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable must be set in production!');
    }
  }
  
  return secret;
}

const JWT_SECRET = getJwtSecret();

const JWT_EXPIRY = '7d'; // 7 days

export interface JwtPayload {
  userId: string;
  phone: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    phone: user.phone,
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRY,
    issuer: 'superpay-app',
    audience: 'superpay-users'
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'superpay-app',
      audience: 'superpay-users'
    }) as JwtPayload;
    
    return decoded;
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null;
  }
}

/**
 * Extract token from Authorization header or cookie
 */
export function extractTokenFromRequest(req: any): string | null {
  // First check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Then check httpOnly cookie
  const cookieToken = req.cookies?.auth_token;
  if (cookieToken) {
    return cookieToken;
  }
  
  return null;
}

/**
 * Cookie options for secure httpOnly cookies
 */
export const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/'
});