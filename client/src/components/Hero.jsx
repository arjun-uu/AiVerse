import React from "react";
import { ArrowRight, VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { assets } from "../assets/assets";
import TrustedBy from "./TrustedBy";

const Hero = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth(); // check if user is logged in

  const handleStartCreating = () => {
    if (isSignedIn) {
      // ✅ If logged in → go to /ai
      navigate("/ai");
    } else {
      // ❌ If not logged in → open Clerk login modal
      document.getElementById("sign-in-trigger")?.click();
    }
  };

  return (
    <div
      className="text-center py-24 px-6 min-h-screen bg-cover bg-no-repeat bg-center flex flex-col justify-center"
      style={{ backgroundImage: `url(${assets.gradientBackground})` }}
    >
      <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
        Create amazing content <br />
        with <span className="text-primary">AI tools</span>
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
        Transform your content creation with our suite of premium AI tools.
        Write articles, generate images, and enhance your workflow.
      </p>

      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {/* ✅ Start Creating Button */}
        <button
          onClick={handleStartCreating}
          className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all"
        >
          Start creating now <ArrowRight size={18} />
        </button>

        <button className="border border-gray-300 hover:border-primary hover:text-primary px-10 py-3 rounded-full font-medium flex items-center gap-2 transition-all">
          Watch demo <VideoIcon size={18} />
        </button>
      </div>

      {/* ✅ Hidden Sign-in Button (used for modal trigger) */}
      <SignInButton mode="modal">
        <button id="sign-in-trigger" className="hidden"></button>
      </SignInButton>

      {/* ✅ Trusted Section */}
      <div className="flex justify-center items-center flex-wrap gap-5">
        <img src={assets.user_group} alt="Brand 2" className="h-10" />
        <p className="text-gray-700 text-sm">Trusted by 10k+ people</p>
      </div>

      <TrustedBy />
    </div>
  );
};

export default Hero;
