import { useUser, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth(); // ✅ Correct way to get token
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) fetchCreations();
  }, [isLoaded]);

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/creations/published");
      if (data.success) setCreations(data.creations);
    } catch (error) {
      console.error("❌ Error fetching creations:", error);
      toast.error("Failed to load community creations.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      if (!user) return toast.error("Please sign in to like creations.");
      const token = await getToken(); // ✅ Get token properly
      if (!token) return toast.error("Failed to authenticate user.");

      const { data } = await axios.post(
        "/api/creations/toggle-like",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setCreations((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  likes: c.likes.includes(user.id)
                    ? c.likes.filter((u) => u !== user.id)
                    : [...c.likes, user.id],
                }
              : c
          )
        );
      } else {
        toast.error(data.message || "Something went wrong while liking.");
      }
    } catch (error) {
      console.error("❌ Like Error:", error);
      toast.error("Something went wrong while liking.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading community creations...
      </div>
    );

  return (
    <div className="relative flex-1 h-full flex flex-col gap-6 p-8 bg-gradient-to-br from-[#f3f0ff] via-[#f5f7ff] to-[#eef2ff]">
      <div className="absolute top-20 left-16 w-72 h-72 bg-[#b617f4]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-16 right-20 w-96 h-96 bg-[#4A7AFF]/10 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-start gap-1">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Explore <span className="text-[#4A7AFF]">Community Creations</span>
        </h1>
        <p className="text-sm text-gray-500">
          Discover and engage with AI-generated masterpieces from creators
          worldwide.
        </p>
      </div>

      <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {creations.map((creation) => (
          <div
            key={creation.id}
            className="group relative rounded-2xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-md border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={creation.content}
              alt="Generated creation"
              className="w-full h-64 object-cover rounded-t-2xl"
            />

            {/* ❤️ Like Button */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
              <Heart
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(creation.id);
                }}
                className={`w-5 h-5 cursor-pointer transition-all duration-300 hover:scale-125 ${
                  creation.likes.includes(user?.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
              <span className="text-xs font-medium text-gray-700">
                {creation.likes.length}
              </span>
            </div>

            {/* 🧠 Prompt Overlay */}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 pointer-events-none">
              <p className="text-white text-sm font-light leading-relaxed line-clamp-2 group-hover:line-clamp-none">
                {creation.prompt || "Untitled Creation"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
