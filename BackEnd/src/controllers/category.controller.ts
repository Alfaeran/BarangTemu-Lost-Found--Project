import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export class CategoryController {
  // Get all categories
  static async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get category by ID
  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(Number(id));
      res.json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create category
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateCategoryDTO = req.body;
      const category = await CategoryService.createCategory(data);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update category
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateCategoryDTO = req.body;
      const category = await CategoryService.updateCategory(Number(id), data);
      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete category
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await CategoryService.deleteCategory(Number(id));
      res.json({
        success: true,
        message: 'Category deleted successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get items by category
  static async getItemsByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const result = await CategoryService.getItemsByCategory(Number(id));
      res.json({
        success: true,
        message: 'Items retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
