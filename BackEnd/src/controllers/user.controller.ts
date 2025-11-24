import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO, LoginDTO } from '../types';

export class UserController {
  // Register user
  static async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateUserDTO = req.body;

      // Validate input
      if (!data.username || !data.email || !data.password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required',
        });
      }

      const result = await UserService.registerUser(data);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginDTO = req.body;

      // Validate input
      if (!data.email || !data.password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await UserService.loginUser(data);

      res.json({
        success: true,
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all users
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));
      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId; // Set by auth middleware
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const user = await UserService.getUserById(userId);
      res.json({
        success: true,
        message: 'Current user retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create user (admin only)
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateUserDTO = req.body;
      const user = await UserService.createUser(data);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateUserDTO = req.body;
      const user = await UserService.updateUser(Number(id), data);
      res.json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUser(Number(id));
      res.json({
        success: true,
        message: 'User deleted successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user items
  static async getUserItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const items = await UserService.getUserItems(Number(id));
      res.json({
        success: true,
        message: 'User items retrieved successfully',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }
}
