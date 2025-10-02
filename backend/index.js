import express from 'express';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js';
import relationshipRoutes from './routes/relationShipRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'flagright'
  )
);

// const session = driver.session();

app.use('/users', userRoutes(driver));
app.use('/transactions', transactionRoutes(driver));
app.use('/relationships', relationshipRoutes(driver));
app.listen(5000, () => console.log('Backend running on port 5000'));

// process.on('exit', () => session.close());