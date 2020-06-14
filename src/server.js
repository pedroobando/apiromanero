import '@babel/polyfill';
import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import routeApps from './routes';

// initialization
const serve = express();
dotenv.config();

// initialization consts
export const thePort = process.env.PORT || 3000;
export const theHost = process.env.HOST || '0.0.0.0';

// middlewares
if (process.env.NODE_ENV === 'DEV') {
  serve.use(morgan('dev'));
}

// el metodo sync(), crea la base de datos y tablas si estas no existen
serve.use(cors()).use(json());
routeApps(serve);
// });

export default serve;
