import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';
import { upload } from '../config/multer';
import { authenticate, authorize } from '../middleware';

const router = Router();

router.post('/', upload.single('image'), ItemController.createItem);

router.get('/search/location', ItemController.searchByLocation);
router.get('/search/title', ItemController.searchByTitle);

router.get('/', ItemController.getAllItems);

router.get('/:id', ItemController.getItemById);
router.put('/:id', ItemController.updateItem);
router.delete('/:id', authenticate, authorize('ADMIN'), ItemController.deleteItem);

export default router;
