import { Eraser, Sparkles, Loader2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBg = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("⚠️ Please upload an image first!");
      return;
    }

    try {
      setLoading(true);
      setOutput("");
      toast.loading("🧠 Removing background...", { id: "remove-bg" });

      const token = await getToken();

      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post("/api/ai/remove-bg", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      if (data.success) {
        setOutput(data.content);
        toast.success("✅ Background removed successfully!", {
          id: "remove-bg",
        });
      } else {
        toast.error("⚠️ Failed to remove background. Try again later.", {
          id: "remove-bg",
        });
      }
    } catch (error) {
      console.error("❌ Background removal error:", error);
      toast.error(
        error.response?.data?.message ||
          "🚫 Something went wrong. Please try again.",
        { id: "remove-bg" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full overflow-y-auto p-8 flex flex-col md:flex-row gap-8 text-slate-700 bg-gradient-to-br from-[#e0fff6] via-[#f0faff] to-[#e7f7ff]">
      {/* 🌈 Background Glow Orbs */}
      <div className="absolute top-20 left-16 w-80 h-80 bg-[#00d4a4]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-16 w-96 h-96 bg-[#009dff]/10 blur-3xl rounded-full animate-pulse"></div>

      {/* 🧾 Left Panel */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full md:max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#00d4a4]/20 to-[#009dff]/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#00d4a4]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            AI Background Remover
          </h1>
        </div>

        {/* File Input */}
        <label className="text-sm font-medium text-gray-600">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-3 mt-2 text-sm text-gray-700 rounded-lg border border-gray-300 focus:border-[#00d4a4] focus:ring-2 focus:ring-[#00d4a4]/30 outline-none transition-all duration-200 placeholder-gray-400"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-2">
          Supports JPG, PNG, and other image formats.
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00d4a4] to-[#009dff] hover:from-[#00b693] hover:to-[#007ae5] text-white py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              Remove Background
            </>
          )}
        </button>
      </form>

      {/* 🎨 Right Panel */}
      <div className="relative z-10 w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-[#00d4a4]/20 to-[#009dff]/20 rounded-xl">
            <Eraser className="w-5 h-5 text-[#00d4a4]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Processed Image
          </h1>
        </div>

        {/* Output */}
        <div className="flex flex-1 justify-center items-center text-center min-h-[300px]">
          {loading ? (
            <p className="text-gray-400 text-sm animate-pulse">
              Removing background...
            </p>
          ) : output ? (
            <img
              src={output}
              alt="Processed"
              className="rounded-xl shadow-lg max-h-[320px] w-auto object-contain transition-all duration-700 hover:scale-[1.02]"
            />
          ) : (
            <div className="text-sm flex flex-col gap-4 text-gray-400 items-center">
              <Eraser className="w-9 h-9 opacity-70" />
              <p className="max-w-xs leading-relaxed">
                Upload an image and click{" "}
                <span className="text-[#00d4a4] font-medium">
                  “Remove Background”
                </span>{" "}
                to see your transparent image here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBg;
