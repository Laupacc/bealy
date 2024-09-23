"use client";
import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "@/../utils";
import Link from "next/link";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  description: string;
  profilePicture: string;
  showProfile: boolean;
}

export default function FetchStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("id");

  useEffect(() => {
    const fetchHackerNewsTopStories = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/hackernews/topStoriesHN`
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching HackerNews top stories:", error);
        setStories([]);
      }
    };

    fetchHackerNewsTopStories();
  }, []);

  // If user is signed in, display user profile
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userID || !token) {
        console.error("User ID or token not found in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `${BACKEND_URL}/auth/${userID}/userInfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserInfo(response.data);
        console.log("User info:", response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, []);

  // Save story to favorites
  const saveStory = async (storyId: number) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/${userID}/favorites/${storyId}`,
        {}
      );

      setFavorites([...favorites, storyId]);
      console.log("Saved story:", response.data);
    } catch (error) {
      console.error("Error saving story:", error);
    }
  };

  return (
    <div>
      <Menubar className="flex justify-between items-center">
        <MenubarMenu>
          <MenubarTrigger onClick={() => console.log("New")}>
            New
          </MenubarTrigger>

          <MenubarTrigger>Past</MenubarTrigger>
          <MenubarSeparator />
          <MenubarTrigger>Comments</MenubarTrigger>
        </MenubarMenu>
        <h4>Welcome back {userInfo ? userInfo.firstName : "Guest"}</h4>
      </Menubar>

      {stories.map((story: any) => (
        <Card
          key={story.id}
          className="bg-card text-card-foreground shadow-xl my-2 h-40"
        >
          <Link href={story.url} target="_blank">
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
              <CardDescription>{story.url}</CardDescription>
            </CardHeader>
          </Link>

          <FaSave onClick={() => saveStory(story.id)} />

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
