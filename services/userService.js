const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'mydb';

const getUserById = async id => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('users');
  const user = await collection.findOne({ _id: ObjectId(id) });
  await client.close();
  return user;
};

module.exports = { getUserById };
