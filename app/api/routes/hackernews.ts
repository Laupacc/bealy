import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();


// Fetch HackerNews top stories
router.get("/topStoriesHN", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const storyIds = await response.json();

    const storyPromises = storyIds.slice(0, 30).map(async (id: number) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    });

    const stories = await Promise.all(storyPromises);

    res.status(200).json(stories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve HackerNews top stories." });
  }
});

export default router;
