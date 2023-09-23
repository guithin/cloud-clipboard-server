import { Model, Options, Sequelize } from 'sequelize';
import { createDB, getDB } from './base';

const tableList: (typeof Model & { tableinit: (s: Sequelize) => void })[] = [

];

let inited = false;

export const initDB = async (opts: Options) => {
  if (inited) {
    throw new Error('already db initialized!!');
  }

  inited = true;
  const sequelize = createDB(opts);
  tableList.forEach((table) => table.tableinit(sequelize));

  for await (const table of tableList) {
    await table.sync();
  }
  inited = true;
};

export { getDB };

// export * as Users from './functions/User';
