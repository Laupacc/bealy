import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import User from "../models/User";

const JWT = process.env.JWT_SECRET;

// Middleware to authenticate JWT token
export const authenticateJWT = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.token;

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

// Middleware to refresh JWT token
export const refreshToken = (req: any, res: Response, next: NextFunction) => {
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = decoded.exp - currentTime;

    // Check if the token is about to expire in the next 10 minutes (600 seconds)
    if (timeToExpire < 600) {
      console.log("Token is about to expire, refreshing...");
      const newToken = jwt.sign({ email: decoded.email }, JWT, {
        expiresIn: "1h",
      });

      console.log("Generated new token");

      res.locals.newToken = newToken; // Store the new token temporarily
      // res.setHeader("Authorization", `Bearer ${res.locals.newToken}`);
      // Set the new token in the cookie
      setTokenCookie(res, newToken);

      console.log("New token added to header in RefreshToken middleware");
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed in RefreshToken middleware:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Set the token in cookie
export const setTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
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

    console.log("User created successfully");

    setTokenCookie(res, token);

    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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

    setTokenCookie(res, token);

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Logout a user
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).send("Logout successful");
});

// Get a user's info by ID
router.get(
  "/:userId/userInfo",
  authenticateJWT,
  refreshToken,
  async (req: any, res: any) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const responseData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        description: user.description,
        profilePicture: user.profilePicture,
        showProfile: user.showProfile,
      };

      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user info." });
    }
  }
);

// Update a user's info by ID
router.put(
  "/:userId/userInfo",
  authenticateJWT,
  refreshToken,
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

// Retrieve all users from databse whose profiles are public
router.get("/allUsersPublicProfiles", async (req: any, res: any) => {
  try {
    const users = await User.findAll({
      where: { showProfile: true },
    });
    res.status(200).json(users);
    console.log("Retrieved users");
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users." });
  }
});

export default router;
