import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getPublishedCreations,
  getUserCreations,
  toggleLikeCreations,
} from "../controllers/userController.js";

const creationsRouter = express.Router();

// Public route — fetch published creations
creationsRouter.get("/published", getPublishedCreations);

// Authenticated routes
creationsRouter.get("/user", auth, getUserCreations);
creationsRouter.post("/toggle-like", auth, toggleLikeCreations);

export default creationsRouter;
