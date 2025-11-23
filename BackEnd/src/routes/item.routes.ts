import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';

const router = Router();

// Create item (must be before /:id)
router.post('/', ItemController.createItem);

// Special query routes (must be before /:id)
router.get('/search/location', ItemController.searchByLocation);
router.get('/search/title', ItemController.searchByTitle);

// General routes
router.get('/', ItemController.getAllItems);

// Parameterized routes
router.get('/:id', ItemController.getItemById);
router.put('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

export default router;
