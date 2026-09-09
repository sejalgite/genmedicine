import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createApiMiddleware } from './services/apiMiddleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// CORS configuration for frontend
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'genmedicine-backend',
    version: '1.0.0',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API middleware for /api/v1/* endpoints
app.use(createApiMiddleware());

// Catch-all 404 for unhandled API endpoints
app.use('/api', (_req, res) => {
  res.status(404).json({
    error: 'ENDPOINT_NOT_FOUND',
    message: 'The requested API route does not exist.',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`  GenMedicine Enterprise Backend Service`);
  console.log(`  Status: Running on http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  API Version:  http://localhost:${PORT}/api/v1`);
  console.log(`=======================================================`);
});

export default app;
