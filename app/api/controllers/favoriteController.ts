import express, { Request, Response } from "express";
import axios from "axios";
const router = express.Router();

import User from "../models/User";
import Favorite from "../models/Favorite";

// Add a story to favorites
export const addFavorite = async (req: any, res: any) => {
  try {
    const { userId, storyId } = req.params;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the favorite already exists for the user
    const existingFavorite = await Favorite.findOne({
      where: { userId, storyId },
    });
    if (existingFavorite) {
      res.json("Favorite already exists.");
      return;
    }

    // Create new favorite
    const newFavorite = await Favorite.create({ userId, storyId });
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error("Error adding story to favorites:", error);
    res.status(500).json({ error: "Failed to add story to favorites." });
  }
};

// Get all favorites for a user
export const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findOne({
      where: { id: userId, showProfile: true },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Get the user's favorite stories
    const favorites = await Favorite.findAll({
      where: { userId },
    });

    // Fetch story details from Hacker News API using the storyIds
    const storyIds = favorites.map((fav) => fav.storyId);
    const storyDetails = await fetchStoriesFromAPI(storyIds);

    res.json(storyDetails);
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).json({ error: "Failed to retrieve favorites." });
  }
};

// Fetch story details from Hacker News API using the storyIds
const fetchStoriesFromAPI = async (storyIds: number[]) => {
  const stories = [];
  for (const storyId of storyIds) {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
    );
    if (response.status === 200) {
      stories.push(response.data);
    }
  }
  return stories;
};

// Remove a story from favorites
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, storyId } = req.params;
    const favorite = await Favorite.findOne({ where: { userId, storyId } });
    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found." });
    }
    await favorite.destroy();
    res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Failed to remove favorite." });
  }
};

export default router;
