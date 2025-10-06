function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parseDensity = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clamp(parsed, 0, 1) : undefined;
};

const addEdge = (edgeMap, a, b, reason) => {
  if (!a || !b || a === b) return;
  const [source, target] = a < b ? [a, b] : [b, a];
  const key = `${source}|${target}`;
  const existing = edgeMap.get(key) || { source, target, reasons: new Set() };
  if (reason) existing.reasons.add(reason);
  edgeMap.set(key, existing);
};

const finalizeEdges = (edgeMap) => Array.from(edgeMap.values()).map(edge => ({
  source: edge.source,
  target: edge.target,
  reasons: edge.reasons.size ? Array.from(edge.reasons) : ['unspecified']
}));

const computeSparseProbability = (density, count, countScale, densityScale = 0.15) => {
  if (!count) return 0;
  const base = clamp(density, 0, 1);
  if (base === 0) return 0;
  const byDensity = base * densityScale;
  const byCount = countScale / count;
  return Math.min(byDensity, byCount);
};

function buildSyntheticData({ usersCount, transactionsCount, userDensity = 0.05, transactionDensity = 0.05 }) {
  const attributeShareProbability = computeSparseProbability(userDensity, usersCount, 8, 0.1);
  const transactionShareProbability = computeSparseProbability(transactionDensity, transactionsCount, 6, 0.08);

  const maxUserGroupSize = 2;
  const maxTransactionGroupSize = 2;

  const payments = ['credit_card', 'debit_card', 'bank_transfer', 'UPI'];
  const users = [];
  const sharedEdgeMap = new Map();

  const emailGroups = [];
  const phoneGroups = [];
  const addressGroups = [];
  const paymentGroups = [];

  const assignSharedValue = (userId, defaultValue, reason, groups) => {
    const eligibleGroups = groups.filter(group => group.ids.length < maxUserGroupSize);
    if (eligibleGroups.length > 0 && Math.random() < attributeShareProbability) {
      const selectedGroup = randomChoice(eligibleGroups);
      const peerId = randomChoice(selectedGroup.ids);
      addEdge(sharedEdgeMap, userId, peerId, reason);
      selectedGroup.ids.push(userId);
      return selectedGroup.value;
    }

    const group = { value: defaultValue, ids: [userId] };
    groups.push(group);
    return defaultValue;
  };

  for (let i = 0; i < usersCount; i++) {
    const id = `u_${i}`;
    const name = `User${i}`;
    const defaultEmail = `user${i}@example.com`;
    const email = assignSharedValue(id, defaultEmail, 'email', emailGroups);
    const defaultPhone = `+1-555-${String(i).padStart(7, '0').slice(-7)}`;
    const phone = assignSharedValue(id, defaultPhone, 'phone', phoneGroups);
    const defaultAddress = `Address ${i}`;
    const address = assignSharedValue(id, defaultAddress, 'address', addressGroups);
    const defaultPayment = payments[i % payments.length];
    const payment_methods = assignSharedValue(id, defaultPayment, 'payment_methods', paymentGroups);

    users.push({ id, name, email, phone, address, payment_methods });
  }

  const transactions = [];
  const transactionEdgeMap = new Map();
  const ipGroups = [];
  const deviceGroups = [];

  const assignTransactionAttribute = (txId, defaultValue, reason, groups) => {
    const eligibleGroups = groups.filter(group => group.ids.length < maxTransactionGroupSize);
    if (eligibleGroups.length > 0 && Math.random() < transactionShareProbability) {
      const selectedGroup = randomChoice(eligibleGroups);
      const peer = randomChoice(selectedGroup.ids);
      addEdge(transactionEdgeMap, txId, peer, reason);
      selectedGroup.ids.push(txId);
      return selectedGroup.value;
    }

    const group = { value: defaultValue, ids: [txId] };
    groups.push(group);
    return defaultValue;
  };

  for (let i = 0; i < transactionsCount; i++) {
    const id = `t_${i}`;
    const senderIndex = Math.floor(Math.random() * usersCount);
    let receiverIndex = Math.floor(Math.random() * usersCount);
    if (receiverIndex === senderIndex) receiverIndex = (receiverIndex + 1) % usersCount;
    const amount = Math.round(Math.random() * 100000) / 100;
    const defaultIp = `10.${Math.floor(i / 10000)}.${Math.floor((i / 100) % 100)}.${i % 100}`;
    const ip = assignTransactionAttribute(id, defaultIp, 'ip', ipGroups);
    const defaultDeviceId = `dev_${Math.floor(i / 10)}`;
    const deviceId = assignTransactionAttribute(id, defaultDeviceId, 'deviceId', deviceGroups);

    transactions.push({
      id,
      senderId: `u_${senderIndex}`,
      receiverId: `u_${receiverIndex}`,
      amount,
      ip,
      deviceId
    });
  }

  if (sharedEdgeMap.size === 0 && users.length > 1 && userDensity > 0) {
    addEdge(sharedEdgeMap, users[0].id, users[1].id, 'seed');
  }
  if (transactionEdgeMap.size === 0 && transactions.length > 1 && transactionDensity > 0) {
    addEdge(transactionEdgeMap, transactions[0].id, transactions[1].id, 'seed');
  }

  const sharedEdges = finalizeEdges(sharedEdgeMap);
  const transactionEdges = finalizeEdges(transactionEdgeMap);

  return {
    users,
    transactions,
    sharedEdges,
    transactionEdges,
    effectiveUserDensity: attributeShareProbability,
    effectiveTransactionDensity: transactionShareProbability
  };
}

export async function generateData(driver, req, res) {
  const session = driver.session();
  try {
    const requestedUsers = Number(req.query.users);
    const usersCount = Math.max(10, Math.min(20000, Number.isFinite(requestedUsers) && requestedUsers > 0 ? requestedUsers : 20000));
    const transactionsCount = Math.max(100000, Math.min(2000000, Number(req.query.transactions) || 100000));

    const densityFallback = parseDensity(req.query.density);
    const userDensity = parseDensity(req.query.userDensity) ?? densityFallback ?? 0.001;
    const transactionDensity = parseDensity(req.query.transactionDensity) ?? densityFallback ?? 0.05;

    const {
      users,
      transactions,
      sharedEdges,
      transactionEdges,
      effectiveUserDensity,
      effectiveTransactionDensity
    } = buildSyntheticData({
      usersCount,
      transactionsCount,
      userDensity,
      transactionDensity
    });

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

    const edgeBatchSize = 5000;
    for (let i = 0; i < sharedEdges.length; i += edgeBatchSize) {
      const slice = sharedEdges.slice(i, i + edgeBatchSize);
      await session.run(
        `UNWIND $edges AS edge
         MATCH (u1:User {id: edge.source}), (u2:User {id: edge.target})
         MERGE (u1)-[r:SHARED_ATTRIBUTE]->(u2)
           SET r.reasons = edge.reasons
         MERGE (u2)-[r2:SHARED_ATTRIBUTE]->(u1)
           SET r2.reasons = edge.reasons`,
        { edges: slice }
      );
    }

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

    for (let i = 0; i < transactionEdges.length; i += edgeBatchSize) {
      const slice = transactionEdges.slice(i, i + edgeBatchSize);
      await session.run(
        `UNWIND $edges AS edge
         MATCH (t1:Transaction {id: edge.source}), (t2:Transaction {id: edge.target})
         MERGE (t1)-[r:RELATED_TO]->(t2)
           SET r.reasons = edge.reasons
         MERGE (t2)-[r2:RELATED_TO]->(t1)
           SET r2.reasons = edge.reasons`,
        { edges: slice }
      );
    }

    res.status(200).json({
      message: 'Data generation complete',
      users: usersCount,
      transactions: transactionsCount,
      sharedEdges: sharedEdges.length,
      transactionEdges: transactionEdges.length,
      userDensity,
      transactionDensity,
      effectiveUserDensity,
      effectiveTransactionDensity
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Generation failed' });
  } finally {
    await session.close();
  }
}
