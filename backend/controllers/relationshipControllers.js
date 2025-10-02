import {transactionRelationshipCypher, userRelationshipCypher} from "../cyphers/relationshipCypher.js";

export async function getUserRelationships(driver, req, res){
    const session = driver.session();
    const {id} = req.params;
    try {
        console.log("Requested to get user relationships for ID:", id);
        const result = await session.run(userRelationshipCypher, {id});
        const relationships = result.records.map(record => ({
  source: record.get('u').properties,
  relationship: record.get('r').type,
  target: record.get('n').properties,
}));
console.log("User relationships:", relationships);
        res.status(200).json(relationships);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user relationships' });
    }
    finally{
        await session.close();
    }
}

export async function getTransactionRelationships(driver, req, res){
    const session = driver.session();
    const {id} = req.params;
    try {
        console.log("Requested to get transaction relationships for ID:", id);
        const result = await session.run(transactionRelationshipCypher, {id});
        const relationships = result.records.map(record => ({
  source: record.get('t').properties,
  relationship: record.get('r').type,
  target: record.get('n').properties,
}));

        console.log("Transaction relationships:", relationships);
        res.status(200).json(relationships);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching transaction relationships' });
    }
    finally{
        await session.close();
    }
}