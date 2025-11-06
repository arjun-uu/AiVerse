import { Sparkles, Loader2, FileText, Download } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("⚠️ Please upload your resume first!");
      return;
    }

    try {
      setLoading(true);
      setOutput("");
      toast.loading("📄 Reviewing your resume...", { id: "review" });

      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/review-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setOutput(data.content);
        toast.success("✅ Resume reviewed successfully!", { id: "review" });
      } else {
        toast.error(data.message || "❌ Failed to review resume.", {
          id: "review",
        });
      }
    } catch (error) {
      console.error("❌ Resume Review Error:", error);
      toast.error(
        error.response?.data?.message ||
          "🚫 Something went wrong. Please try again.",
        { id: "review" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full overflow-y-auto p-8 flex flex-col md:flex-row gap-8 text-slate-700 bg-gradient-to-br from-[#eef3ff] via-[#f1e8ff] to-[#edf2ff]">
      {/* ✨ Background Glow Blobs */}
      <div className="absolute top-24 left-16 w-72 h-72 bg-[#4A7AFF]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-16 right-20 w-96 h-96 bg-[#8B5CF6]/10 blur-3xl rounded-full animate-pulse"></div>

      {/* 🧾 Left Panel: Form */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full md:max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#4A7AFF]/20 to-[#8B5CF6]/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#4A7AFF]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            AI Resume Review
          </h1>
        </div>

        {/* File Upload */}
        <label className="text-sm font-medium text-gray-600">
          Upload Resume (PDF)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-3 mt-2 text-sm text-gray-700 rounded-lg border border-gray-300 focus:border-[#4A7AFF] focus:ring-2 focus:ring-[#4A7AFF]/30 outline-none transition-all duration-200 placeholder-gray-400"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-2">
          Only PDF format is supported.
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A7AFF] to-[#8B5CF6] hover:from-[#3b6efb] hover:to-[#7c3aed] text-white py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Review Resume
            </>
          )}
        </button>
      </form>

      {/* 🎯 Right Panel: Output */}
      <div className="relative z-10 w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-y-auto max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#4A7AFF]/20 to-[#8B5CF6]/20 rounded-xl">
              <FileText className="w-5 h-5 text-[#4A7AFF]" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Review Results
            </h1>
          </div>
        </div>

        {/* Output or Placeholder */}
        <div className="flex flex-1 justify-center items-center text-center min-h-[300px]">
          {loading ? (
            <p className="text-gray-400 text-sm animate-pulse">
              Analyzing your resume...
            </p>
          ) : output ? (
            <div className="reset-tw prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-sm flex flex-col gap-4 text-gray-400 items-center">
              <FileText className="w-9 h-9 opacity-70" />
              <p className="max-w-xs leading-relaxed">
                Upload your resume and click{" "}
                <span className="text-[#4A7AFF] font-medium">
                  “Review Resume”
                </span>{" "}
                to get detailed feedback and improvement tips powered by AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
