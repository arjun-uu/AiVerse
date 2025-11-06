import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItems = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  return (
    <div
      className={`p-4 max-w-3xl text-sm border border-gray-200 rounded-lg cursor-pointer 
                 transition-all duration-300 ${
                   expanded ? "bg-gray-50 shadow-md" : "bg-white hover:shadow-md"
                 }`}
      onClick={handleToggle}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2
            className={`font-medium truncate ${
              expanded ? "text-gray-900" : "text-gray-800"
            }`}
          >
            {item?.prompt || "No prompt available"}
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            {item?.type || "Unknown"} •{" "}
            {new Date(item?.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <button
          className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full text-xs font-medium"
         
        >
          {item?.type || "Unknown"}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3 border-t border-gray-200 pt-3 text-gray-700 overflow-hidden">
          {item.type === "image" ? (
            <img
              src={item?.content || item?.contentn}
              alt="Generated content"
              className="w-full max-w-md mt-3 rounded-lg shadow-sm object-contain bg-white"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className=" mt-2 text-gray-700 reset-tw">
              <Markdown>{item?.content || "No content available"}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItems;
