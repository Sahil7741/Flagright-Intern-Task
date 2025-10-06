import neo4j from 'neo4j-driver';
import { createUserQuery, createUserSharedAttributeLinksQuery, listAllUsersQuery } from '../cyphers/userCyphers.js';
import { buildListUsersPagedQuery, countUsersQuery } from '../cyphers/userCyphers.js';

export async function createOrUpdateUser(driver, req, res) {
  const session = driver.session();
  const { id, name, email, phone, address, payment_methods } = req.body;
  try {
    console.log("Requested for creating/updating user with ID:", id);
    const result = await session.run(createUserQuery, { id, name, email, phone, address, payment_methods });
    await session.run(createUserSharedAttributeLinksQuery);
    console.log(result);
    console.log("User created/updated successfully with ID:", id);
    res.status(200).json({ message: 'User created/updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
  finally{
    await session.close();
  }
}

export async function listAllUsers(driver, req, res){
  const session = driver.session();
  try{
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 25));
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'id';
    const direction = (req.query.direction === 'desc') ? 'desc' : 'asc';
    const filters = { q: req.query.q || null };

    const sortFieldMap = {
      name: 'u.name',
      id: 'u.id'
    };
    const sortField = sortFieldMap[sortBy] || sortFieldMap.id;
    const sortDirection = direction === 'desc' ? 'DESC' : 'ASC';
    const orderClause = `ORDER BY ${sortField} ${sortDirection}`;
    const listUsersQuery = buildListUsersPagedQuery(orderClause);

    const params = {
      offset: neo4j.int(offset),
      limit: neo4j.int(limit),
      filters
    };

    const result = await session.run(listUsersQuery, params);
    const countRes = await session.run(countUsersQuery, { filters });
    const users = result.records.map(record => record.get('u').properties);
    const total = countRes.records[0].get('total').toNumber ? countRes.records[0].get('total').toNumber() : countRes.records[0].get('total');
    res.status(200).json({ data: users, page, limit, total });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: 'Error listing users' });
  }
  finally{
    await session.close();
  }
}