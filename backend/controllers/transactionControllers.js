import {
  createTransactionQuery,
  linkSenderToTransactionQuery,
  linkReceiverToTransactionQuery,
  linkRelatedTransactionsQuery,
  listAllTransactionsQuery
} from '../cyphers/transactionCyphers.js';

export async function createOrUpdateTransaction(driver, req, res) {
  const session = driver.session();
  const { id, senderId, receiverId, amount, ip, deviceId } = req.body;
  try {
    await session.run(createTransactionQuery, { id, amount, ip, deviceId });
    await session.run(linkSenderToTransactionQuery, { senderId, id });
    await session.run(linkReceiverToTransactionQuery, { receiverId, id });
    await session.run(linkRelatedTransactionsQuery);
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
    const result = await session.run(listAllTransactionsQuery);
    const transactions = result.records.map(record => {
      const t = record.get('t').properties;
      const sender = record.get('sender')?.properties || null;
      const receiver = record.get('receiver')?.properties || null;
      const sRel = record.get('sRel')?.type || null;
      const rRel = record.get('rRel')?.type || null;
      return {
        transaction: t,
        sender,
        receiver,
      };
    });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listing transactions' });
  }
  finally{
    await session.close();
  }
}