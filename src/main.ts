import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { initDB } from './db';
import api from './api';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(compression());

const reqEnvs = [
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];

const appInitializer = async () => {
  for (let i = 0; i < reqEnvs.length; i++) {
    if (!process.env[reqEnvs[i]]) {
      throw new Error(`Required environment variable ${reqEnvs[i]} is not set`);
    }
  }
  await initDB({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    timezone: '+09:00',
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true,
    },
    logging: process.env.NODE_ENV === 'dev' ? console.log : false,
  });
};

app.use('/api', api);

appInitializer().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});