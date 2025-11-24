import express from 'express';
import cors from 'cors';
import path from 'path';
import {
  errorHandler,
  notFound,
  requestLogger,
  validateJSON,
} from './middleware';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import itemRoutes from './routes/item.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(validateJSON);

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Barang Temu Lost & Found API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      categories: '/api/categories',
      items: '/api/items',
    },
    health: '/health',
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
