import { CHAR, ENUM, INTEGER, Model, Sequelize } from 'sequelize';
import User from './User';

export default class Bucket extends Model {
  public id!: number;

  public name!: string;
  public ownerId!: number; // User.id
  public type!: 'OS' | 'S3' | 'FTP';

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  public owner!: User;

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
      type: {
        type: ENUM('OS', 'S3', 'FTP'),
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'Bucket',
      charset: 'utf8mb4',
    });
  }
}
