/* eslint-disable no-underscore-dangle */
import { ObjectID } from 'mongodb';
import assert from 'assert';
import { _mdateObject } from '../middlewares/date';
import errorMessage from '../middlewares/errorMessage';
import connect from '../database/mongoCnn';

const collectionName = 'vehiculo';
const fieldkeyName = { placa: 1 };
const fieldkeyFilter = (fieldkey) => {
  return fieldkey.toString().toUpperCase().replace(/ /g, '');
};

function dataEntity(valueEnt) {
  return {
    placa: valueEnt.placa !== undefined ? fieldkeyFilter(valueEnt.placa) : null,
    tara: valueEnt.tara !== undefined ? valueEnt.tara : 0,
    conductor: {
      _id: valueEnt.conductor._id !== undefined ? valueEnt.conductor.id : 0,
      dni: valueEnt.conductor.dni !== undefined ? valueEnt.conductor.dni : null,
      nombre: valueEnt.conductor.nombre !== undefined ? valueEnt.conductor.nombre : null,
    },
    marca: valueEnt.marca !== undefined ? valueEnt.marca : '',
    modelo: valueEnt.modelo !== undefined ? valueEnt.modelo : '',
    activo: valueEnt.activo !== undefined ? valueEnt.activo : true,
    userId: valueEnt.userId !== undefined ? valueEnt.userId : null,
    timestamps: Date.now(),
  };
}

function retdataEntity(valueEnt) {
  return {
    _id: valueEnt._id !== undefined ? valueEnt._id : null,
    placa: valueEnt.placa !== undefined ? valueEnt.placa : null,
    tara: valueEnt.tara !== undefined ? valueEnt.tara : 0,
    conductor:
      valueEnt.conductor !== undefined
        ? {
            _id: valueEnt.conductor._id !== undefined ? valueEnt.conductor._id : 0,
            dni: valueEnt.conductor.dni !== undefined ? valueEnt.conductor.dni : null,
            nombre: valueEnt.conductor.nombre !== undefined ? valueEnt.conductor.nombre : null,
          }
        : {
            _id: 0,
            dni: null,
            nombre: null,
          },
    marca: valueEnt.marca !== undefined ? valueEnt.marca : '',
    modelo: valueEnt.modelo !== undefined ? valueEnt.modelo : '',
    activo: valueEnt.activo !== undefined ? valueEnt.activo : true,
    userId: valueEnt.userId !== undefined ? valueEnt.userId : null,
    timestamps: _mdateObject(valueEnt.timestamps),
  };
}

// sequelize crud
export async function getEntityAll(req) {
  const retAccion = { status: 200, data: [] };
  let { page, pageSize, orderBy, orderType, onlyEnabled } = req.query;
  page = page !== undefined ? parseInt(page, 10) : 1;
  pageSize = pageSize !== undefined ? parseInt(pageSize, 10) : 10;
  orderBy = orderBy !== undefined ? orderBy : 'placa';
  orderType = orderType !== undefined ? orderType : 'ASC';
  onlyEnabled = onlyEnabled !== undefined;
  const nskip = (page - 1) * pageSize;
  try {
    const norderType = orderType === 'ASC' ? 1 : -1;
    const xfEntity = (xItem) => {
      return retdataEntity(xItem);
    };
    const db = await connect();
    const countAll = await db.collection(collectionName).countDocuments(onlyEnabled ? { enabled: true } : {});
    const result = await db
      .collection(collectionName)
      .find(onlyEnabled ? { enabled: true } : {})
      .limit(pageSize)
      .skip(nskip)
      .sort({ [orderBy]: norderType })
      .toArray();
    retAccion.data = { record: result.map(xfEntity), countAll };
  } catch (error) {
    retAccion.status = 400;
    // console.log(error.stack);
  }
  return retAccion;
}

export async function getEntityOne(req, _field) {
  let retAccion = { status: 200, data: {} };
  const { id } = req.params;
  try {
    const findCondition = { [_field]: _field !== '_id' ? id : ObjectID(id) };
    const db = await connect();
    const result = await db.collection(collectionName).findOne(findCondition);
    if (result !== null) {
      retAccion.data = retdataEntity(result);
    } else {
      retAccion = { status: 404, data: { msg: `${_field} ${id} not found` } };
    }
  } catch (error) {
    retAccion = { status: 404, data: errorMessage(error) };
  }
  return retAccion;
}

export async function createEntity(req) {
  let retAccion = { status: 200, data: [] };
  try {
    const dataObject = dataEntity(req.body);
    const db = await connect();
    const result = await db.collection(collectionName).insertOne(dataObject);
    assert.equal(1, result.insertedCount);
    retAccion = { status: 201, insertedCount: result.insertedCount, data: result.ops[0] };
  } catch (error) {
    retAccion = { status: 400, insertedCount: 0, data: errorMessage(error) };
  }
  return retAccion;
}

export async function updateEntity(req) {
  let retAccion = { status: 400, modifiedCount: 0, data: {} };
  try {
    const { id } = req.params;
    const dataObject = dataEntity(req.body);
    const db = await connect();
    const result = await db.collection(collectionName).updateOne({ _id: ObjectID(id) }, { $set: dataObject });
    assert.equal(1, result.modifiedCount);
    retAccion = { status: 200, modifiedCount: result.modifiedCount, data: dataObject };
  } catch (error) {
    retAccion = { status: 400, modifiedCount: 0, data: errorMessage(error) };
  }
  return retAccion;
}

export async function removeEntity(req) {
  let retAccion = { status: 400, deletedCount: 0, data: 0 };
  try {
    const db = await connect();
    const { id } = req.params;
    const result = await db.collection(collectionName).deleteOne({ _id: ObjectID(id) });
    assert.equal(1, result.deletedCount);
    retAccion = { status: 200, deletedCount: result.deletedCount, data: { id, result } };
  } catch (error) {
    retAccion = { status: 400, deletedCount: 0, data: errorMessage(error) };
  }
  return retAccion;
}

export async function createIndex() {
  let retAccion = { status: 400, deletedCount: 0, data: 0 };
  try {
    const db = await connect();
    let result = await db.collection(collectionName).dropIndexes();
    if (result) {
      result = await db.collection(collectionName).ensureIndex(fieldkeyName, { unique: true });
    }
    retAccion = { status: 200, indexCount: result, data: { result: 'Ok' } };
  } catch (error) {
    retAccion = { status: 400, indexCount: 0, data: errorMessage(error) };
  }
  return retAccion;
}
