import { MongoClient } from 'mongodb';

export async function connect() {
  const internalIP = process.env.MONGODB_HOST || '0.0.0.0:27017';
  // const url = `mongodb://${internalIP}:27017/`; // process.env.MONGO_CONNECT;
  const userName = encodeURIComponent(process.env.MONGODB_USERNAME);
  const userPassword = encodeURIComponent(process.env.MONGODB_USERPASS);
  // const authMechanism = 'DEFAULT';
  const url = `mongodb://${userName}:${userPassword}@${internalIP}/`; // process.env.MONGO_CONNECT;
  // const url = `mongodb://${internalIP}:27018/`; // process.env.MONGO_CONNECT;
  const dbname = 'shared';
  const client = MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    // open connection
    await client.connect();
    const db = client.db(dbname);
    return db;
  } catch (errdb) {
    console.error(errdb.stack);
  }
  // close connection
  client.close();
}