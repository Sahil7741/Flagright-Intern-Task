import express from 'express';
import { getUserRelationships, getTransactionRelationships } from '../controllers/relationshipControllers.js';

export default function relationshipRoutes(driver) {
  const router = express.Router();

  router.get('/user/:id', (req, res) => getUserRelationships(driver, req, res));
  router.get('/transaction/:id', (req, res) => getTransactionRelationships(driver, req, res));
driver
  return router;
}