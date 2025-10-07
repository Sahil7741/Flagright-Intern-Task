import { ensureInitialization, driver } from '../../index.js';
import { generateData } from '../../controllers/adminControllers.js';

export const config = {
  maxDuration: 900
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  await ensureInitialization();
  return generateData(driver, req, res);
}
