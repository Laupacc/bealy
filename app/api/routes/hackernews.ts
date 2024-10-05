import express, { Request, Response } from "express";
import {
  fetchStories,
  fetchComments,
  fetctSubComments,
  fetchUserProfiles,
  search,
} from "../controllers/hackernewsController";
const router = express.Router();

// Fetch HackerNews top stories
router.get("/topStories", async (req: Request, res: Response) => {
  await fetchStories(req, res, "topstories");
});

// Fetch HackerNews new stories
router.get("/newStories", async (req: Request, res: Response) => {
  await fetchStories(req, res, "newstories");
});

// Fetch HackerNews ask stories
router.get("/askStories", async (req: Request, res: Response) => {
  await fetchStories(req, res, "askstories");
});

// Fetch HackerNews show stories
router.get("/showStories", async (req: Request, res: Response) => {
  await fetchStories(req, res, "showstories");
});

// Fetch HackerNews job stories
router.get("/jobStories", async (req: Request, res: Response) => {
  await fetchStories(req, res, "jobstories");
});

// Fetch comments for a story
router.get("/comments/:storyId", fetchComments);

// Fetch kids (sub-comments) for each comment recursively
router.get("/kids/:commentId", fetctSubComments);

// Fetch all public user profiles by ID
router.get("/users/:userId", fetchUserProfiles);

// Search option using Algolia
router.get("/search", search);

export default router;
