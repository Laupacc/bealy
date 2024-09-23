import User from "./User";
import Story from "./Story";
import Favorite from "./Favorite";

User.hasMany(Favorite, {
  foreignKey: "userId",
  sourceKey: "id",
});

Favorite.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

Story.hasMany(Favorite, {
  foreignKey: "storyId",
  sourceKey: "id",
});

Favorite.belongsTo(Story, {
  foreignKey: "storyId",
  targetKey: "id",
});
