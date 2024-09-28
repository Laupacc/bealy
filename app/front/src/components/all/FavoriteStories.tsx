"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../services/api";
import Image from "next/image";
import Comments from "../all/Comments";
import OtherUsersProfilesModal from "../all/OtherUsersProfilesModal";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "react-loader-spinner";
import { TbTriangleFilled } from "react-icons/tb";
import moment from "moment";
import { ChevronDown, ChevronRight } from "lucide-react";
import { start } from "repl";

export default function FavoriteStories() {
  const userID = localStorage.getItem("id");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAskSection, setShowAskSection] = useState(false);
  const [currentAskStoryId, setCurrentAskStoryId] = useState<number | null>(
    null
  );

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavoritesStories = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/favorites/allFavorites/${userID}`);
        response.data.forEach((story: any) => {
          story.time = moment.unix(story.time).fromNow();
        });
        setFavorites(response.data);
        setLoading(false);
        console.log("Favorites:", response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
        setLoading(false);
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

  const openComments = (storyId: number) => {
    setCurrentStoryId(storyId);
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
    setCurrentStoryId(null);
  };

  // Open Ask Section for story id
  const openAskSection = (storyId: number) => {
    setCurrentAskStoryId((prevId) => (prevId === storyId ? null : storyId));
    setShowAskSection(!showAskSection);
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

      {favorites.length > 0 &&
        !loading &&
        favorites.map((story, index) => (
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

                  {(story.title.startsWith("Ask HN:") ||
                    story.title.startsWith("Tell HN:")) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openAskSection(story.id)}
                        className="ml-2 mt-2"
                        style={{ alignSelf: "flex-start" }}
                      >
                        {currentAskStoryId === story.id ? (
                          <>
                            <ChevronRight className="mr-1" /> Hide Question
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1" /> Show Question
                          </>
                        )}
                      </Button>
                      {currentAskStoryId === story.id && (
                        <CardDescription className="text-xs text-muted-foreground text-justify">
                          {story.text}
                        </CardDescription>
                      )}
                    </>
                  )}
                </CardHeader>

                <Image
                  src="/images/trash.png"
                  width={25}
                  height={25}
                  alt="delete"
                  onClick={() => deleteStoryFromFavorites(story.id)}
                  className="cursor-pointer mr-6 w-auto h-auto max-w-[25px] max-h-[25px] sm:max-w-[30px] sm:max-h-[30px]"
                />
              </div>
            </div>

            <CardFooter className="flex flex-col sm:flex-row justify-center items-start ml-2">
              <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                {story.score} points <span className="pl-2">▶︎</span>
              </CardDescription>
              <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                <OtherUsersProfilesModal username={story.by} />

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
          </Card>
        ))}

      {favorites.length === 0 && !loading && !userID && (
        <div className="text-center text-2xl text-muted-foreground mt-10">
          No favorite stories yet
        </div>
      )}

      {favorites.length === 0 && !loading && userID && (
        <div className="text-center text-2xl text-muted-foreground mt-10">
          Log in to see your favorite stories
        </div>
      )}

      <Comments
        storyId={currentStoryId}
        open={showComments && currentStoryId !== null}
        onClose={closeComments}
      />
    </div>
  );
}
