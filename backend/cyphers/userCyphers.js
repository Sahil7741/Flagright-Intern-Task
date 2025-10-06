export const createUserQuery = `MERGE (u:User {id: $id}) SET u.name = $name, u.email = $email, u.phone = $phone, u.address = $address, u.payment_methods = $payment_methods`;

export const createUserSharedAttributeLinksQuery = `MATCH (u1:User), (u2:User) WHERE u1.id <> u2.id AND (u1.email = u2.email OR u1.phone = u2.phone OR u1.address = u2.address OR u1.payment_methods = u2.payment_methods) MERGE (u1)-[:SHARED_ATTRIBUTE]->(u2) MERGE (u2)-[:SHARED_ATTRIBUTE]->(u1)`;

export const listAllUsersQuery = `MATCH (u:User) RETURN u`;

export const buildListUsersPagedQuery = (orderClause) => `
WITH $filters AS f
MATCH (u:User)
WHERE (
  f.q IS NULL OR toLower(u.name) CONTAINS toLower(f.q)
  OR toLower(u.email) CONTAINS toLower(f.q)
  OR toLower(u.phone) CONTAINS toLower(f.q)
  OR toLower(u.address) CONTAINS toLower(f.q)
  OR toLower(u.payment_methods) CONTAINS toLower(f.q)
)
${orderClause}
SKIP $offset LIMIT $limit
RETURN u`;

export const countUsersQuery = `
WITH $filters AS f
MATCH (u:User)
WHERE (
  f.q IS NULL OR toLower(u.name) CONTAINS toLower(f.q)
  OR toLower(u.email) CONTAINS toLower(f.q)
  OR toLower(u.phone) CONTAINS toLower(f.q)
  OR toLower(u.address) CONTAINS toLower(f.q)
  OR toLower(u.payment_methods) CONTAINS toLower(f.q)
)
RETURN count(u) AS total`;