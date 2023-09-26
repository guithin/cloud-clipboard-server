import { CHAR, INTEGER, Model, Sequelize } from 'sequelize';
import User from './User';

export default class Bucket extends Model {
  public id!: number;

  public name!: string;
  public ownerId!: number; // User.id

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  public oner!: User;

  static tableinit(sequelize: Sequelize) {
    this.init({
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: CHAR,
        allowNull: false,
      },
      ownerId: {
        type: INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'Bucket',
      charset: 'utf8mb4',
    });
  }
}
