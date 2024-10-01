import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "./index";

interface UserAttributes {
  id?: number;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  description?: string;
  profilePicture?: string;
  showProfile?: boolean;
  token?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number; // Primary key (not nullable)
  public firstName!: string; // Required field (not nullable)
  public lastName?: string; // Optional field
  public email!: string; // Required field (not nullable)
  public password!: string; // Required field (not nullable)
  public age?: number;
  public description?: string;
  public profilePicture?: string;
  public showProfile?: boolean;
  public token?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model with attributes and options
User.init(
  {
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
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    showProfile: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize, // Pass the sequelize instance
    modelName: "User", // Model name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
  }
);

export default User;
