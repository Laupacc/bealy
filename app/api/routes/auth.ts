import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import User from "../models/User";

const JWT = process.env.JWT_SECRET;

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

export default router;
