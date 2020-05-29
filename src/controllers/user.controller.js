import { _mdateObject } from '../middlewares/date';
import { _merrorMessage } from '../middlewares/errorMessage';
import { connect } from '../database/mongoCnn';
import { ObjectID } from 'mongodb';
import assert from 'assert';


const collectionName = 'users';

// sequelize crud
export async function getEntityAll(req) {
  let retAccion = {status:200, data:[]};
  let {page, pageSize, orderBy, orderType, onlyEnabled} = req.query;
  page = page !== undefined ? parseInt(page): 1;
  pageSize = pageSize !== undefined ? parseInt(pageSize): 10;
  orderBy = orderBy !== undefined ? orderBy: 'login';
  orderType = orderType !== undefined ? orderType: 'ASC';
  onlyEnabled = onlyEnabled !== undefined ? true: false;
  const nskip = (page-1) * pageSize;
  try {
    const xformEntity = (xItem) => {return retdataEntity(xItem)};
    const norderType = orderType == 'ASC' ? 1: -1;
    const db = await connect();
    const countAll = await db.collection(collectionName).countDocuments(onlyEnabled ? { 'enabled': true }: {})
    const result = await db.collection(collectionName).find(onlyEnabled ? { 'enabled': true }: {})
      .limit(pageSize)
      .skip(nskip)
      .sort({[orderBy]: norderType})
      .toArray();    
    retAccion.data = {record: result.map(xformEntity),countAll}
  } catch (error) {
    retAccion.status = 400;
    console.log(error.stack);
  }
  return retAccion;
}

export async function getEntityOne(req, _field) {
  let retAccion = {status:200, data:{}}
  const { id } = req.params;
  try {
    const db = await connect();
    const result = await db.collection(collectionName).findOne({[_field]: (_field!='_id'? id: ObjectID(id))})
    if (result !== null) {
      retAccion.data = retdataEntity(result, result);
    } else {
      retAccion = {status:404, data:{msg: `${_field} ${id} not found`}}
    }
  } catch (error) {
    retAccion = {status:404, data:_merrorMessage(error)}
  }
  return retAccion;
}

// export async function getEntityByLogin(req) {
//   let retAccion = {status:200, data:{}}
//   try {
//     const { login } = req.params;
//     const db = await connect();
//     const result = await db.collection(collectionName).findOne({login})
//     if (result !== null) {
//       const people = await db.collection(collectionPeople).findOne({_id: ObjectID(result._idpeople)})
//       retAccion.data = retdataEntity(result, people);
//     } else {
//       retAccion = {status:404, data:{msg: `login ${login} not found`}}
//     }
//   } catch (error) {
//     retAccion = {status:404, data:validateError(error)}
//     // retAccion = {status:400, data:{error}}
//     // console.error(error);
//   }
//   return retAccion;
// }

export async function createEntity(req) {
  // import CryptoJS from 'crypto-js';
  // const fraseSecreta = '39skj3987sd1f';
  let retAccion = {status:200, data:[]}
  try {
    let dataObject = dataEntity(req.body);
    // dataObject.enabled = true;
    const db = await connect();
    // let xpass = CryptoJS.AES.encrypt(dataObject.pass, fraseSecreta).toString();
    // dataObject.pass = xpass;
    const result = await db.collection(collectionName).insertOne(dataObject);
    assert.equal(1, result.insertedCount);
    retAccion = {status: 201, insertedCount: result.insertedCount, data: result.ops[0]}
  } catch (error) {
    retAccion = {status: 400, insertedCount: 0, data:_merrorMessage(error)}
  }
  return retAccion;
}

export async function updateEntity(req) {
  let retAccion = {status:400, modifiedCount:0, data:{}}
  try {
    const { id } = req.params;
    let dataObject = dataEntity(req.body);
    const db = await connect();
    const result = await db.collection(collectionName).updateOne({_id: ObjectID(id)}, {$set: dataObject});
    assert.equal(1, result.modifiedCount);
    retAccion = {status: 200, modifiedCount: result.modifiedCount}
  } catch (error) {
    retAccion = {status: 400, modifiedCount: 0, data:_merrorMessage(error) };
  }
  return retAccion;
}

export async function removeEntity(req) {
  let retAccion = {status:400, deletedCount:0, data:0}
  try {
    const db = await connect();
    const { id } = req.params;
    let result = await db.collection(collectionName).deleteOne({_id: ObjectID(id)});
    assert.equal(1, result.deletedCount);
    retAccion = {status: 200, deletedCount: result.deletedCount, data: {id, result}}
  } catch (error) {
    retAccion = {status: 400, deletedCount: 0, data:_merrorMessage(error) };
  }
  return retAccion;
}

export async function createIndex() {
  let retAccion = {status:400, deletedCount:0, data:0}
  try {
    const db = await connect();
    let result = await db.collection(collectionName).dropIndexes();
    if (result) {
      result = await db.collection(collectionName).ensureIndex({'login':1},{'unique':true});
    }
    retAccion = {status: 200, indexCount: result, data: {result: 'Ok'}}
  } catch (error) {
    retAccion = {status: 400, indexCount: 0, data:_merrorMessage(error) };
  }
  return retAccion;
}

function dataEntity(valueEnt) {
  return {
    login: valueEnt.login !== undefined ? valueEnt.login.toLowerCase(): null,
    pass: valueEnt.pass !== undefined ? valueEnt.pass: null,
    email: valueEnt.email !== undefined ? valueEnt.email.toLowerCase(): null,
    name: valueEnt.name !== undefined ? valueEnt.name: null,
    lastlogin: valueEnt.lastlogin != undefined ? valueEnt.lastlogin: Date.now()
  }
}

function retdataEntity(valueEnt) {
  return {
    _id: valueEnt._id,
    login: valueEnt.login !== undefined ? valueEnt.login: null,
    pass: valueEnt.pass !== undefined ? valueEnt.pass: null,
    email: valueEnt.email !== undefined ? valueEnt.email: null,
    name: valueEnt.name !== undefined ? valueEnt.name: null,
    lastlogin: _mdateObject(valueEnt.lastlogin)
  }
}