import express from 'express';
import { generateData } from '../controllers/adminControllers.js';

export default function adminRoutes(driver) {
  const router = express.Router();

  router.post('/generate', (req, res) => generateData(driver, req, res));

  return router;
}
