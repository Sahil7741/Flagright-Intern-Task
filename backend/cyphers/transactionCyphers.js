export const createTransactionQuery = `MERGE (t:Transaction {id: $id}) SET t.amount = $amount, t.ip = $ip, t.deviceId = $deviceId`;

export const linkSenderToTransactionQuery = `MATCH (u:User {id: $senderId}), (t:Transaction {id: $id}) MERGE (u)-[:DEBIT]->(t)`;

export const linkReceiverToTransactionQuery = `MATCH (u:User {id: $receiverId}), (t:Transaction {id: $id}) MERGE (t)-[:CREDIT]->(u)`;

export const linkRelatedTransactionsQuery = `MATCH (t1:Transaction), (t2:Transaction) WHERE t1.id <> t2.id AND (t1.ip = t2.ip OR t1.deviceId = t2.deviceId) MERGE (t1)-[:RELATED_TO]->(t2) MERGE (t2)-[:RELATED_TO]->(t1)`;

export const listAllTransactionsQuery =`MATCH (t:Transaction)
OPTIONAL MATCH (sender:User)-[sRel:DEBIT]->(t)
OPTIONAL MATCH (t)-[rRel:CREDIT]->(receiver:User)
RETURN DISTINCT t, sender, sRel, receiver, rRel`;

export const listTransactionsPagedQuery = `
WITH $filters AS f
MATCH (t:Transaction)
OPTIONAL MATCH (sender:User)-[:DEBIT]->(t)
OPTIONAL MATCH (t)-[:CREDIT]->(receiver:User)
WHERE (
  f.ip IS NULL OR t.ip CONTAINS f.ip
) AND (
  f.deviceId IS NULL OR t.deviceId CONTAINS f.deviceId
) AND (
  f.senderId IS NULL OR sender.id = f.senderId
) AND (
  f.receiverId IS NULL OR receiver.id = f.receiverId
) AND (
  f.minAmount IS NULL OR t.amount >= f.minAmount
) AND (
  f.maxAmount IS NULL OR t.amount <= f.maxAmount
)
WITH t, sender, receiver
ORDER BY CASE $sortBy WHEN 'amount' THEN t.amount ELSE t.id END
         CASE WHEN $direction = 'desc' THEN DESC END
SKIP $offset LIMIT $limit
RETURN DISTINCT t, sender, receiver`;

export const countTransactionsQuery = `
WITH $filters AS f
MATCH (t:Transaction)
OPTIONAL MATCH (sender:User)-[:DEBIT]->(t)
OPTIONAL MATCH (t)-[:CREDIT]->(receiver:User)
WHERE (
  f.ip IS NULL OR t.ip CONTAINS f.ip
) AND (
  f.deviceId IS NULL OR t.deviceId CONTAINS f.deviceId
) AND (
  f.senderId IS NULL OR sender.id = f.senderId
) AND (
  f.receiverId IS NULL OR receiver.id = f.receiverId
) AND (
  f.minAmount IS NULL OR t.amount >= f.minAmount
) AND (
  f.maxAmount IS NULL OR t.amount <= f.maxAmount
)
RETURN count(DISTINCT t) AS total`;