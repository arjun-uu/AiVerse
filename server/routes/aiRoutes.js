import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeBg,
  removeObj,
  resumeReview,
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

// ✅ AI text/image generation routes
aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog-title", auth, generateBlogTitle);
aiRouter.post("/generate-image", auth, generateImage);

// ✅ File upload routes (auth first → upload second)
aiRouter.post("/remove-bg", auth, upload.single("image"), removeBg);
aiRouter.post("/remove-object", auth, upload.single("image"), removeObj);
aiRouter.post("/review-resume", auth, upload.single("resume"), resumeReview);

export default aiRouter;
