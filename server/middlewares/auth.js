import { getAuth, clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    // ✅ Extract user from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not authenticated",
      });
    }

    // ✅ Fetch full user data from Clerk
    const user = await clerkClient.users.getUser(userId);

    // ✅ Read plan and usage safely
    const plan = user?.privateMetadata?.plan || "free";
    const free_usage = user?.privateMetadata?.free_usage ?? 0;

    // ✅ Reset free usage if user is premium
    if (plan === "premium" && free_usage !== 0) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { ...user.privateMetadata, free_usage: 0 },
      });
    }

    // ✅ Attach user info to request
    req.userId = userId;
    req.plan = plan;
    req.free_usage = plan === "premium" ? 0 : free_usage;

    // ✅ Log (optional)
    console.log("🧩 Authenticated:", {
      userId,
      plan: req.plan,
      free_usage: req.free_usage,
    });

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
