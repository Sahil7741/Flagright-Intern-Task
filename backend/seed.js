import waitOn from 'wait-on';
await waitOn({ resources: ['tcp:neo4j:7687'], timeout: 30000 });
import neo4j from 'neo4j-driver';


const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    'neo4j',
    'flagright'
  )
);

const session = driver.session();

const users = [
  { id: 'u1', name: 'Alice', email: 'shared1@email.com', phone: '1111', address: 'A Street' },
  { id: 'u2', name: 'Bob', email: 'shared1@email.com', phone: '2222', address: 'B Street' },
  { id: 'u3', name: 'Charlie', email: 'charlie@email.com', phone: '1111', address: 'C Street' },
  { id: 'u4', name: 'David', email: 'david@email.com', phone: '4444', address: 'A Street' },
  { id: 'u5', name: 'Eva', email: 'eva@email.com', phone: '5555', address: 'D Street' },
  { id: 'u6', name: 'Frank', email: 'shared2@email.com', phone: '6666', address: 'E Street' },
  { id: 'u7', name: 'Grace', email: 'shared2@email.com', phone: '7777', address: 'F Street' },
  { id: 'u8', name: 'Henry', email: 'henry@email.com', phone: '8888', address: 'G Street' },
];

const transactions = [
  { id: 't1', senderId: 'u1', receiverId: 'u2', amount: 100, ip: '192.168.0.1', deviceId: 'dev1' },
  { id: 't2', senderId: 'u2', receiverId: 'u3', amount: 200, ip: '192.168.0.2', deviceId: 'dev2' },
  { id: 't3', senderId: 'u3', receiverId: 'u4', amount: 300, ip: '192.168.0.3', deviceId: 'dev3' },
  { id: 't4', senderId: 'u1', receiverId: 'u5', amount: 400, ip: '192.168.0.1', deviceId: 'dev4' }, // same IP as t1
  { id: 't5', senderId: 'u4', receiverId: 'u6', amount: 250, ip: '192.168.0.5', deviceId: 'dev5' },
  { id: 't6', senderId: 'u6', receiverId: 'u7', amount: 150, ip: '192.168.0.6', deviceId: 'dev6' },
  { id: 't7', senderId: 'u7', receiverId: 'u8', amount: 120, ip: '192.168.0.7', deviceId: 'dev7' },
  { id: 't8', senderId: 'u2', receiverId: 'u6', amount: 130, ip: '192.168.0.2', deviceId: 'dev8' }, // same IP as t2
  { id: 't9', senderId: 'u5', receiverId: 'u1', amount: 170, ip: '192.168.0.9', deviceId: 'dev9' },
  { id: 't10', senderId: 'u8', receiverId: 'u3', amount: 300, ip: '192.168.0.3', deviceId: 'dev10' }, // same IP as t3
  { id: 't11', senderId: 'u6', receiverId: 'u4', amount: 180, ip: '192.168.0.6', deviceId: 'dev6' },  // same devId as t6
  { id: 't12', senderId: 'u5', receiverId: 'u7', amount: 190, ip: '192.168.0.1', deviceId: 'dev1' },  // same as t1
];

const createUsers = async () => {
  for (const user of users) {
    await session.run(
      `MERGE (u:User {id: $id})
       SET u.name = $name, u.email = $email, u.phone = $phone, u.address = $address`,
      user
    );
  }
};

const linkSharedAttributes = async () => {
  await session.run(`MATCH (u1:User), (u2:User) WHERE u1.id <> u2.id AND (u1.email = u2.email OR u1.phone = u2.phone OR u1.address = u2.address OR u1.payment_methods = u2.payment_methods) MERGE (u1)-[:SHARED_ATTRIBUTE]->(u2) MERGE (u2)-[:SHARED_ATTRIBUTE]->(u1)
  `);
};

const createTransactions = async () => {
  for (const tx of transactions) {
    await session.run(
      `MERGE (t:Transaction {id: $id})
       SET t.amount = $amount, t.ip = $ip, t.deviceId = $deviceId`,
      tx
    );
    await session.run(
      `MATCH (u:User {id: $senderId}), (t:Transaction {id: $id})
       MERGE (u)-[:DEBIT]->(t)`,
      tx
    );
    await session.run(
      `MATCH (u:User {id: $receiverId}), (t:Transaction {id: $id})
       MERGE (u)-[:CREDIT]->(t)`,
      tx
    );
  }
};

const linkRelatedTransactions = async () => {
  await session.run(`MATCH (t1:Transaction), (t2:Transaction) WHERE t1.id <> t2.id AND (t1.ip = t2.ip OR t1.deviceId = t2.deviceId) MERGE (t1)-[:RELATED_TO]->(t2) MERGE (t2)-[:RELATED_TO]->(t1)
  `);
};

const main = async () => {
  try {
    console.log('Creating users...');
    await createUsers();
    console.log('Linking shared attributes...');
    await linkSharedAttributes();
    console.log('Creating transactions...');
    await createTransactions();
    console.log('Linking related transactions...');
    await linkRelatedTransactions();
    console.log('✅ Database seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await session.close();
    await driver.close();
  }
};

main();

