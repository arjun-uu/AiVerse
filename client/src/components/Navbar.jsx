import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn, openUserProfile } = useClerk();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-10 md:px-16 py-3">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            src={assets.logo}
            alt="AiVerse Logo"
            className="w-28 sm:w-36 md:w-44 object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <div
              onClick={openUserProfile}
              className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-gray-200/60 hover:border-[#4A7AFF]/50 hover:shadow-md rounded-full px-3 py-1.5 cursor-pointer transition-all duration-300"
            >
              <img
                src={user.imageUrl}
                alt="User avatar"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-300"
              />
              <span className="text-sm sm:text-base font-medium text-gray-800">
                {user.fullName || "User"}
              </span>
            </div>
          ) : (
            <>
            <style>{`
                .button-wrapper::before {
                    animation: spin-gradient 4s linear infinite;
                }
            
                @keyframes spin-gradient {
                    from {
                        transform: rotate(0deg);
                    }
              ` `1`
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
            <div className="relative inline-block p-0.5 rounded-full overflow-hidden hover:scale-105 transition duration-300 active:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,_#00F5FF,_#00F5FF30,_#00F5FF)] button-wrapper">
                <button onClick={openSignIn} className="relative z-10 bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-sm">Click Me</button>
            </div>
        </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
