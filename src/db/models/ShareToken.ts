import { CHAR, DATE, INTEGER, Model, Sequelize } from 'sequelize';
import Bucket from './Bucket';

export default class ShareToken extends Model {
  public id!: number;
  
  public bid!: number; // Bucket.id
  public basePath!: string;
  public token!: string;

  public expiresAt!: Date;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  public bucket!: Bucket;

  static tableinit(sequelize: Sequelize) {
    this.init({
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bid: {
        type: INTEGER,
        allowNull: false,
      },
      basePath: {
        type: CHAR,
        allowNull: false,
      },
      token: {
        type: CHAR(63),
        allowNull: false,
      },
      expiresAt: {
        type: DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'ShareToken',
      charset: 'utf8mb4',
      indexes: [{
        fields: ['token'],
        unique: true,
      }],
    });
  }
}
