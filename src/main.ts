import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import { initDB } from './db';
import api from './api';
import { ioInit } from './wsHandler';
import { fetchUserMiddleware } from './util/session';
import OSFSBag from './fsHelper/OSFileSystem';
import SFTPBag from './fsHelper/SFTPSystem';
import { init as redisInit } from './util/redis';

const app = express();
const httpServer = createServer(app);

ioInit(httpServer);

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
  'NODE_ENV',
  'BASE_DIR',
  'JWT_SECRET',
  'PASSWD_HASH_SECRET',
  'MULTER_PATH',
  'SFTP_HOST',
  'SFTP_PORT',
  'SFTP_AUTH_TYPE',
  'SFTP_USERNAME',
  'SFTP_BASE_DIR',
];

const appInitializer = async () => {
  for (let i = 0; i < reqEnvs.length; i++) {
    if (!process.env[reqEnvs[i]]) {
      throw new Error(`Required environment variable ${reqEnvs[i]} is not set`);
    }
  }
  if (process.env.SFTP_AUTH_TYPE === 'password') {
    if (!process.env.SFTP_PASSWORD) {
      throw new Error('SFTP_PASSWORD is not set');
    }
  } else {
    if (!process.env.SFTP_KEY_PATH) {
      throw new Error('SFTP_KEY_PATH is not set');
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
  await OSFSBag.initial();
  await SFTPBag.initial();
  await redisInit();
};

app.use(fetchUserMiddleware);
app.use('/api', api);

appInitializer().then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
