const { MongoClient } = require('mongodb');

async function listUsers() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("healthcare");
    const users = await db.collection("users").find().toArray();
    console.log(users);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

listUsers();
