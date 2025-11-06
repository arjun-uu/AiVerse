import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { Gem, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/clerk-react"; // ✅ Import useAuth
import CreationItems from "../components/CreationItems";

const Dashboard = () => {
  const [creation, setCreation] = useState([]);
  const { getToken, userId } = useAuth(); // ✅ Get token + user ID

  const getDashBoardData = async () => {
    setCreation(dummyCreationData);
  };

  useEffect(() => {
    // ✅ Fetch token after user is authenticated
    const fetchToken = async () => {
      const token = await getToken({ template: "integration_fallback" }); // fallback ensures token in dev mode
      if (token) {
        console.log("🪪 Clerk JWT Token:", token);
      } else {
        console.warn("⚠️ No token available (user not authenticated yet).");
      }
    };

    fetchToken();
    getDashBoardData();
  }, [getToken]);

  return (
    <div className="relative h-full overflow-y-auto p-8 bg-gradient-to-br from-[#f3f0ff] via-[#f7f9ff] to-[#eef2ff]">
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#b617f4]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-24 right-10 w-96 h-96 bg-[#4A7AFF]/10 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome Back, <span className="text-[#4A7AFF]">Creator ✨</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your user ID: <span className="text-gray-700 font-mono">{userId}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          {/* Total Creations */}
          <div className="flex items-center justify-between w-72 p-5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div>
              <p className="text-sm text-gray-500">Total Creations</p>
              <h2 className="text-2xl font-semibold text-gray-800">
                {creation.length}
              </h2>
            </div>
            <div className="bg-gradient-to-tr from-indigo-500 to-blue-400 p-3 rounded-xl shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Active Plan */}
          <div className="flex items-center justify-between w-72 p-5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div>
              <p className="text-sm text-gray-500">Active Plan</p>
              <h2 className="text-2xl font-semibold text-gray-800">Free</h2>
            </div>
            <div className="bg-gradient-to-tr from-purple-500 to-pink-400 p-3 rounded-xl shadow-sm">
              <Gem className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Recent Creations
          </h2>
          {creation.length > 0 ? (
            <div className="space-y-4">
              {creation.map((item) => (
                <CreationItems key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm text-center text-gray-500 text-sm">
              No creations yet. Start creating something amazing!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
