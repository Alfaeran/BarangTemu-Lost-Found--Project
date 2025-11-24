import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export class CategoryController {
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

  static async getCategoryBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      const category = await CategoryService.getCategoryBySlug(slug);
      res.json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

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

  static async getItemsByCategorySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      const result = await CategoryService.getItemsByCategorySlug(slug);
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

