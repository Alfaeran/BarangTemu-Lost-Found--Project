import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware';

const router = Router();

router.post('/auth/register', UserController.registerUser);
router.post('/auth/login', UserController.loginUser);

router.get('/', UserController.getAllUsers);

router.get('/auth/me', authenticate, UserController.getCurrentUser);

router.get('/:id', UserController.getUserById);

router.get('/:id/items', UserController.getUserItems);

router.post('/', UserController.createUser);

router.put('/:id', UserController.updateUser);

router.delete('/:id', UserController.deleteUser);

export default router;
