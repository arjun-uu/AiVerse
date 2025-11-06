import { clerkClient, getAuth } from "@clerk/express";
import OpenAI from "openai";
import { sql } from "../configs/db.js";
import axios from "axios";
import FormData from "form-data";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { createRequire } from "module"; // ✅ moved to top
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");





// ✅ Initialize Gemini AI client
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

/* -------------------------------------------------------------------------- */
/*                         📝 Generate Full Article                           */
/* -------------------------------------------------------------------------- */
export const generateArticle = async (req, res) => {
  try {
    console.log("📩 /generate-article called");

    const { userId } = getAuth(req);
    console.log("🧩 UserId from Clerk:", userId);

    const { prompt, length } = req.body;
    console.log("📝 Prompt:", prompt);
    console.log("📏 Length:", length);

    console.log("📊 Plan:", req.plan);
    console.log("📈 Free usage:", req.free_usage);

    const { plan, free_usage = 0 } = req;

    if (plan !== "premium" && free_usage >= 10) {
      console.log("🚫 Free usage limit reached");
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length || 500,
    });

    const content = response.choices?.[0]?.message?.content || "No response.";
    console.log("✅ AI Response received");

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    console.log("✅ Data saved successfully!");

    res.json({
      success: true,
      message: "Article generated successfully!",
      content,
    });
  } catch (error) {
    console.error("❌ Error generating article:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while generating the article.",
    });
  }
};


/* -------------------------------------------------------------------------- */
/*                        ✍️ Generate Blog Titles                             */
/* -------------------------------------------------------------------------- */
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { prompt } = req.body;
    const { plan, free_usage = 0 } = req;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 120,
    });

    const content = response.choices?.[0]?.message?.content || "No response.";

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, message: "Blog titles generated successfully!", content });
  } catch (error) {
    console.error("❌ Blog Title Generation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error generating blog titles",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                          🎨 Generate Image (ClipDrop)                      */
/* -------------------------------------------------------------------------- */

export const generateImage = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { prompt, publish } = req.body;
    const { plan } = req;

    // ✅ Authentication check
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please sign in.",
      });
    }

    // ✅ Premium feature restriction
    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is available only for premium users.",
      });
    }

    // ✅ Input validation
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid prompt.",
      });
    }

    console.log(`🧠 Generating image for user: ${userId} | Prompt: ${prompt}`);

    // ✅ Send request to ClipDrop API
    const formData = new FormData();
    formData.append("prompt", prompt);

    const clipdropResponse = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    // ✅ Convert binary → base64 → upload to Cloudinary
    const base64Image = `data:image/png;base64,${Buffer.from(
      clipdropResponse.data,
      "binary"
    ).toString("base64")}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "aiverse_images",
    });

    // ✅ Insert record in Neon DB
    await sql`
  INSERT INTO creations (user_id, prompt, content, type, publish)
  VALUES (${userId}, ${prompt}, ${cloudinaryResponse.secure_url}, 'image', ${publish ?? false})
`;



    console.log("✅ Image uploaded to Cloudinary and saved to DB.");

    res.json({
      success: true,
      message: "Image generated successfully!",
      content: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("❌ Image Generation Error:", error);
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error generating image",
    });
  }
};


/* -------------------------------------------------------------------------- */
/*                         🪄 Remove Image Background                         */
/* -------------------------------------------------------------------------- */
export const removeBg = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { plan } = req;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium users.",
      });
    }

    const imagePath = req.file.path;

    const { secure_url } = await cloudinary.uploader.upload(imagePath, {
      transformation: [{ effect: "background_removal" }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Removed background from image', ${secure_url}, 'image')
    `;

    fs.unlinkSync(imagePath); // ✅ Delete temp file

    res.json({
      success: true,
      message: "Background removed successfully!",
      content: secure_url,
    });
  } catch (error) {
    console.error("❌ Background Removal Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                         ✂️ Remove Object from Image                        */
/* -------------------------------------------------------------------------- */
export const removeObj = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { object } = req.body;
    const { plan } = req;

    // 🧱 Premium-only feature
    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium users.",
      });
    }

    // 🧩 Check file upload
    if (!req.file?.path) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    const filePath = req.file.path;

    // 🧠 Step 1: Upload original image to Cloudinary
    const original = await cloudinary.uploader.upload(filePath, {
      folder: "AI_Object_Removal",
      resource_type: "image",
    });

    // 🧠 Step 2: Apply Cloudinary generative remove transformation
    const removedUrl = cloudinary.url(original.public_id, {
      transformation: [
        { effect: `gen_remove:${object}` }, // <--- main magic here
      ],
      resource_type: "image",
    });

    // 🧠 Step 3: Save record in Neon DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${removedUrl}, 'image')
    `;

    // 🧹 Step 4: Cleanup temp file
    fs.unlinkSync(filePath);

    // ✅ Step 5: Send response
    res.json({
      success: true,
      message: "✅ Object removed successfully!",
      content: removedUrl,
    });
  } catch (error) {
    console.error("❌ Object Removal Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove object.",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                          📄 Resume Review (PDF)                            */
/* -------------------------------------------------------------------------- */
export const resumeReview = async (req, res) => {
  try {
    console.log("📩 /review-resume called");

    const { userId } = getAuth(req);
    console.log("🧩 UserId from Clerk:", userId);

    const { plan } = req;
    console.log("📊 Plan:", plan);

    const resume = req.file;
    console.log("📄 Resume uploaded:", resume?.originalname || "No file");

    // 🔒 Step 1: Validate access
    if (plan !== "premium") {
      console.log("🚫 Access denied — non-premium user tried resume review.");
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium users.",
      });
    }

    // 🧾 Step 2: Validate file
    if (!resume) {
      console.log("⚠️ No resume file uploaded");
      return res.status(400).json({
        success: false,
        message: "Please upload a valid resume file.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      console.log("⚠️ File too large (>5MB)");
      return res.status(400).json({
        success: false,
        message: "Resume exceeds the allowed size limit (5MB).",
      });
    }

    // 🧠 Step 3: Extract text using pdf-parse
    console.log("📘 Extracting text from PDF...");
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData.text || pdfData.text.trim().length < 50) {
      console.log("⚠️ PDF text extraction failed or too short");
      return res.status(400).json({
        success: false,
        message:
          "Could not extract readable text. Please upload a text-based (non-scanned) PDF resume.",
      });
    }

    console.log("✅ PDF text extracted successfully.");

    // 🧠 Step 4: Build prompt for Gemini
    const prompt = `
You are an expert career advisor. Review this resume and provide a detailed analysis including:
1. Strengths
2. Weaknesses
3. Areas of improvement
4. Suggestions to make it more ATS-friendly.

Resume Content:
${pdfData.text}
    `;

    // ⚙️ Step 5: Send request to Gemini API
    console.log("🤖 Sending resume text to Gemini...");

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content =
      response.choices?.[0]?.message?.content || "No feedback generated.";

    console.log("✅ Gemini AI response received.");

    // 💾 Step 6: Save result to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume Review', ${content}, 'resume-review')
    `;

    console.log("✅ Resume review result saved to database.");

    // 🧹 Step 7: Clean up local file
    fs.unlinkSync(resume.path);

    // 🚀 Step 8: Send final response
    res.json({
      success: true,
      message: "Resume reviewed successfully!",
      content,
    });
  } catch (error) {
    console.error("❌ Error reviewing resume:", error);
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while reviewing the resume. Please try again.",
    });
  }
};