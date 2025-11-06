import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  LogOut,
  House,
  SquarePen,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
  Users,
} from "lucide-react";

const navitems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-bg", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const SideBar = ({ sideBar, setSideBar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`w-60 bg-white border-r border-gray-200 flex flex-col items-center justify-between overflow-y-auto
          sm:static sm:translate-x-0 sm:h-full
          fixed top-14 left-0 h-[calc(100vh-56px)] z-50
          transition-transform duration-300 ease-in-out
          ${sideBar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* 👤 User section */}
        <div className="my-7 w-full">
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt="User avatar"
              className="w-12 h-12 rounded-full mx-auto object-cover"
            />
          )}
          <h1 className="mt-2 text-center font-medium text-gray-700">
            {user?.fullName || "Guest User"}
          </h1>
        </div>

        {/* 📋 Navigation items */}
        <div className="flex flex-col gap-1 w-full px-4 mb-auto">
          {navitems.map(({ to, label, Icon }) => {
            const isActive = location.pathname === to;
            return (
              <button
                key={to}
                onClick={() => {
                  navigate(to);
                  setSideBar(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>

        {user && (
          <div className="w-full border-t border-gray-200 p-3 flex items-center justify-around">
            <div
              onClick={openUserProfile}
              className="flex gap-2 items-center cursor-pointer"
            >
              <img src={user.imageUrl} className="w-8 rounded-full" alt="" />
              <div>
                <h1 className="text-sm font-medium">{user.fullName}</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1 flex-wrap">
                  <Protect plan="premium" fallback="Free">
                    Premium
                  </Protect>
                </p>
              </div>
            </div>

            <LogOut
              onClick={signOut}
              size={20}
              strokeWidth={2}
              className="text-black hover:text-red-500 transition cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      <div
        onClick={() => setSideBar(false)}
        className={`fixed inset-0 bg-black/40 z-40 sm:hidden transition-opacity duration-300 ${
          sideBar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  );
};

export default SideBar;
