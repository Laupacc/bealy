import React, { useState, useEffect } from "react";
import MenuBar from "../../components/all/MenuBar";
import Users from "../../components/all/Users";

export default function UsersPage() {
  return (
    <div>
      <MenuBar />
      <Users />
    </div>
  );
}
