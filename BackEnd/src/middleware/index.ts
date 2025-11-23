import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

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
