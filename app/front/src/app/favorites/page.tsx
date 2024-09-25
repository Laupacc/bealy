import React, { useState, useEffect } from "react";
import FavoriteStories from "../../components/all/FavoriteStories";
import MenuBar from "../../components/all/MenuBar";

export default function FavoritesPage() {
  return (
    <div>
      <MenuBar />
      <FavoriteStories />
    </div>
  );
}
