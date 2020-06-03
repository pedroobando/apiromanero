import { Router } from 'express';
import { createEntity, updateEntity, removeEntity, createIndex, getEntityAll, getEntityOne } from '../controllers/user.controller';
const theRouter = Router();

theRouter.get('/',  async (req, res) => {
  try {
    const result = await getEntityAll(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.get('/createindex',  async (req, res) => {
  try {
    const result = await createIndex();
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.get('/:id', async (req, res) => {
  try {
    const result = await getEntityOne(req, '_id');
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.get('/_idpeople/:id', async (req, res) => {
  try {
    const result = await getEntityOne(req, '_idpeople');
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.get('/login/:id', async (req, res) => {
  try {
    const result = await getEntityOne(req, 'login');
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});



theRouter.post('/', async (req, res) => {
  try {
    const result = await createEntity(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.put('/:id', async (req, res) => {
  try {
    const result = await updateEntity(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.delete('/:id', async (req, res) => {
  try {
    const result = await removeEntity(req);
    res.status(result.status).json(result.deletedCount);
  } catch (error) {
    console.log(error);
  }  
});


export default theRouter;