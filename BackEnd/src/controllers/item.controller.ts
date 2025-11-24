import { Request, Response, NextFunction } from 'express';
import { ItemService } from '../services/item.service';
import { CreateItemDTO, UpdateItemDTO } from '../types';

export class ItemController {
  // Get all items with pagination and advanced filters
  static async getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      // Build filters object
      const filters: any = {};

      if (req.query.type) {
        filters.type = String(req.query.type);
      }
      if (req.query.status) {
        filters.status = String(req.query.status);
      }
      if (req.query.userId) {
        filters.userId = Number(req.query.userId);
      }
      if (req.query.categoryId) {
        filters.categoryId = Number(req.query.categoryId);
      }
      if (req.query.location) {
        filters.location = String(req.query.location);
      }
      if (req.query.title) {
        filters.title = String(req.query.title);
      }
      if (req.query.dateFrom) {
        filters.dateFrom = String(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filters.dateTo = String(req.query.dateTo);
      }

      const result = await ItemService.getAllItems(page, limit, filters);

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
      const data: any = req.body;
      
      // Parse numeric fields from FormData (which sends everything as strings)
      if (data.userId) {
        data.userId = Number(data.userId);
      }
      if (data.categoryId && data.categoryId !== '') {
        data.categoryId = Number(data.categoryId);
      } else {
        delete data.categoryId; // Remove if empty string
      }
      
      // Handle file upload
      const multerReq = req as any;
      if (multerReq.file) {
        data.imageUrl = `/uploads/${multerReq.file.filename}`;
      }
      
      // Convert dateIncident string to Date if it's a string
      if (data.dateIncident && typeof data.dateIncident === 'string') {
        data.dateIncident = new Date(data.dateIncident);
      }

      // Parse additionalData if it's a string (from FormData)
      if (data.additionalData && typeof data.additionalData === 'string') {
        try {
          data.additionalData = JSON.parse(data.additionalData);
        } catch (e) {
          delete data.additionalData; // Invalid JSON, remove it
        }
      }
      
      const item = await ItemService.createItem(data);
      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      console.error('CreateItem Error:', error);
      next(error);
    }
  }

  // Update item
  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: any = req.body;
      
      // Convert dateIncident string to Date if it's a string
      if (data.dateIncident && typeof data.dateIncident === 'string') {
        data.dateIncident = new Date(data.dateIncident);
      }
      
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
