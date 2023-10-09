import { Model, Options, Sequelize } from 'sequelize';
import { createDB, getDB } from './base';
import User from './models/User';
import Bucket from './models/Bucket';
import BucketMember from './models/BucketMember';
import ShareToken from './models/ShareToken';

const tableList: (typeof Model & { tableinit: (s: Sequelize) => void })[] = [
  User,
  Bucket,
  BucketMember,
  ShareToken
];

let inited = false;

export const initDB = async (opts: Options) => {
  if (inited) {
    throw new Error('already db initialized!!');
  }

  inited = true;
  const sequelize = createDB(opts);
  tableList.forEach((table) => table.tableinit(sequelize));

  Bucket.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
  BucketMember.belongsTo(User, { foreignKey: 'uid', as: 'user' }); //
  BucketMember.belongsTo(Bucket, { foreignKey: 'bid', as: 'bucket' }); //
  ShareToken.belongsTo(Bucket, { foreignKey: 'bid', as: 'bucket' });

  for await (const table of tableList) {
    await table.sync();
  }
  inited = true;
};

export { getDB };

export * as Bucket from './functions/Bucket';
export * as ShareToken from './functions/ShareToken';
export * as User from './functions/User';
