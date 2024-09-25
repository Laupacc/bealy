"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../services/api";
import { FaTrashAlt } from "react-icons/fa";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FavoriteStories() {
  const userID = localStorage.getItem("id");
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavoritesStories = async () => {
      try {
        const response = await api.get(`/favorites/allFavorites/${userID}`);
        setFavorites(response.data);
        console.log("Favorites:", response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      }
    };

    fetchFavoritesStories();
  }, [favorites.length]);

  const deleteStoryFromFavorites = async (storyId: number | null) => {
    if (!userID) {
      console.error("User ID not found in local storage.");
      return;
    }

    if (!storyId) {
      console.error("Invalid story ID.");
      return;
    }

    try {
      const response = await api.delete(`/favorites/${userID}/${storyId}`);
      setFavorites(favorites.filter((story) => story.id !== storyId));
      console.log("Response from deleting story from favorites:", response);
    } catch (error) {
      console.error("Error deleting story from favorites:", error);
    }
  };

  return favorites.map((story) => (
    <Card
      key={story.id}
      className="bg-card text-card-foreground shadow-xl my-2 h-40"
    >
      <div className="flex-row justify-between items-center">
        {story.url ? (
          <Link href={story.url} target="_blank">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{story.title}</CardTitle>
                <FaTrashAlt
                  onClick={() => deleteStoryFromFavorites(story.id)}
                />
              </div>
              <CardDescription>{story.url}</CardDescription>
            </CardHeader>
          </Link>
        ) : (
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{story.title}</CardTitle>
              <FaTrashAlt onClick={() => deleteStoryFromFavorites(story.id)} />
            </div>
          </CardHeader>
        )}
      </div>

      <CardFooter>
        <CardDescription className="text-xs text-muted-foreground mr-1">
          {story.score} points /
        </CardDescription>
        <CardDescription className="text-xs text-muted-foreground mr-1">
          by {story.by} /
        </CardDescription>
        <CardDescription className="text-xs text-muted-foreground">
          {story.descendants} comments
        </CardDescription>
      </CardFooter>
    </Card>
  ));
}
