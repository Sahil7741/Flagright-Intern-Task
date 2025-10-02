import { createUserQuery, createUserSharedAttributeLinksQuery, listAllUsersQuery } from '../cyphers/userCyphers.js';

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
    console.log("Requested to list all users");
    const result = await session.run(listAllUsersQuery);
    const users = result.records.map(record => record.get('u').properties);
    console.log("List of all users:", users);
    res.status(200).json(users);
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: 'Error listing users' });
  }
  finally{
    await session.close();
  }
}