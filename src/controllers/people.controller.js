import { connect } from '../database/mongoCnn';
import { ObjectID } from 'mongodb';
import assert from 'assert';

const collectionName = 'peoples';

// sequelize crud
export async function getEntityAll(req) {
  let retAccion = {status:200, data:[]};
  let {page, pageSize, orderBy, orderType, onlyEnabled} = req.query;
  page = page !== undefined ? parseInt(page): 1;
  pageSize = pageSize !== undefined ? parseInt(pageSize): 10;
  orderBy = orderBy !== undefined ? orderBy: 'name';
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
    let resultData = result.map((item) => {
        return retdataEntity(item);
      });
    retAccion.data = {record: resultData, countAll}
  } catch (error) {
    retAccion.status = 400;
    console.log(error.stack);
  }
  return retAccion;
}

export async function getEntityOne(req) {
  let retAccion = {status:200, data:{}}
  const { id } = req.params;
  try {
    
    const db = await connect();
    const result = await db.collection(collectionName).findOne({_id: ObjectID(id)})
    if (result !== null) {
      retAccion.data = retdataEntity(result);
    } else {
      retAccion = {status:404, data:{msg: `id ${id} not found`}}
    }
  } catch (error) {
    retAccion = {status:404, data:validateError(error)}
    // retAccion = {status:400, data:{error}}
    // console.error(error);
  }
  return retAccion;
}

export async function createEntity(req) {
  let retAccion = {status:200, data:[]}
  try {    
    let dataObject = dataEntity(req.body);
    dataObject.enabled = true;
    const db = await connect();
    const result = await db.collection(collectionName).insertOne(dataObject);
    assert.equal(1, result.insertedCount);
    retAccion = {status: 201, insertedCount: result.insertedCount, data: result.ops[0]}
  } catch (error) {
    retAccion = {status: 400, insertedCount: 0, data: validateError(error)}
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
      result = await db.collection(collectionName).ensureIndex({'dni':1},{'unique':false});
      await db.collection(collectionName).ensureIndex({'name':1});
    }
    
    retAccion = {status: 200, indexCount: result, data: {result: 'Ok'}}
  } catch (error) {
    retAccion = {status: 400, indexCount: 0, data: validateError(error) };
  }
  return retAccion;
}

function dataEntity(valueEnt) {
  // console.log(`${valueEnt.dni} 222`);
  return {
    dni: valueEnt.dni !== undefined ? valueEnt.dni: null,
    name: valueEnt.name !== undefined ? valueEnt.name: null,
    enabled: valueEnt.enabled !== undefined ? valueEnt.enabled: true,
    usuario: valueEnt.usuario !== undefined ? valueEnt.usuario: false,
    cliente: valueEnt.cliente !== undefined ? valueEnt.cliente: false,
    proveedor: valueEnt.proveedor !== undefined ? valueEnt.proveedor: false,
    conductor: valueEnt.conductor !== undefined ? valueEnt.conductor: false,
    locations: {
      phones: valueEnt.locations.phones !== undefined ? valueEnt.locations.phones: [],
      address: valueEnt.locations.address !== undefined ? valueEnt.locations.address: '',
      email: valueEnt.locations.email !== undefined ? valueEnt.locations.email: '',
    }
  }
}

function retdataEntity(valueEnt) {
  // console.log('phone:', valueEnt.locations !== undefined);
  return {
    _id: valueEnt._id !== undefined ? valueEnt._id: null,
    dni: valueEnt.dni !== undefined ? valueEnt.dni: null,
    name: valueEnt.name !== undefined ? valueEnt.name: null,
    enabled: valueEnt.enabled !== undefined ? valueEnt.enabled: true,
    usuario: valueEnt.usuario !== undefined ? valueEnt.usuario: false,
    cliente: valueEnt.cliente !== undefined ? valueEnt.cliente: false,
    proveedor: valueEnt.proveedor !== undefined ? valueEnt.proveedor: false,
    conductor: valueEnt.conductor !== undefined ? valueEnt.conductor: false,
    // locations: valueEnt.locations !== undefined ? valueEnt.locations: {}
    locations:  valueEnt.locations !== undefined ? {
      phones: valueEnt.locations.phones !== undefined ? valueEnt.locations.phones: [],
      address: valueEnt.locations.address !== undefined ? valueEnt.locations.address: '',
      email: valueEnt.locations.email !== undefined ? valueEnt.locations.email: '',
    } : {
      phones:[],
      address: '',
      email: ''
    }
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