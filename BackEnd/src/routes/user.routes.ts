import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware';

const router = Router();

// Auth routes
router.post('/auth/register', UserController.registerUser);
router.post('/auth/login', UserController.loginUser);

// Get all users
router.get('/', UserController.getAllUsers);

// Get current user (protected)
router.get('/auth/me', authenticate, UserController.getCurrentUser);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Get user items
router.get('/:id/items', UserController.getUserItems);

// Create user (admin)
router.post('/', UserController.createUser);

// Update user
router.put('/:id', UserController.updateUser);

// Delete user
router.delete('/:id', UserController.deleteUser);

export default router;
