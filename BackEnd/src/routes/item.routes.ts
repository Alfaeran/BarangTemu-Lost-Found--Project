import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';
import { upload } from '../config/multer';

const router = Router();

// Create item (must be before /:id)
router.post('/', upload.single('image'), ItemController.createItem);

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
