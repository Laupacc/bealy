"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../services/api";
import { FaSave } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FetchStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const userID = localStorage.getItem("id");

  useEffect(() => {
    const fetchHackerNewsTopStories = async () => {
      try {
        const response = await api.get(`/hackernews/topStoriesHN`);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching HackerNews top stories:", error);
        setStories([]);
      }
    };

    fetchHackerNewsTopStories();
  }, []);

  // Add story to user's favorites
  const addStoryToFavorites = async (storyId: number | null) => {
    if (!userID) {
      console.error("User ID not found in local storage.");
      return;
    }

    if (!storyId) {
      console.error("Invalid story ID.");
      return;
    }

    try {
      const response = await api.post(`/favorites/${userID}/${storyId}`);

      console.log("Response from adding story to favorites:", response);

      setFavorites([...favorites, storyId]);
    } catch (error) {
      console.error("Error adding story to favorites:", error);
    }
  };

  return (
    <div>
      {stories.map((story: any) => (
        <Card
          key={story.id}
          className="bg-card text-card-foreground shadow-xl my-2 h-40"
        >
          {story.url ? (
            <Link href={story.url} target="_blank">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{story.title}</CardTitle>
                  <FaSave onClick={() => addStoryToFavorites(story.id)} />
                </div>
                <CardDescription>{story.url}</CardDescription>
              </CardHeader>
            </Link>
          ) : (
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{story.title}</CardTitle>
                <FaSave onClick={() => addStoryToFavorites(story.id)} />
              </div>
            </CardHeader>
          )}

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
      ))}
    </div>
  );
}
