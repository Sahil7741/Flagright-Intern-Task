import express from 'express';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js';
import relationshipRoutes from './routes/relationShipRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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

async function initializeConstraints() {
  const session = driver.session();
  try {
    await session.run(`CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE`);
    await session.run(`CREATE CONSTRAINT tx_id IF NOT EXISTS FOR (t:Transaction) REQUIRE t.id IS UNIQUE`);
    await session.run(`CREATE INDEX user_email IF NOT EXISTS FOR (u:User) ON (u.email)`);
    await session.run(`CREATE INDEX user_phone IF NOT EXISTS FOR (u:User) ON (u.phone)`);
    await session.run(`CREATE INDEX user_address IF NOT EXISTS FOR (u:User) ON (u.address)`);
    await session.run(`CREATE INDEX user_payment IF NOT EXISTS FOR (u:User) ON (u.payment_methods)`);
    await session.run(`CREATE INDEX tx_ip IF NOT EXISTS FOR (t:Transaction) ON (t.ip)`);
    await session.run(`CREATE INDEX tx_device IF NOT EXISTS FOR (t:Transaction) ON (t.deviceId)`);
    console.log('Neo4j constraints and indexes ensured');
  } catch (e) {
    console.error('Error ensuring constraints/indexes', e);
  } finally {
    await session.close();
  }
}

app.use('/users', userRoutes(driver));
app.use('/transactions', transactionRoutes(driver));
app.use('/relationships', relationshipRoutes(driver));
app.use('/admin', adminRoutes(driver));

initializeConstraints().finally(() => {
  app.listen(5000, () => console.log('Backend running on port 5000'));
});

// process.on('exit', () => session.close());