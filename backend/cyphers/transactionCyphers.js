export const createTransactionQuery = `MERGE (t:Transaction {id: $id}) SET t.amount = $amount, t.ip = $ip, t.deviceId = $deviceId`;

export const linkSenderToTransactionQuery = `MATCH (u:User {id: $senderId}), (t:Transaction {id: $id}) MERGE (u)-[:DEBIT]->(t)`;

export const linkReceiverToTransactionQuery = `MATCH (u:User {id: $receiverId}), (t:Transaction {id: $id}) MERGE (t)-[:CREDIT]->(u)`;

export const linkRelatedTransactionsQuery = `
UNWIND ['ip', 'deviceId'] AS relType
MATCH (t:Transaction {id: $id})
MATCH (other:Transaction)
WHERE other.id <> $id AND ((relType = 'ip' AND other.ip = t.ip) OR (relType = 'deviceId' AND other.deviceId = t.deviceId))
MERGE (t)-[r:RELATED_TO]->(other)
  SET r.reasons = CASE
    WHEN relType IN coalesce(r.reasons, []) THEN r.reasons
    ELSE coalesce(r.reasons, []) + relType
  END
MERGE (other)-[r2:RELATED_TO]->(t)
  SET r2.reasons = CASE
    WHEN relType IN coalesce(r2.reasons, []) THEN r2.reasons
    ELSE coalesce(r2.reasons, []) + relType
  END`;

export const listAllTransactionsQuery =`MATCH (t:Transaction)
OPTIONAL MATCH (sender:User)-[sRel:DEBIT]->(t)
OPTIONAL MATCH (t)-[rRel:CREDIT]->(receiver:User)
RETURN DISTINCT t, sender, sRel, receiver, rRel`;

export const buildListTransactionsPagedQuery = (orderClause) => `
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
${orderClause}
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