import React, { useState } from "react";
import { Sparkles, SquarePen, Loader2, Edit } from "lucide-react";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast"; // ✅ Import toast

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500–800 words)" },
    { length: 1200, text: "Medium (800–1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }

    try {
      setLoading(true);
      setOutput("");
      toast.loading("Generating your article...", { id: "gen" });

      const token = await getToken();
      const prompt = `Write an article about "${input}" that is ${selectedLength.text}.`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setOutput(data.content);
        toast.success("✨ Article generated successfully!", { id: "gen" });
      } else {
        toast.error("⚠️ Failed to generate article. Try again later.", {
          id: "gen",
        });
      }
    } catch (error) {
      console.error(
        "❌ Article generation error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "🚫 Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full  p-8 flex flex-col lg:flex-row gap-8 text-slate-700 bg-gradient-to-br from-[#f8faff] to-[#eef3ff]">
      {/* Background gradients */}
      <div className="absolute  top-20 left-10 w-64 h-64 bg-[#4A7AFF]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute  bottom-10 right-10 w-72 h-72 bg-[#b617f4]/10 blur-3xl rounded-full animate-pulse"></div>

      {/* Left: Input Form */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#4A7AFF]/20 to-[#b617f4]/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#4A7AFF]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            AI Article Generator
          </h1>
        </div>

        <label className="text-sm font-medium text-gray-600">
          Article Topic
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 mt-2 text-sm rounded-lg border border-gray-300 focus:border-[#4A7AFF] focus:ring-2 focus:ring-[#4A7AFF]/30 outline-none transition-all duration-200 placeholder-gray-400"
          placeholder="e.g., The future of Artificial Intelligence"
          required
        />

        {/* Article length options */}
        <p className="mt-6 text-sm font-medium text-gray-600">Article Length</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer shadow-sm ${
                selectedLength.length === item.length
                  ? "bg-gradient-to-r from-[#4A7AFF] to-[#b617f4] text-white border-transparent shadow-md scale-105"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A7AFF] to-[#b617f4] hover:from-[#3b6efb] hover:to-[#a010e8] text-white py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <SquarePen className="w-4 h-4" />
              Generate Article
            </>
          )}
        </button>
      </form>

      {/* Right: Article Preview */}
      <div className="relative overflow-y-auto z-10 w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-[#4A7AFF]/20 to-[#b617f4]/20 rounded-xl">
            <Edit className="w-5 h-5 text-[#4A7AFF]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Article Preview
          </h1>
        </div>

        <div className="min-h-[300px] overflow-y-auto prose prose-sm max-w-none text-gray-700">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            </div>
          ) : output ? (
            <div className="reset-tw prose prose-slate dark:prose-invert max-w-none">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="text-sm flex flex-col gap-4 text-gray-400 items-center text-center">
              <Edit className="w-10 h-10 opacity-70" />
              <p className="max-w-xs leading-relaxed">
                Enter a topic and click{" "}
                <span className="text-[#4A7AFF] font-semibold">
                  "Generate Article"
                </span>{" "}
                to see your AI-written masterpiece appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
