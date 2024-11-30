const { MongoClient } = require('mongodb');

const url =
  'mongodb+srv://tarik2454:7L1CXhUWy9EM1t2u@cluster0.f0ezl.mongodb.net/';
const dbName = 'backend-test-task-Vorcl';

const registerUser = async email => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');
    const newUser = { email };
    const result = await collection.insertOne(newUser);

    return {
      email,
      _id: result.insertedId,
    };
  } catch (err) {
    console.error('Ошибка при записи в базу:', err);
    throw err;
  } finally {
    await client.close();
  }
};

module.exports = { registerUser };
