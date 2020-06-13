import { MongoClient } from 'mongodb';

export default async function connect() {
  let dbretval = null;
  const internalIP = process.env.MONGODB_HOST || '0.0.0.0:27017';
  const userName = encodeURIComponent(process.env.MONGODB_USERNAME);
  const userPassword = encodeURIComponent(process.env.MONGODB_USERPASS);
  const url = `mongodb://${userName}:${userPassword}@${internalIP}/`;
  const dbname = 'romanero';
  const client = MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    // open connection
    await client.connect();
    dbretval = await client.db(dbname);
  } catch (errdb) {
    // console.error(errdb.stack);
    throw Error(`Error en coneccion ${url}`);
  }
  return dbretval;
}
