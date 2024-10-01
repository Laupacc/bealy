"use client";
import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import Comments from "@/components/all/Comments";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { ProgressBar } from "react-loader-spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Users() {
  const userID = localStorage.getItem("id");
  const favoritesRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(false);
  const [displayFavorites, setDisplayFavorites] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showComments, setShowComments] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);

  // Fetch public user profiles from database
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

  // Display user's favorites
  const displayUserFavorites = async (userId: number | null) => {
    setFavoritesLoading(true);
    // Set the user right away
    setSelectedUser(users.find((user) => user.id === userId));
    setDisplayFavorites(true);

    if (favoritesRef.current) {
      favoritesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    try {
      const response = await api.get(`/favorites/allFavorites/${userId}`);
      setUserFavorites(response.data);
      console.log("User's Favorites:", response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setUserFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const openComments = (storyId: number) => {
    setCurrentStoryId(storyId);
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
    setCurrentStoryId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/10">Picture</TableHead>
                  <TableHead className="w-1/10">Name</TableHead>
                  <TableHead className="w-1/10">Email</TableHead>
                  <TableHead className="w-1/10">Age</TableHead>
                  <TableHead className="w-1/10">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  ?.filter((user) => user.id !== Number(userID))
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="w-1/10">
                        <img
                          src={
                            user.profilePicture
                              ? user.profilePicture
                              : "/images/hackernewslogo2.png"
                          }
                          alt="Profile Picture"
                          className="h-12 w-12 rounded-full"
                        />
                      </TableCell>
                      <TableCell className="w-1/10">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="w-1/10">{user.email}</TableCell>
                      <TableCell className="w-1/10">
                        {user.age || "N/A"}
                      </TableCell>
                      <TableCell className="w-1/10">
                        {user.description || "N/A"}
                      </TableCell>
                      <TableCell className="w-1/10 text-right">
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
      {displayFavorites && (
        <div className="mt-8" ref={favoritesRef}>
          <Card>
            {favoritesLoading ? (
              <CardHeader>
                <Skeleton className="h-12 w-full flex items-center justify-center">
                  <ProgressBar
                    visible={true}
                    height="140"
                    width="140"
                    barColor="#f97316"
                    borderColor="#0369a1"
                    ariaLabel="progress-bar-loading"
                    wrapperStyle={{
                      margin: "0 auto",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Skeleton>
              </CardHeader>
            ) : userFavorites.length > 0 ? (
              <>
                <CardHeader>
                  <CardTitle>
                    {selectedUser?.firstName} {selectedUser?.lastName} has{" "}
                    {userFavorites.length} favorite stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2">Title</TableHead>
                        <TableHead className="w-1/6">Comments</TableHead>
                        <TableHead className="w-1/6">Score</TableHead>
                        <TableHead className="w-1/6">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userFavorites?.map((favorite) => (
                        <TableRow key={favorite.id}>
                          <TableCell className="w-1/2">
                            {favorite.url ? (
                              <Link
                                href={favorite.url}
                                target="_blank"
                                className="text-blue-700 text-lg hover:underline"
                              >
                                {favorite.title}
                              </Link>
                            ) : (
                              <Link
                                href={`https://news.ycombinator.com/item?id=${favorite.id}`}
                                target="_blank"
                                className="text-blue-700 text-lg hover:underline"
                              >
                                <p>{favorite.title}</p>
                              </Link>
                            )}
                          </TableCell>
                          <TableCell className="w-1/6">
                            <button
                              onClick={() => openComments(favorite.id)}
                              className="hover:underline"
                            >
                              {favorite.descendants || 0} comments
                            </button>
                          </TableCell>
                          <TableCell className="w-1/6">
                            {favorite.score} points
                          </TableCell>
                          <TableCell className="w-1/6">
                            {moment.unix(favorite.time).fromNow()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </>
            ) : (
              <CardHeader>
                <CardTitle>
                  <p className="text-center">
                    {" "}
                    {selectedUser?.firstName} {selectedUser?.lastName} has no
                    favorites yet
                  </p>
                </CardTitle>
              </CardHeader>
            )}
          </Card>
        </div>
      )}

      <Comments
        storyId={currentStoryId}
        open={showComments}
        onClose={closeComments}
      />
    </div>
  );
}
