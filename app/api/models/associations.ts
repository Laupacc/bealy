import User from "./User";
import Favorite from "./Favorite";

User.hasMany(Favorite, {
  foreignKey: "userId",
  sourceKey: "id",
});

Favorite.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});
