import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

import User from "../models/User";
import Story from "../models/Story";
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

// Get a user's info by ID
router.get("/:userId/userInfo", authenticateJWT, async (req: any, res: any) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      description: user.description,
      profilePicture: user.profilePicture,
      showProfile: user.showProfile,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user info." });
  }
});

// Update a user's info by ID
router.post(
  "/:userId/userInfo",
  authenticateJWT,
  async (req: any, res: any) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      await user.update(req.body);
      res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        description: user.description,
        profilePicture: user.profilePicture,
        showProfile: user.showProfile,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user info." });
    }
  }
);

// Get user favorites stories
router.get(
  "/:userId/favorites",
  authenticateJWT,
  async (req: any, res: any) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const favorites = await Favorite.findAll({
        where: { userId: req.params.userId },
      });
      const stories = await Story.findAll({
        where: { id: favorites.map((favorite: any) => favorite.storyId) },
      });
      res.status(200).json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user favorites." });
    }
  }
);

// Add a story to favorites
router.post(
  "/:userId/favorites/:storyId",
  authenticateJWT,
  async (req: any, res: any) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const story = await Story.findOne({ where: { id: req.params.storyId } });
      if (!story) {
        return res.status(404).json({ error: "Story not found." });
      }
      await Favorite.create({
        userId: req.params.userId,
        storyId: req.params.storyId,
      });
      res.status(200).json({ message: "Story added to favorites." });
    } catch (error) {
      res.status(500).json({ error: "Failed to add story to favorites." });
    }
  }
);

// Remove a story from favorites
router.delete(
  "/:userId/favorites/:storyId",
  authenticateJWT,
  async (req: any, res: any) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const story = await Story.findOne({ where: { id: req.params.storyId } });
      if (!story) {
        return res.status(404).json({ error: "Story not found." });
      }
      await Favorite.destroy({
        where: { userId: req.params.userId, storyId: req.params.storyId },
      });
      res.status(200).json({ message: "Story removed from favorites." });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove story from favorites." });
    }
  }
);

// Retrieve all users whose profiles are public
router.get(
  "/allUsersPublicProfiles",
  authenticateJWT,
  async (req: any, res: any) => {
    try {
      const users = await User.findAll({
        where: { showProfile: true },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve users." });
    }
  }
);

// Retrieve a specific user's public profile to see all their stories
router.get(
  "publicProfile/:userId",
  authenticateJWT,
  async (req: any, res: any) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      if (!user.showProfile) {
        return res.status(403).json({ error: "User profile is not public." });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user." });
    }
  }
);

export default router;
