import { Model, DataTypes } from "sequelize";
import sequelize from "./index";

interface FavoriteAttributes {
  id?: number;
  userId: number;
  storyId: number;
}

class Favorite extends Model<FavoriteAttributes> implements FavoriteAttributes {
  public id!: number;
  public userId!: number;
  public storyId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model with attributes and options
Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    storyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    timestamps: true, 
  }
);

export default Favorite;