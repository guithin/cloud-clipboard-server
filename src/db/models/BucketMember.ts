import { INTEGER, Model, Sequelize } from 'sequelize';

export default class BucketMember extends Model {
  public id!: number;

  public bid!: number; // Bucket.id
  public uid!: number; // User.id

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

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
      uid: {
        type: INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'BucketMember',
      charset: 'utf8mb4',
      indexes: [{
        fields: ['bid', 'uid'],
        unique: true,
      }],
    });
  }
}
