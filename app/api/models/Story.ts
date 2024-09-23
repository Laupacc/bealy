import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "./index";

interface StoryAttributes {
  id?: number;
  title: string;
  url: string;
}

interface StoryCreationAttributes extends Optional<StoryAttributes, "id"> {}

class Story
  extends Model<StoryAttributes, StoryCreationAttributes>
  implements StoryAttributes
{
  public id!: number;
  public title!: string;
  public url!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model with attributes and options
Story.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Story",
    timestamps: true,
  }
);

export default Story;