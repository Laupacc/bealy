import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import User from "../models/User";

const JWT = process.env.JWT_SECRET;

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

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, JWT, { expiresIn: "1h" });

    // Create the user in the database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      token: token,
    });

    console.log("User created successfully:", user);

    // Send the response back to the client
    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: user.token,
    });
  } catch (error) {
    console.error("Error during registration process:", error);
    res
      .status(500)
      .json({ error: "Internal server error occurred during registration." });
  }
});

// Login a user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Email or password invalid" });
    }

    const token = jwt.sign({ email }, JWT, { expiresIn: "1h" });

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

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
