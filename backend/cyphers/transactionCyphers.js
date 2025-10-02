export const createTransactionQuery = `MERGE (t:Transaction {id: $id}) SET t.amount = $amount, t.ip = $ip, t.deviceId = $deviceId`;

export const linkSenderToTransactionQuery = `MATCH (u:User {id: $senderId}), (t:Transaction {id: $id}) MERGE (u)-[:DEBIT]->(t)`;

export const linkReceiverToTransactionQuery = `MATCH (u:User {id: $receiverId}), (t:Transaction {id: $id}) MERGE (t)-[:CREDIT]->(u)`;

export const linkRelatedTransactionsQuery = `MATCH (t1:Transaction), (t2:Transaction) WHERE t1.id <> t2.id AND (t1.ip = t2.ip OR t1.deviceId = t2.deviceId) MERGE (t1)-[:RELATED_TO]->(t2) MERGE (t2)-[:RELATED_TO]->(t1)`;

export const listAllTransactionsQuery =`MATCH (t:Transaction)
OPTIONAL MATCH (sender:User)-[sRel:DEBIT]->(t)
OPTIONAL MATCH (t)-[rRel:CREDIT]->(receiver:User)
RETURN DISTINCT t, sender, sRel, receiver, rRel`;