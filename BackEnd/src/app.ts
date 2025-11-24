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

app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestLogger);
app.use(validateJSON);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

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

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
