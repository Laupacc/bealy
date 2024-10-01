"use client";
import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { StoryTypeContext } from "../../../src/context/StoryTypeContext";
import Comments from "../all/Comments";
import SearchResults from "../all/SearchResults";
import OtherUsersProfilesModal from "../all/OtherUsersProfilesModal";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import DOMPurify from "dompurify";
import he from "he";
import { TbTriangleFilled } from "react-icons/tb";
import { ProgressBar } from "react-loader-spinner";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [showAskSection, setShowAskSection] = useState(false);
  const [currentAskStoryId, setCurrentAskStoryId] = useState<number | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const storyTypeContext = useContext(StoryTypeContext);
  if (!storyTypeContext) {
    return null;
  }
  const { storyType } = storyTypeContext;

  // Fetch favorites from the backend
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (userID) {
        try {
          const response = await api.get(`/favorites/allFavorites/${userID}`);
          const favoriteStoryIds = response.data.map((story: any) => story.id);
          setFavorites(favoriteStoryIds);
        } catch (error) {
          console.log(
            "Error fetching user favorites, or user not logged in",
            error
          );
        }
      }
    };

    fetchUserFavorites();
  }, [userID]);

  // Fetch Hacker News stories
  const fetchHackerNewsStories = async (isInitialLoad = false) => {
    setLoading(true);
    try {
      const response = await api.get(`/hackernews/${storyType}Stories`, {
        params: {
          offset,
          limit,
        },
      });

      const stories = response.data;

      // If initial load, replace stories, otherwise append to the list
      setStories((prevStories) =>
        isInitialLoad ? stories : [...prevStories, ...stories]
      );

      setLoading(false);
      console.log(`${storyType} stories:`, stories);
    } catch (error) {
      console.error(`Error fetching ${storyType} stories:`, error);
      setLoading(false);
    }
  };

  // Fetch stories when storyType changes or on initial load
  useEffect(() => {
    setOffset(0);
    setStories([]);
    setSearchResults([]);
    setIsSearchModalOpen(false);
    fetchHackerNewsStories(true);
  }, [storyType]);

  // Detect when user has scrolled to the bottom of the page
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

  // Automatically fetch more stories when the offset changed and the user scrolls to the bottom
  useEffect(() => {
    if (offset > 0) {
      fetchHackerNewsStories();
    }
  }, [offset]);

  // Add story to user's favorites
  const addStoryToFavorites = async (storyId: number | null) => {
    if (!userID) {
      console.log("User not found or not logged in.");
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
      console.log("User not found or not logged in.");
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
    if (currentStoryId !== storyId) {
      setCurrentStoryId(storyId);
      setShowComments(true);
    }
  };

  const closeComments = () => {
    setShowComments(false);
    setCurrentStoryId(null);
  };

  // Search hackernews stories based on query using Algolia API
  const searchHackerNewsStories = async (query: string) => {
    try {
      const response = await api.get(`/hackernews/search?q=${query}`);
      setSearchResults(response.data);
      setIsSearchModalOpen(true);
      console.log("Searched Stories:", response.data);
    } catch (error) {
      console.error("Error searching HackerNews stories:", error);
    }
  };

  // Sort stories by date, score or number of comments
  const sortStories = (sortBy: string, order: string) => {
    switch (sortBy) {
      case "date":
        setStories((prevStories) =>
          [...prevStories].sort((a, b) => {
            return order === "asc" ? a.time - b.time : b.time - a.time;
          })
        );
        break;
      case "score":
        setStories((prevStories) =>
          [...prevStories].sort((a, b) => {
            return order === "asc" ? a.score - b.score : b.score - a.score;
          })
        );
        break;
      case "comments":
        setStories((prevStories) =>
          [...prevStories].sort((a, b) => {
            return order === "asc"
              ? a.descendants - b.descendants
              : b.descendants - a.descendants;
          })
        );
        break;
      default:
        break;
    }
  };

  // Open question in Ask HN section
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

      <div className="flex flex-col justify-center items-center">
        <Card className="bg-chart-5 text-card-foreground shadow-xl w-[70%] mx-auto min-h-[4rem] h-auto fixed top-20 flex flex-col sm:flex-row justify-around items-stretch sm:items-center">
          <div className="flex justify-center items-center m-2">
            <CardDescription className="text-gray-900 text-md ml-2 mr-2 md:mr-5 text-center">
              HackerNews
            </CardDescription>
            <Input
              className="rounded-md border border-input bg-background p-2 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchHackerNewsStories(searchQuery);
                }
              }}
            />
          </div>
          <div className="flex justify-center items-center m-2">
            <label
              className="text-gray-900 text-md ml-2 mr-[4.3rem] sm:mr-3 md:mr-5 text-center"
              htmlFor="sort"
            >
              Sort
            </label>
            <select
              className="rounded-md border border-input bg-background p-2 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 w-full sm:w-[9.6rem]"
              id="sort"
              onChange={(e) => {
                const [criteria, order] = e.target.value.split("-");
                sortStories(criteria, order);
              }}
            >
              <option value="date-asc">Date (Asc)</option>
              <option value="date-desc">Date (Desc)</option>
              {storyType !== "job" && (
                <>
                  <option value="score-asc">Score (Asc)</option>
                  <option value="score-desc">Score (Desc)</option>
                  <option value="comments-asc">Comments (Asc)</option>
                  <option value="comments-desc">Comments (Desc)</option>
                </>
              )}
            </select>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap justify-center mt-32 sm:mt-24">
        {stories.map((story: any, index: number) => (
          <Card
            key={story.id}
            className="bg-card text-card-foreground shadow-xl my-2 w-[90%] mx-auto min-h-[8rem] h-auto"
          >
            <div className="flex-row justify-center items-center ml-2">
              <div className="flex justify-between items-baseline">
                <CardHeader>
                  {story?.url && storyType !== "ask" ? (
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
                      <CardTitle className="text-xl ml-2 break-words">
                        {story.title}
                      </CardTitle>
                    </div>
                  )}

                  {/* Ask HN Section Button */}
                  {(story?.title.startsWith("Ask HN:") ||
                    story?.title.startsWith("Tell HN:")) && (
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
                          {he.decode(
                            DOMPurify.sanitize(story.text || "", {
                              ALLOWED_TAGS: [],
                              ALLOWED_ATTR: [],
                            })
                          )}
                        </CardDescription>
                      )}
                    </>
                  )}
                </CardHeader>

                {userID && (
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
                )}
              </div>
            </div>

            <CardFooter className="flex flex-col sm:flex-row justify-center items-start ml-2">
              {story?.score && story.type !== "job" && (
                <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                  {story.score} points <span className="pl-2">▶︎</span>
                </CardDescription>
              )}

              {story?.by !== undefined && (
                <CardDescription className="text-xs text-muted-foreground hover:underline mr-2 break-words flex items-center">
                  <OtherUsersProfilesModal username={story.by} />
                </CardDescription>
              )}
              {story.type !== "job" && (
                <div className="text-xs text-muted-foreground pr-2">▶︎</div>
              )}

              {story.descendants !== undefined && (
                <button onClick={() => openComments(story.id)}>
                  <CardDescription className="text-xs text-muted-foreground hover:underline mr-2 break-words">
                    {story.descendants} comments
                  </CardDescription>
                </button>
              )}
              <CardDescription className="text-xs text-muted-foreground ml-auto break-words">
                {moment.unix(story.time).fromNow()}
              </CardDescription>
            </CardFooter>

            <Comments
              storyId={currentStoryId}
              open={showComments && currentStoryId === story.id}
              onClose={closeComments}
            />
          </Card>
        ))}
      </div>
      <SearchResults
        isOpen={isSearchModalOpen}
        onClose={() => {
          setSearchQuery("");
          setSearchResults([]);
          setIsSearchModalOpen(false);
        }}
        searchResults={searchResults}
        searchQuery={searchQuery}
      />
    </div>
  );
}
