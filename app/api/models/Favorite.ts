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
      // Adding foreign key constraint if you have Users table
      references: {
        model: 'Users', // Name of the referenced table
        key: 'id',      // Key in the referenced table
      },
      onDelete: 'CASCADE', // Ensure related favorites are removed when a user is deleted
    },
    storyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      // Adding unique constraint to prevent duplicate entries
      unique: 'user_story_unique', // Composite unique constraint
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    timestamps: true,
  }
);


export default Favorite;
