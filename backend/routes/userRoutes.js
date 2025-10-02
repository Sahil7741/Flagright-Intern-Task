import express from 'express';
import { createOrUpdateUser, listAllUsers } from '../controllers/userControllers.js';

export default function userRoutes(driver) {
  const router = express.Router();

  router.post('/', (req, res) => createOrUpdateUser(driver, req, res));
  router.get('/', (req, res)=> listAllUsers(driver, req, res));

  return router;
}