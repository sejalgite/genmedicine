import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createApiMiddleware } from './services/apiMiddleware';
import { connectMongo, getMongoStats } from './db/mongo';

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

// Health check endpoint with MongoDB status
app.get('/api/health', async (_req, res) => {
  const mongoStats = await getMongoStats();
  res.json({
    status: 'HEALTHY',
    service: 'genmedicine-backend',
    version: '1.0.0',
    port: PORT,
    database: {
      type: 'MongoDB Atlas',
      ...mongoStats,
    },
    timestamp: new Date().toISOString(),
  });
});

// Dedicated MongoDB cluster status endpoint
app.get('/api/v1/db/mongo-status', async (_req, res) => {
  const stats = await getMongoStats();
  res.json(stats);
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

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`=======================================================`);
  console.log(`  GenMedicine Enterprise Backend Service`);
  console.log(`  Status: Running on http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  API Version:  http://localhost:${PORT}/api/v1`);
  console.log(`=======================================================`);

  // Connect to MongoDB Atlas
  await connectMongo();
});

export default app;
