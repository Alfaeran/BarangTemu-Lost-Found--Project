import { Request, Response, NextFunction } from 'express';
import { ItemService } from '../services/item.service';
import { CreateItemDTO, UpdateItemDTO } from '../types';

export class ItemController {
  // Get all items with pagination and filters
  static async getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const type = req.query.type as string | undefined;
      const status = req.query.status as string | undefined;
      const userId = req.query.userId as string | undefined;

      let result;

      if (userId) {
        const items = await ItemService.getItemsByUser(Number(userId));
        result = {
          items,
          pagination: {
            page: 1,
            limit: items.length,
            total: items.length,
            pages: 1,
          },
        };
      } else if (type) {
        const items = await ItemService.getItemsByType(type);
        result = {
          items,
          pagination: {
            page: 1,
            limit: items.length,
            total: items.length,
            pages: 1,
          },
        };
      } else if (status) {
        const items = await ItemService.getItemsByStatus(status);
        result = {
          items,
          pagination: {
            page: 1,
            limit: items.length,
            total: items.length,
            pages: 1,
          },
        };
      } else {
        result = await ItemService.getAllItems(page, limit);
      }

      res.json({
        success: true,
        message: 'Items retrieved successfully',
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get item by ID
  static async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await ItemService.getItemById(Number(id));
      res.json({
        success: true,
        message: 'Item retrieved successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search by location
  static async searchByLocation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { location } = req.query;
      if (!location) {
        return res.status(400).json({
          success: false,
          error: 'Location query parameter is required',
        });
      }

      const items = await ItemService.searchByLocation(String(location));
      res.json({
        success: true,
        message: 'Items retrieved successfully',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search by title
  static async searchByTitle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title } = req.query;
      if (!title) {
        return res.status(400).json({
          success: false,
          error: 'Title query parameter is required',
        });
      }

      const items = await ItemService.searchByTitle(String(title));
      res.json({
        success: true,
        message: 'Items retrieved successfully',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create item
  static async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateItemDTO = req.body;
      const item = await ItemService.createItem(data);
      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update item
  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateItemDTO = req.body;
      const item = await ItemService.updateItem(Number(id), data);
      res.json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete item
  static async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await ItemService.deleteItem(Number(id));
      res.json({
        success: true,
        message: 'Item deleted successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }
}
