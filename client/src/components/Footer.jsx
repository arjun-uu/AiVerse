import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-6 w-full bg-gradient-to-b from-white via-slate-50 to-white text-gray-600 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-0 w-80 h-80 bg-[#4A7AFF]/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b617f4]/10 blur-3xl rounded-full"></div>
      </div>

      {/* Footer Content */}
      <div className="relative flex flex-col md:flex-row justify-between gap-12 border-b border-gray-300/40 pb-10">
        {/* Logo & About */}
        <div className="md:max-w-md">
          <img
            className="w-40 cursor-pointer hover:opacity-90 transition-all duration-300"
            src={assets.logo}
            alt="AiVerse Logo"
          />
          <p className="mt-6 text-sm leading-relaxed text-gray-600">
            Experience the power of{" "}
            <span className="font-semibold text-[#4A7AFF]">AiVerse</span>. <br />
            From writing articles to generating stunning images — do it all
            effortlessly with the next generation of intelligent creation tools.
          </p>
        </div>

        {/* Links & Newsletter */}
        <div className="flex-1 flex flex-col sm:flex-row md:justify-end gap-12">
          {/* Company Links */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-5 text-lg">
              Company
            </h2>
            <ul className="text-sm space-y-2">
              {["Home", "About us", "Contact us", "Privacy policy"].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-[#4A7AFF] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-5 text-lg">
              Stay Updated
            </h2>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">
              Get the latest updates, AI tips, and resources — delivered weekly.
            </p>

            <form className="flex items-center gap-2 max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-10 px-3 text-sm rounded-lg border border-gray-300/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A7AFF]/50 transition-all duration-200 bg-white/60 backdrop-blur-md"
                required
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-gradient-to-r from-[#4A7AFF] to-[#b617f4] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#4A7AFF]/30 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="relative pt-6 text-center text-xs md:text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://AiVerse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4A7AFF] font-medium hover:text-[#b617f4] transition-colors"
        >
          AiVerse
        </a>
        . All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
