import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);

router.get('/slug/:slug', CategoryController.getCategoryBySlug);

router.get('/slug/:slug/items', CategoryController.getItemsByCategorySlug);

router.get('/:id', CategoryController.getCategoryById);

router.post('/', CategoryController.createCategory);

router.put('/:id', CategoryController.updateCategory);

router.delete('/:id', CategoryController.deleteCategory);

router.get('/:id/items', CategoryController.getItemsByCategory);

export default router;
