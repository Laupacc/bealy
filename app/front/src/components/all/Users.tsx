"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../services/api";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/auth/allUsersPublicProfiles");
        setUsers(response.data);
        console.log("Users:", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [users.length]);

  // when user clicks on a user, shows user's favorite stories
  const displayUserFavorites = async (userId: number | null) => {
    try {
      const response = await api.get(`/favorites/allFavorites/${userId}`);
      setUserFavorites(response.data);
      console.log("User's Favorites:", response.data.length);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setUserFavorites([]);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            <button onClick={() => displayUserFavorites(user.id)}>
              {user.firstName} {user.lastName}
            </button>
          </li>
        ))}
      </ul>

      <h1>User's Favorites</h1>
      <ul>
        {userFavorites?.map((story) => (
          <li key={story.id}>{story.title}</li>
        ))}
      </ul>
    </div>
  );
}
