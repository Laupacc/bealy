import express from "express";
import { authenticateJWT, refreshToken } from "../middlewares/auth";
import {
  addFavorite,
  getAllFavorites,
  removeFavorite,
} from "../controllers/favoriteController";
const router = express.Router();

// Add a story to favorites
router.post("/:userId/:storyId", authenticateJWT, refreshToken, addFavorite);

// Get all favorites for a user
router.get("/allFavorites/:userId", getAllFavorites);

// Remove a story from favorites
router.delete(
  "/:userId/:storyId",
  authenticateJWT,
  refreshToken,
  removeFavorite
);

export default router;
