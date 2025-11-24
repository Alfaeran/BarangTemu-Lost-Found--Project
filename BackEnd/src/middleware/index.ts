import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import { UserService } from '../services/user.service';

// Error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // Don't log 404s as errors
    if (err.statusCode !== 404) {
      console.error(`[${err.statusCode}] ${err.message}`);
    }
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  console.error('Unhandled Error:', err);

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

// 404 Not Found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only log non-404 responses
  res.on('finish', () => {
    if (res.statusCode !== 404) {
      console.log(`${req.method} ${req.path} - ${res.statusCode}`);
    }
  });
  next();
};

// Validate JSON middleware
export const validateJSON = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'PATCH'
  ) {
    // Skip validation for multipart/form-data (file uploads)
    if (req.is('multipart/form-data')) {
      return next();
    }
    
    if (!req.is('json')) {
      const error = new AppError(
        400,
        'Content-Type must be application/json'
      );
      return next(error);
    }
  }
  next();
};

// Authentication middleware
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError(401, 'Authorization header missing');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const decoded = UserService.verifyToken(token);
    (req as any).userId = decoded.id;
    (req as any).userEmail = decoded.email;
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};

// Authorization middleware (admin only)
export const authorize = (requiredRole: string = 'ADMIN') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;
    if (userRole !== requiredRole) {
      const error = new AppError(403, 'Access denied. Admin privileges required.');
      return next(error);
    }
    next();
  };
};
