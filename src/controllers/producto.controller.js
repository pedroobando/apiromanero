import { _mdateObject } from '../middlewares/date';
import { _merrorMessage } from '../middlewares/errorMessage';
import { connect } from '../database/mongoCnn';
import { ObjectID } from 'mongodb';
import assert from 'assert';

const collectionName = 'producto';
const fieldkeyName = {'codigo': 1};
const fieldkeyFilter = (fieldkey) => { return fieldkey.toString().toUpperCase().replace(/ /g, ""); }

// sequelize crud
export async function getEntityAll(req) {
  let retAccion = {status:200, data:[]};
  let {page, pageSize, orderBy, orderType, onlyEnabled} = req.query;
  page = page !== undefined ? parseInt(page): 1;
  pageSize = pageSize !== undefined ? parseInt(pageSize): 10;
  orderBy = orderBy !== undefined ? orderBy: 'nombre';
  orderType = orderType !== undefined ? orderType: 'ASC';
  onlyEnabled = onlyEnabled !== undefined ? true: false;
  const nskip = (page-1) * pageSize;
  try {
    const xfEntity = (xItem) => {return retdataEntity(xItem)};
    const norderType = orderType == 'ASC' ? 1: -1;
    const db = await connect();
    const countAll = await db.collection(collectionName).countDocuments(onlyEnabled ? { 'enabled': true }: {})
    const result = await db.collection(collectionName).find(onlyEnabled ? { 'enabled': true }: {})
      .limit(pageSize)
      .skip(nskip)
      .sort({[orderBy]: norderType})
      .toArray();
    retAccion.data = {record: result.map(xfEntity), countAll}
  } catch (error) {
    retAccion.status = 400;
    // console.log(error.stack);
  }
  return retAccion;
}

export async function getEntityOne(req, _field) {
  let retAccion = {status:200, data:{}}
  const { id } = req.params;
  try {
    const findCondition = {[_field]: (_field!='_id'? id: ObjectID(id))};
    const db = await connect();
    const result = await db.collection(collectionName).findOne(findCondition)
    if (result !== null) {
      retAccion.data = retdataEntity(result);
    } else {
      retAccion = {status:404, data:{msg: `${_field} ${id} not found`}}
    }
  } catch (error) {
    retAccion = {status:404, data:_merrorMessage(error)}
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
    retAccion = {status: 400, insertedCount: 0, data: _merrorMessage(error)}
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
    retAccion = {status: 400, modifiedCount: 0, data: _merrorMessage(error) };
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
    retAccion = {status: 400, deletedCount: 0, data: _merrorMessage(error) };
  }
  return retAccion;
}

export async function createIndex() {
  let retAccion = {status:400, deletedCount:0, data:0}
  try {
    const db = await connect();
    let result = await db.collection(collectionName).dropIndexes();
    if (result) {
      result = await db.collection(collectionName).ensureIndex(fieldkeyName ,{'unique':true});
      // await db.collection(collectionName).ensureIndex({'nombre':1});
    }    
    retAccion = {status: 200, indexCount: result, data: {result: 'Ok'}}
  } catch (error) {
    retAccion = {status: 400, indexCount: 0, data: _merrorMessage(error) };
  }
  return retAccion;
}

function dataEntity(valueEnt) {
  return {
    codigo: valueEnt.codigo !== undefined ? fieldkeyFilter(valueEnt.codigo): null,
    nombre: valueEnt.nombre !== undefined ? valueEnt.nombre: null,
    presentacion: valueEnt.presentacion !== undefined ? valueEnt.presentacion: null,
    peso: valueEnt.peso !== undefined ? valueEnt.peso:0,
    activo: valueEnt.activo !== undefined ? valueEnt.activo: true,
    timestamps: Date.now()
  }
}

function retdataEntity(valueEnt) {
  return {
    _id: valueEnt._id !== undefined ? valueEnt._id: null,
    codigo: valueEnt.codigo !== undefined ? valueEnt.codigo: null,
    nombre: valueEnt.nombre !== undefined ? valueEnt.nombre: null,
    presentacion: valueEnt.presentacion !== undefined ? valueEnt.presentacion: null,
    peso: valueEnt.peso !== undefined ? valueEnt.peso:0,
    activo: valueEnt.activo !== undefined ? valueEnt.activo: true,
    timestamps: _mdateObject(valueEnt.timestamps)
  }
}