import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/', CategoryController.getAllCategories);

// Get category by ID
router.get('/:id', CategoryController.getCategoryById);

// Create category
router.post('/', CategoryController.createCategory);

// Update category
router.put('/:id', CategoryController.updateCategory);

// Delete category
router.delete('/:id', CategoryController.deleteCategory);

// Get items by category
router.get('/:id/items', CategoryController.getItemsByCategory);

export default router;
