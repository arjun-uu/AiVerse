import { Sparkles, Loader2, Image } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const styles = [
    "Realistic",
    "Ghibli",
    "Anime",
    "Cartoon",
    "Fantasy",
    "3D",
    "Portrait",
  ];

  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("⚠️ Please describe your image first!");
      return;
    }

    try {
      setLoading(true);
      setImageUrl("");
      toast.loading("🎨 Generating your image...", { id: "gen" });

      const token = await getToken();

      const { data } = await axios.post(
        "/api/ai/generate-image",
        {
          prompt: `Create a ${selectedStyle} style image of: ${input}`,
          publish,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000,
        }
      );

      if (data.success) {
        setImageUrl(data.content);
        toast.success("✅ Image generated successfully!", { id: "gen" });
      } else {
        toast.error("⚠️ Failed to generate image. Try again later.", {
          id: "gen",
        });
      }
    } catch (error) {
      console.error("❌ Image generation error:", error);
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
    <div
      className="relative min-h-screen p-6 flex flex-col lg:flex-row gap-8 text-slate-700 
  bg-gradient-to-br from-[#f8faff] to-[#eef3ff] overflow-y-auto"
    >
      {/* 💫 Background Glow Effects */}
      <div className="absolute top-20 left-16 w-72 h-72 bg-[#00c2ff]/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-16 w-96 h-96 bg-[#7f00ff]/10 blur-3xl rounded-full"></div>

      {/* 🧾 Left Panel: Input Form */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full md:max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-[#00c2ff]/20 to-[#7f00ff]/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#00c2ff]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            AI Image Generator
          </h1>
        </div>

        {/* Input Field */}
        <label className="text-sm font-medium text-gray-600">
          Describe Your Image
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full p-1  text-sm rounded-lg border border-gray-300 focus:border-[#00c2ff] focus:ring-2 focus:ring-[#00c2ff]/30 outline-none transition-all duration-200 placeholder-gray-400"
          placeholder="e.g., A futuristic city at sunset in anime style"
          required
        />

        {/* Style Selector */}
        <p className="mt-1 text-sm font-medium text-gray-600">Choose Style</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {styles.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer shadow-sm ${
                selectedStyle === item
                  ? "bg-gradient-to-r from-[#00c2ff] to-[#7f00ff] text-white border-transparent shadow-md scale-105"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Publish Toggle */}
        <div className="my-2 flex items-center gap-3">
          <label
            htmlFor="publish-toggle"
            className="text-sm font-medium cursor-pointer select-none text-gray-700"
          >
            Make this Public
          </label>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="publish-toggle"
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-slate-300 rounded-full peer-focus:ring-2 peer-focus:ring-[#00c2ff]/40 transition-colors duration-300 peer-checked:bg-gradient-to-r peer-checked:from-[#00c2ff] peer-checked:to-[#7f00ff]"></div>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00c2ff] to-[#7f00ff] hover:from-[#01b4f8] hover:to-[#6b00e5] text-white py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* 🎨 Right: Output Preview */}
      <div className="relative z-10 w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-[#00c2ff]/20 to-[#7f00ff]/20 rounded-xl">
            <Image className="w-5 h-5 text-[#00c2ff]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Generated Image
          </h1>
        </div>

        <div className="flex flex-1 justify-center items-center text-center min-h-[300px]">
          {loading ? (
            <p className="text-gray-400 text-sm animate-pulse">
              Generating your image...
            </p>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated"
              className="rounded-xl shadow-lg max-h-[320px] object-cover transition-all duration-700 hover:scale-105"
            />
          ) : (
            <div className="text-sm flex flex-col gap-4 text-gray-400 items-center">
              <Image className="w-9 h-9 opacity-70" />
              <p className="max-w-xs leading-relaxed">
                Enter a description and click{" "}
                <span className="text-[#00c2ff] font-medium">
                  "Generate Image"
                </span>{" "}
                to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
