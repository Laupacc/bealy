"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../services/api";
import Comments from "../all/Comments";
import Image from "next/image";
import moment from "moment";
import { useContext } from "react";
import { TbTriangleFilled } from "react-icons/tb";
import { StoryTypeContext } from "../../../src/context/StoryTypeContext";
import { ProgressBar } from "react-loader-spinner";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FetchStories() {
  const userID = localStorage.getItem("id");
  const [stories, setStories] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 30;
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);

  const storyTypeContext = useContext(StoryTypeContext);
  if (!storyTypeContext) {
    return null;
  }
  const { storyType } = storyTypeContext;

  // Fetch favorites from the backend on component mount
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (userID) {
        try {
          const response = await api.get(`/favorites/allFavorites/${userID}`);
          const favoriteStoryIds = response.data.map((story: any) => story.id);
          setFavorites(favoriteStoryIds);
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
    };

    fetchUserFavorites();
  }, [userID]);

  // Fetch stories with pagination
  const fetchHackerNewsStories = async (isInitialLoad = false) => {
    setLoading(true);
    try {
      const response = await api.get(`/hackernews/${storyType}Stories`, {
        params: {
          offset,
          limit,
        },
      });

      const formattedStories = response.data.map((story: any) => ({
        ...story,
        time: moment.unix(story.time).fromNow(),
      }));

      // If it's the initial load, replace the stories, otherwise append to the list
      setStories((prevStories) =>
        isInitialLoad ? formattedStories : [...prevStories, ...formattedStories]
      );

      setLoading(false);
      console.log(`${storyType} stories:`, formattedStories);
    } catch (error) {
      console.error(`Error fetching ${storyType} stories:`, error);
      setLoading(false);
    }
  };

  // Fetch stories when storyType changes or on initial load
  useEffect(() => {
    setOffset(0); // Reset offset when the story type changes
    setStories([]); // Clear current stories when the story type changes
    fetchHackerNewsStories(true); // Fetch new stories based on story type
  }, [storyType]);

  // Detect when user has scrolled to the bottom and load more stories
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !loading
      ) {
        setOffset((prevOffset) => prevOffset + limit);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // Fetch more stories when the offset changed and the user scrolls to the bottom
  useEffect(() => {
    if (offset > 0) {
      fetchHackerNewsStories();
    }
  }, [offset]);

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

      // Toggle favorite status
      if (favorites.includes(storyId)) {
        setFavorites(favorites.filter((id) => id !== storyId));
      } else {
        setFavorites([...favorites, storyId]);
      }
    } catch (error) {
      console.error("Error adding story to favorites:", error);
    }
  };

  // Remove story from user's favorites
  const removeStoryFromFavorites = async (storyId: number | null) => {
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

      console.log("Response from deleting story from favorites:", response);

      // Toggle favorite status
      if (favorites.includes(storyId)) {
        setFavorites(favorites.filter((id) => id !== storyId));
      } else {
        setFavorites([...favorites, storyId]);
      }
    } catch (error) {
      console.error("Error removing story from favorites:", error);
    }
  };

  // Toggle favorites button
  const toggleFavorites = async (storyId: number) => {
    if (favorites.includes(storyId)) {
      removeStoryFromFavorites(storyId);
    } else {
      addStoryToFavorites(storyId);
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
    <div>
      {loading && (
        <ProgressBar
          visible={true}
          height="140"
          width="140"
          barColor="#f97316"
          borderColor="#0369a1"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <div className="flex flex-wrap justify-center">
        {stories.map((story: any, index: number) => (
          <Card
            key={story.id}
            className="bg-card text-card-foreground shadow-xl my-2 w-[90%] mx-auto min-h-[8rem] h-auto"
          >
            <div className="flex-row justify-center items-center ml-2">
              <div className="flex justify-between items-baseline">
                <CardHeader>
                  {story.url ? (
                    <Link href={story.url} target="_blank">
                      <div className="flex items-start flex-wrap sm:flex-nowrap">
                        <div className="flex items-center">
                          <TbTriangleFilled color="#f59e0b" size={16} />
                          <CardTitle className="text-xl ml-2">
                            {index + 1}&nbsp;•&nbsp;
                          </CardTitle>
                        </div>

                        <CardTitle className="cursor-pointer hover:underline text-xl ml-0 sm:ml-2 break-words">
                          {story.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="break-all">
                        {story.url}
                      </CardDescription>
                    </Link>
                  ) : (
                    <div className="flex items-start flex-wrap sm:flex-nowrap">
                      <div className="flex items-center">
                        <TbTriangleFilled color="#f59e0b" size={16} />
                        <CardTitle className="text-xl ml-2">
                          {index + 1}&nbsp;•&nbsp;
                        </CardTitle>
                      </div>
                      <CardTitle className="cursor-pointer hover:underline text-xl ml-2 break-words">
                        {story.title}
                      </CardTitle>
                    </div>
                  )}
                </CardHeader>

                <Image
                  src={
                    favorites.includes(story.id)
                      ? "/images/save.png"
                      : "/images/saveOutline.png"
                  }
                  width={25}
                  height={25}
                  alt="delete"
                  onClick={() => toggleFavorites(story.id)}
                  className="cursor-pointer mr-6 w-auto h-auto max-w-[25px] max-h-[25px] sm:max-w-[30px] sm:max-h-[30px]"
                />
              </div>
            </div>

            <CardFooter className="flex flex-col sm:flex-row justify-center items-start ml-2">
              <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                {story.score} points <span className="pl-2">▶︎</span>
              </CardDescription>
              <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                by {story.by}{" "}
                {story.descendants !== undefined && (
                  <span className="pl-2">▶︎</span>
                )}
              </CardDescription>

              {story.descendants !== undefined && (
                <button onClick={() => openComments(story.id)}>
                  <CardDescription className="text-xs text-muted-foreground hover:underline mr-2 break-words">
                    {story.descendants} comments
                  </CardDescription>
                </button>
              )}
              <CardDescription className="text-xs text-muted-foreground ml-auto break-words">
                {story.time}
              </CardDescription>
            </CardFooter>

            <Comments
              storyId={currentStoryId}
              open={showComments}
              onClose={closeComments}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
