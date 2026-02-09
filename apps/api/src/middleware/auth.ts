import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware: Verify JWT token
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. GET: Token from header
    // Format: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // 2. EXTRACT: Token (remove "Bearer " prefix)
    // TODO: Get token from "Bearer <token>"
    // Hint: const token = authHeader.split(' ')[1];

    const token = authHeader.split(' ')[1];

    // 3. VERIFY: Token
    // TODO: Use verifyAccessToken(token)

    const decoded = verifyAccessToken(token);

    // 4. ATTACH: User info to request
    req.user = decoded;

    // 5. CONTINUE: To next middleware
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }

    next(error);
  }
};

/**
 * Middleware: Check if user is admin
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // This middleware must come AFTER authenticate

  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  // TODO: Check if user role is 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }

  next();
};
