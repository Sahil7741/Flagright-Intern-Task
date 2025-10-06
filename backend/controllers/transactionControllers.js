import neo4j from 'neo4j-driver';
import {
  createTransactionQuery,
  linkSenderToTransactionQuery,
  linkReceiverToTransactionQuery,
  linkRelatedTransactionsQuery,
  listAllTransactionsQuery
} from '../cyphers/transactionCyphers.js';
import { buildListTransactionsPagedQuery, countTransactionsQuery } from '../cyphers/transactionCyphers.js';

export async function createOrUpdateTransaction(driver, req, res) {
  const session = driver.session();
  const { id, senderId, receiverId, amount, ip, deviceId } = req.body;
  try {
    await session.run(createTransactionQuery, { id, amount, ip, deviceId });
    await session.run(linkSenderToTransactionQuery, { senderId, id });
    await session.run(linkReceiverToTransactionQuery, { receiverId, id });
  await session.run(linkRelatedTransactionsQuery, { id });
    res.status(200).json({ message: 'Transaction created/linked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating transaction' });
  }
  finally{
    await session.close();
  }
}


export async function listAllTransactions(driver, req, res) {
  const session = driver.session();
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 25));
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'id';
    const direction = (req.query.direction === 'desc') ? 'desc' : 'asc';
    const filters = {
      ip: req.query.ip || null,
      deviceId: req.query.deviceId || null,
      senderId: req.query.senderId || null,
      receiverId: req.query.receiverId || null,
      minAmount: req.query.minAmount ? Number(req.query.minAmount) : null,
      maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : null,
    };

    const sortFieldMap = {
      amount: 't.amount',
      id: 't.id'
    };
    const sortField = sortFieldMap[sortBy] || sortFieldMap.id;
    const sortDirection = direction === 'desc' ? 'DESC' : 'ASC';
    const orderClause = `ORDER BY ${sortField} ${sortDirection}`;
    const listTransactionsQuery = buildListTransactionsPagedQuery(orderClause);

    const filtersParams = {
      ...filters,
      minAmount: filters.minAmount != null ? neo4j.int(filters.minAmount) : null,
      maxAmount: filters.maxAmount != null ? neo4j.int(filters.maxAmount) : null
    };

    const params = {
      offset: neo4j.int(offset),
      limit: neo4j.int(limit),
      filters: filtersParams
    };

    const result = await session.run(listTransactionsQuery, params);
  const countRes = await session.run(countTransactionsQuery, { filters: filtersParams });

    const transactions = result.records.map(record => ({
      transaction: record.get('t').properties,
      sender: record.get('sender')?.properties || null,
      receiver: record.get('receiver')?.properties || null,
    }));
    const total = countRes.records[0].get('total').toNumber ? countRes.records[0].get('total').toNumber() : countRes.records[0].get('total');
    res.status(200).json({ data: transactions, page, limit, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listing transactions' });
  }
  finally{
    await session.close();
  }
}