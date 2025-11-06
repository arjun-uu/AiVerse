import { Sparkles, Loader2, Hash } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const category = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState(""); // AI output (string/markdown)
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("⚠️ Please enter a keyword first!");
      return;
    }

    try {
      setLoading(true);
      setTitles("");
      toast.loading("Generating blog titles...", { id: "gen" });

      const token = await getToken();

      const prompt = `Generate a blog titles for the keyword "${input}" in the "${selectedCategory}" category.`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      if (data.success) {
        setTitles(data.content);
        toast.success("✅ Titles generated successfully!", { id: "gen" });
      } else {
        toast.error("⚠️ Failed to generate titles. Try again later.", {
          id: "gen",
        });
      }
    } catch (error) {
      console.error("❌ Blog title generation error:", error);
      toast.error(
        error.response?.data?.message ||
          "🚫 Something went wrong. Please try again.",
        { id: "gen" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full overflow-y-auto p-8 flex flex-col md:flex-row gap-8 text-slate-700 bg-gradient-to-br from-[#f5f7ff] via-[#f9f0ff] to-[#eef8ff]">
      {/* ✨ Background Orbs */}
      <div className="absolute top-16 right-20 w-72 h-72 bg-[#b617f4]/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 left-16 w-80 h-80 bg-[#4A7AFF]/10 blur-3xl rounded-full"></div>

      {/* Left Panel */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full md:max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#4A7AFF]/20 to-[#b617f4]/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#4A7AFF]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            AI Blog Title Generator
          </h1>
        </div>

        {/* Keyword Input */}
        <label className="text-sm font-medium text-gray-600">Keyword</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 mt-2 text-sm rounded-lg border border-gray-300 focus:border-[#b617f4] focus:ring-2 focus:ring-[#b617f4]/30 outline-none transition-all duration-200 placeholder-gray-400"
          placeholder="Enter a keyword, e.g. Artificial Intelligence"
          required
        />

        {/* Category Selector */}
        <p className="mt-6 text-sm font-medium text-gray-600">Category</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {category.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer shadow-sm ${
                selectedCategory === item
                  ? "bg-gradient-to-r from-[#b617f4] to-[#4A7AFF] text-white border-transparent shadow-md scale-105"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#b617f4] to-[#4A7AFF] hover:from-[#a010e8] hover:to-[#3b6efb] text-white py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Hash className="w-4 h-4" />
              Generate Titles
            </>
          )}
        </button>
      </form>

      {/* Right Output (Scrollable Preview) */}
      <div className="relative overflow-y-auto z-10 w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-[#4A7AFF]/20 to-[#b617f4]/20 rounded-xl">
            <Hash className="w-5 h-5 text-[#b617f4]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Generated Titles
          </h1>
        </div>

        <div className=" h-[450px] lg:h-[550px]  border border-gray-100 rounded-xl p-4 bg-white/60 backdrop-blur-sm shadow-inner scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            </div>
          ) : titles ? (
            <div className=" prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed reset-tw">
              <Markdown>{titles}</Markdown>
            </div>
          ) : (
            <div className="text-sm flex flex-col gap-4 text-gray-400 items-center text-center h-full justify-center">
              <Hash className="w-9 h-9 opacity-70" />
              <p className="max-w-xs leading-relaxed">
                Enter a keyword and click{" "}
                <span className="text-[#b617f4] font-semibold">
                  “Generate Titles”
                </span>{" "}
                to see your AI-generated blog titles here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitle;
