import React from "react";
import {
  SquarePen,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const tools = [
  {
    name: "AI Article Writer",
    desc: "Generate high-quality, engaging articles on any topic with our AI writing technology.",
    icon: <SquarePen size={26} />,
    color: "from-[#4A7AFF] to-[#5AC8FA]",
    path: "/ai/write-article",
  },
  {
    name: "Blog Title Generator",
    desc: "Find catchy and SEO-friendly titles for your blogs with AI magic.",
    icon: <Hash size={26} />,
    color: "from-[#b617f4] to-[#ff6ec7]",
    path: "/ai/blog-titles",
  },
  {
    name: "AI Image Generation",
    desc: "Transform your ideas into stunning visuals instantly with AI.",
    icon: <Image size={26} />,
    color: "from-green-500 to-emerald-400",
    path: "/ai/generate-images",
  },
  {
    name: "Background Removal",
    desc: "Remove image backgrounds in seconds with our smart AI tool.",
    icon: <Eraser size={26} />,
    color: "from-orange-500 to-amber-400",
    path: "/ai/remove-bg",
  },
  {
    name: "Object Removal",
    desc: "Effortlessly erase unwanted objects and enhance your images.",
    icon: <Scissors size={26} />,
    color: "from-sky-500 to-blue-500",
    path: "/ai/remove-object",
  },
  {
    name: "Resume Review",
    desc: "Let AI analyze and enhance your resume for better job chances.",
    icon: <FileText size={26} />,
    color: "from-teal-500 to-cyan-400",
    path: "/ai/review-resume",
  },
];

const AiTools = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-20 xl:px-32 py-20 text-center bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Subtle background orbs for style */}
      <div className="absolute top-20 left-0 w-60 h-60 bg-[#4A7AFF]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-[#b617f4]/10 blur-3xl rounded-full animate-pulse"></div>

      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
        Explore{" "}
        <span className="bg-gradient-to-r from-[#4A7AFF] to-[#b617f4] bg-clip-text text-transparent">
          AI Tools
        </span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
        Supercharge your creativity and productivity with{" "}
        <span className="font-semibold text-[#4A7AFF]">AiVerse</span>’s smart
        AI tools designed for modern creators.
      </p>

      {/* Tools Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <div
            key={index}
            onClick={() => navigate(tool.path)}
            className="relative group bg-white/70 backdrop-blur-lg rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2"
          >
           

            <div className="relative z-10">
              <div
                className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center bg-gradient-to-br ${tool.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110 mx-auto`}
              >
                {tool.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#4A7AFF] transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AiTools;
