
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from './index';

interface UserAttributes {
  id?: number;          // Primary key
  firstName: string;
  lastName?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;          // Primary key (not nullable)
  public firstName!: string;   // Required field (not nullable)
  public lastName?: string;    // Optional field

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model with attributes and options
User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,      // Pass the sequelize instance
  modelName: 'User',  // Model name
  timestamps: true,   // Enable timestamps (createdAt, updatedAt)
});

export default User;

