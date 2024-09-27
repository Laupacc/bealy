"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../services/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/auth/allUsersPublicProfiles");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const displayUserFavorites = async (userId: number | null) => {
    setFavoritesLoading(true);
    try {
      const response = await api.get(`/favorites/allFavorites/${userId}`);
      setUserFavorites(response.data);
      console.log("User's Favorites:", response.data.length);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setUserFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Name</TableHead>
                  <TableHead className="w-1/3">Email</TableHead>
                  <TableHead className="w-1/3">Description</TableHead>
                  <TableHead className="w-1/3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="w-1/3">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="w-1/3">{user.email}</TableCell>
                    <TableCell className="w-1/3">{user.description}</TableCell>
                    <TableCell className="w-1/3 text-right">
                      <Button
                        variant="outline"
                        onClick={() => displayUserFavorites(user.id)}
                      >
                        Show Favorites
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User's Favorites Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>User's Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            {favoritesLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : userFavorites.length > 0 ? (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Title</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userFavorites.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell>{story.title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No favorites to display.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
