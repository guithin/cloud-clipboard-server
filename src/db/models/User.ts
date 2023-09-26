import { CHAR, INTEGER, Model, STRING, Sequelize } from 'sequelize';

export default class User extends Model {
  public id!: number;

  public userId!: string;
  public password!: string;

  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static tableinit(sequelize: Sequelize) {
    this.init({
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: CHAR(63),
        allowNull: false,
        unique: true,
      },
      password: {
        type: CHAR,
        allowNull: false,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'User',
      charset: 'utf8mb4',
    });
  }
}
