// import Conductor from '../models/conductor';
import { connect } from '../database/mongoCnn';
import { ObjectID } from 'mongodb';
import assert from 'assert';

const collectionPeople = 'peoples';
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
    const norderType = orderType == 'ASC' ? 1: -1;
    const db = await connect();
    const countAll = await db.collection(collectionName).countDocuments(onlyEnabled ? { 'enabled': true }: {})
    const result = await db.collection(collectionName).find(onlyEnabled ? { 'enabled': true }: {})
      .limit(pageSize)
      .skip(nskip)
      .sort({[orderBy]: norderType})
      .toArray();
    retAccion.data = {record: result, countAll}
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
    console.log(id, _field);
    const db = await connect();
    const result = await db.collection(collectionName).findOne({[_field]: (_field!='_id'? id: ObjectID(id))})
    if (result !== null) {
      const people = await db.collection(collectionPeople).findOne({_id: ObjectID(result._idpeople)})
      retAccion.data = retdataEntity(result, people);
      // retAccion.data = result;
    } else {
      retAccion = {status:404, data:{msg: `${_field} ${id} not found`}}
    }
  } catch (error) {
    retAccion = {status:404, data:validateError(error)}
    // console.error(error);
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
  let retAccion = {status:200, data:[]}
  try {
    let dataObject = dataEntity(req.body);
    // dataObject.enabled = true;
    const db = await connect();
    const result = await db.collection(collectionName).insertOne(dataObject);
    assert.equal(1, result.insertedCount);
    // const _user = await db.collection(collectionPeople).findOne({_id: ObjectID(dataObject._idpeople)});
    // _user.activo = true;
    // console.log(_user);
    // await db.collection(collectionPeople).updateOne({_id: ObjectID(_people._id)},{$set:_people});
    retAccion = {status: 201, insertedCount: result.insertedCount, data: result.ops[0]}
  } catch (error) {
    retAccion = {status: 400, insertedCount: 0, data: validateError(error)}
    console.error(error);
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
    retAccion = {status: 400, modifiedCount: 0, data: validateError(error) };
  }
  return retAccion;
}

export async function removeEntity(req) {
  let retAccion = {status:400, deletedCount:0, data:0}
  try {
    const db = await connect();
    const { id } = req.params;
    // const _people = await db.collection(collectionPeople).findOne({_id: ObjectID(result._idpeople)});
    // _people.usuario = true;
    // const result2 = await db.collection(collectionPeople).updateOne({_id: ObjectID(dataObject._idpeople)},_people);
    let result = await db.collection(collectionName).deleteOne({_id: ObjectID(id)});
    assert.equal(1, result.deletedCount);
    retAccion = {status: 200, deletedCount: result.deletedCount, data: {id, result}}
  } catch (error) {
    retAccion = {status: 400, deletedCount: 0, data: validateError(error) };
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
      // await db.collection(collectionName).ensureIndex({'name':1});
    }
    
    retAccion = {status: 200, indexCount: result, data: {result: 'Ok'}}
  } catch (error) {
    retAccion = {status: 400, indexCount: 0, data: validateError(error) };
  }
  return retAccion;
}

function dataEntity(valueEnt) {
  return {
    // _id: valueEnt._id !== undefined ? valueEnt._idpeople: null,
    login: valueEnt.login !== undefined ? valueEnt.login: null,
    pass: valueEnt.pass !== undefined ? valueEnt.pass: null,
    email: valueEnt.email !== undefined ? valueEnt.email: null,
    website: valueEnt.website !== undefined ? valueEnt.website: null,
    dni: valueEnt.dni !== undefined ? valueEnt.dni: 0,
    name: valueEnt.name !== undefined ? valueEnt.name: null,
    lastlogin: valueEnt.lastlogin != undefined ? valueEnt.lastlogin: Date.now()    
  }
}

function retdataEntity(valueEnt, peopleEnt) {
  // const people = await db.collection(collectionPeople).findOne({_id: ObjectID(result.idpeople)})
  return {
    _id: valueEnt._id,
    _idpeople: valueEnt._idpeople,
    login: valueEnt.login !== undefined ? valueEnt.login: null,
    pass: valueEnt.pass !== undefined ? valueEnt.pass: null,
    email: valueEnt.email !== undefined ? valueEnt.email: null,
    dni: peopleEnt.dni !== undefined ? valueEnt.dni: 0,
    name: peopleEnt.name !== undefined ? valueEnt.name: null,
    lastlogin: peopleEnt.lastlogin != undefined ? valueEnt.lastlogin: Date.now()
  }
}

function validateError(errParam) {
  let errMessage = {};
  let errValue = 'ss'; // errParam.errors[0].value == null ? '': errParam.errors[0].value;
  // console.error(errParam);
  if (errParam.name == 'SequelizeValidationError') {
    errMessage = {msg: `El ${errParam.errors[0].path} ${errValue} no es valido, por favor verifique.`}
  }
  // if (errParam.name == 'SequelizeUniqueConstraintError') {
  //   errMessage = {msg: `El ${errParam.fields} ${errValue} ya esta registrado, por favor ingrese otro.`}
  // }
  if (errParam.name == 'SequelizeUniqueConstraintError') {
    errMessage = {msg: `El ${errParam.errors[0].path} ${errValue} ya esta registrado, por favor ingrese otro.`}
  }
  // console.log(errParam.name);
  console.log(errMessage.msg);
  return errMessage;  
}