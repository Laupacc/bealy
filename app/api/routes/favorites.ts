import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

import User from "../models/User";
import Favorite from "../models/Favorite";

const JWT = process.env.JWT_SECRET;

// Authenticate JWT middleware
const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT, (err: any, user: any) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    console.log("User authenticated:", user);
    next();
  });
};

// Add a story to favorites
router.post("/:userId/favorites/:storyId", async (req: any, res: any) => {
  try {
    const storyId = req.params.storyId;
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const favorite = await Favorite.findOne({
      where: { userId: user.id, storyId: storyId },
    });
    if (favorite) {
      return res.status(409).json({ error: "Story already in favorites." });
    }

    const newFavorite = await Favorite.create({
      userId: user.id,
      storyId: storyId,
    });
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ error: "Failed to add story to favorites." });
  }
});

// Remove a story from favorites

export default router;
