export const userRelationshipCypher = `MATCH (u:User {id: $id})-[r]-(n) RETURN u, r, n`;

export const transactionRelationshipCypher = `MATCH (t:Transaction {id: $id})-[r]-(n) RETURN t, r, n`;