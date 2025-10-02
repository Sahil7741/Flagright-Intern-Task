export const createUserQuery = `MERGE (u:User {id: $id}) SET u.name = $name, u.email = $email, u.phone = $phone, u.address = $address, u.payment_methods = $payment_methods`;

export const createUserSharedAttributeLinksQuery = `MATCH (u1:User), (u2:User) WHERE u1.id <> u2.id AND (u1.email = u2.email OR u1.phone = u2.phone OR u1.address = u2.address OR u1.payment_methods = u2.payment_methods) MERGE (u1)-[:SHARED_ATTRIBUTE]->(u2) MERGE (u2)-[:SHARED_ATTRIBUTE]->(u1)`;

export const listAllUsersQuery = `MATCH (u:User) RETURN u`;