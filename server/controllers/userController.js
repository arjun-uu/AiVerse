import { getAuth } from "@clerk/express";
import { sql } from "../configs/db.js";

/* -------------------------------------------------------------------------- */
/*                           🧠 Get User Creations                            */
/* -------------------------------------------------------------------------- */
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not authenticated",
      });
    }

    const result = await sql`
      SELECT * FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations: result.rows || result });
  } catch (error) {
    console.error("❌ Error fetching user creations:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                          🌍 Get Published Creations                        */
/* -------------------------------------------------------------------------- */
export const getPublishedCreations = async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM creations
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    const formatted = result.map((r) => ({
      ...r,
      likes: Array.isArray(r.likes) ? r.likes : [],
    }));

    res.json({ success: true, creations: formatted });
  } catch (error) {
    console.error("❌ Error fetching published creations:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                              ❤️ Toggle Like                               */
/* -------------------------------------------------------------------------- */
export const toggleLikeCreations = async (req, res) => {
  try {
    console.log("🔥 toggleLikeCreations called");

    const { userId } = getAuth(req);
    const { id } = req.body;

    console.log("🧩 userId:", userId);
    console.log("🧾 creationId:", id);

    // 🧱 Step 1: Validate input
    if (!userId) {
      console.log("🚫 No userId found (unauthorized)");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - please login first",
      });
    }

    if (!id) {
      console.log("🚫 Missing creation ID");
      return res.status(400).json({
        success: false,
        message: "Missing creation ID",
      });
    }

    // 🧱 Step 2: Fetch creation
    const result = await sql`SELECT * FROM creations WHERE id = ${id}`;
    console.log("🪄 DB result:", result);

    const creation = result[0] || result.rows?.[0];
    if (!creation) {
      console.log("⚠️ Creation not found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    console.log("❤️ Current likes:", creation.likes);

    const currentLikes = creation.likes || [];
    const userIdStr = String(userId);

    // 🧩 Step 3: Toggle like
    const updatedLikes = currentLikes.includes(userIdStr)
      ? currentLikes.filter((u) => u !== userIdStr)
      : [...currentLikes, userIdStr];

    const formattedArray = `{${updatedLikes.join(",")}}`;
    console.log("✅ Updated likes array:", formattedArray);

    // 🧩 Step 4: Update DB
    await sql`
      UPDATE creations
      SET likes = ${formattedArray}::text[]
      WHERE id = ${id}
    `;

    console.log("✅ Likes updated successfully in DB");

    // 🧩 Step 5: Send response
    res.json({
      success: true,
      message: "Like toggled successfully",
      likes: updatedLikes.length,
    });
  } catch (error) {
    console.error("❌ Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while liking.",
    });
  }
};