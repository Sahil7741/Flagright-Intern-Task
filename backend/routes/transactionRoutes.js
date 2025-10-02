import express from 'express';
import { createOrUpdateTransaction, listAllTransactions } from '../controllers/transactionControllers.js';

export default function transactionRoutes(driver) {
  const router = express.Router();

  router.post('/', (req, res) => createOrUpdateTransaction(driver, req, res));
  router.get('/', (req, res)=> listAllTransactions(driver, req, res));

  return router;
}