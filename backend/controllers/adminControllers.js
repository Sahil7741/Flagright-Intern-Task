import crypto from 'crypto';

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildSyntheticData({ usersCount, transactionsCount }) {
  const users = [];
  const emails = [];
  const phones = [];
  const addresses = [];
  const payments = ['credit_card', 'debit_card', 'bank_transfer', 'UPI'];

  for (let i = 0; i < usersCount; i++) {
    const id = `u_${i}`;
    const first = `User${i}`;
    const email = `user${Math.floor(i / 3)}@example.com`; // intentional sharing
    const phone = `+1-555-${String(Math.floor(i / 2)).padStart(4, '0')}`;
    const address = `Street ${Math.floor(i / 4)}`;
    const payment_methods = randomChoice(payments);
    users.push({ id, name: first, email, phone, address, payment_methods });
    emails.push(email);
    phones.push(phone);
    addresses.push(address);
  }

  const transactions = [];
  for (let i = 0; i < transactionsCount; i++) {
    const id = `t_${i}`;
    const senderIndex = Math.floor(Math.random() * usersCount);
    let receiverIndex = Math.floor(Math.random() * usersCount);
    if (receiverIndex === senderIndex) receiverIndex = (receiverIndex + 1) % usersCount;
    const amount = Math.floor(Math.random() * 100000) / 100;
    const ip = `192.168.${Math.floor(i % 256)}.${Math.floor((i * 7) % 256)}`; // recurrent IPs
    const deviceId = `dev_${Math.floor(i % 10000)}`; // shared devices
    transactions.push({ id, senderId: `u_${senderIndex}`, receiverId: `u_${receiverIndex}`, amount, ip, deviceId });
  }
  return { users, transactions };
}

export async function generateData(driver, req, res) {
  const session = driver.session();
  try {
    const usersCount = Math.max(10, Math.min(20000, Number(req.query.users) || 2000));
    const transactionsCount = Math.max(100000, Math.min(2000000, Number(req.query.transactions) || 100000));

    const { users, transactions } = buildSyntheticData({ usersCount, transactionsCount });

    // Batch insert users
    const batchSize = 5000;
    for (let i = 0; i < users.length; i += batchSize) {
      const slice = users.slice(i, i + batchSize);
      await session.run(
        `UNWIND $users AS u
         MERGE (n:User {id: u.id})
         SET n.name = u.name, n.email = u.email, n.phone = u.phone, n.address = u.address, n.payment_methods = u.payment_methods`,
        { users: slice }
      );
    }

    // Link shared attributes (single pass is fine)
    await session.run(
      `MATCH (u1:User), (u2:User)
       WHERE u1.id <> u2.id AND (u1.email = u2.email OR u1.phone = u2.phone OR u1.address = u2.address OR u1.payment_methods = u2.payment_methods)
       MERGE (u1)-[:SHARED_ATTRIBUTE]->(u2)
       MERGE (u2)-[:SHARED_ATTRIBUTE]->(u1)`
    );

    // Batch insert transactions
    for (let i = 0; i < transactions.length; i += batchSize) {
      const slice = transactions.slice(i, i + batchSize);
      await session.run(
        `UNWIND $tx AS t
         MERGE (tr:Transaction {id: t.id})
         SET tr.amount = t.amount, tr.ip = t.ip, tr.deviceId = t.deviceId`,
        { tx: slice }
      );
      await session.run(
        `UNWIND $tx AS t
         MATCH (u:User {id: t.senderId}), (tr:Transaction {id: t.id})
         MERGE (u)-[:DEBIT]->(tr)`,
        { tx: slice }
      );
      await session.run(
        `UNWIND $tx AS t
         MATCH (u:User {id: t.receiverId}), (tr:Transaction {id: t.id})
         MERGE (tr)-[:CREDIT]->(u)`,
        { tx: slice }
      );
    }

    // Link related transactions by ip or deviceId (create bidirectional edges)
    await session.run(
      `MATCH (t1:Transaction), (t2:Transaction)
       WHERE t1.id <> t2.id AND (t1.ip = t2.ip OR t1.deviceId = t2.deviceId)
       MERGE (t1)-[:RELATED_TO]->(t2)
       MERGE (t2)-[:RELATED_TO]->(t1)`
    );

    res.status(200).json({ message: 'Data generation complete', users: usersCount, transactions: transactionsCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Generation failed' });
  } finally {
    await session.close();
  }
}
