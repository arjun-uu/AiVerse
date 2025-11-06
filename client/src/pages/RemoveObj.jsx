import { Eraser, Sparkles, Loader2, Scissors } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObj = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("⚠️ Please upload an image first!");
      return;
    }
    if (!object.trim()) {
      toast.error("⚠️ Please describe the object to remove!");
      return;
    }

    try {
      setLoading(true);
      setOutput("");
      toast.loading("✂️ Removing object...", { id: "removeObj" });

      const token = await getToken();

      const formData = new FormData();
      formData.append("image", input); // must match backend field name
      formData.append("object", object);

      const { data } = await axios.post("/api/ai/remove-object", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      if (data.success) {
        setOutput(data.content);
        toast.success("✅ Object removed successfully!", { id: "removeObj" });
      } else {
        toast.error("⚠️ Failed to remove object. Try again later.", {
          id: "removeObj",
        });
      }
    } catch (error) {
      console.error("❌ Object removal error:", error);
      toast.error(
        error.response?.data?.message ||
          "🚫 Something went wrong. Please try again.",
        { id: "removeObj" }
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
      {/* ✨ Background Glow Effects */}
      <div className="absolute top-20 left-12 w-80 h-80 bg-[#b617f4]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-16 right-20 w-96 h-96 bg-[#4A7AFF]/10 blur-3xl rounded-full animate-pulse"></div>

      {/* 🧾 Left Panel */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full md:max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-[#b617f4]/20 to-[#4A7AFF]/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#b617f4]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            AI Object Removal
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
          className="w-full p-3 mt-2 text-sm text-gray-700 rounded-lg border border-gray-300 focus:border-[#b617f4] focus:ring-2 focus:ring-[#b617f4]/30 outline-none transition-all duration-200"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-2">
          Supports JPG, PNG, and other image formats.
        </p>

        {/* Object Description */}
        <p className="mt-3 text-sm font-medium text-gray-600">
          Describe the object to remove
        </p>
        <textarea
          value={object}
          onChange={(e) => setObject(e.target.value)}
          rows={4}
          className="w-full p-3 mt-2 text-sm text-gray-700 rounded-lg border border-gray-300 focus:border-[#b617f4] focus:ring-2 focus:ring-[#b617f4]/30 outline-none transition-all duration-200 placeholder-gray-400"
          placeholder="e.g., Remove the chair in the background"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#b617f4] to-[#4A7AFF] hover:from-[#a010e8] hover:to-[#3b6efb] text-white py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Scissors className="w-4 h-4" />
              Remove Object
            </>
          )}
        </button>
      </form>

      {/* 🎨 Right Output Panel */}
      <div className="relative z-10 w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-[#b617f4]/20 to-[#4A7AFF]/20 rounded-xl">
            <Scissors className="w-5 h-5 text-[#b617f4]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Processed Image
          </h1>
        </div>

        {/* Output */}
        <div className="flex flex-1 justify-center items-center text-center min-h-[300px]">
          {loading ? (
            <p className="text-gray-400 text-sm animate-pulse">
              Removing object...
            </p>
          ) : output ? (
            <img
              src={output}
              alt="Processed"
              className="rounded-xl max-h-[320px] w-auto object-contain transition-all duration-700 hover:scale-[1.02]"
            />
          ) : (
            <div className="text-sm flex flex-col gap-4 text-gray-400 items-center">
              <Scissors className="w-9 h-9 opacity-70" />
              <p className="max-w-xs leading-relaxed">
                Upload an image and click{" "}
                <span className="text-[#b617f4] font-medium">
                  “Remove Object”
                </span>{" "}
                to see your clean image result here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObj;
