import React from "react";
import FetchStories from "../../components/all/FetchStories";
import MenuBar from "../../components/all/MenuBar";

export default function MainPage() {
  return (
    <div>
      <MenuBar />
      <FetchStories />
    </div>
  );
}
