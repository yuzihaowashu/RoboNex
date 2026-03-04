"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { theme, toggle, t } = useTheme();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${t(
        "bg-[#0F172A]/80 border-slate-800/50",
        "bg-[#FEFAF3]/85 border-stone-200/60",
      )}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="#3B82F6" opacity="0.2" />
            <circle cx="16" cy="16" r="10" fill="#3B82F6" opacity="0.3" />
            <circle cx="16" cy="16" r="5" fill="#60A5FA" />
            <path
              d="M8 20 Q16 8 24 20"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="1.5"
            />
          </svg>
          <span className={`text-lg font-bold tracking-tight transition-colors ${t("text-slate-100", "text-slate-800")}`}>
            RoboNex
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-6 text-sm transition-colors ${t("text-slate-400", "text-slate-500")}`}>
          <a href="#features" className={`transition-colors ${t("hover:text-slate-200", "hover:text-slate-800")}`}>
            Features
          </a>
          <a href="#architecture" className={`transition-colors ${t("hover:text-slate-200", "hover:text-slate-800")}`}>
            Architecture
          </a>
          <a href="#dashboard" className={`transition-colors ${t("hover:text-slate-200", "hover:text-slate-800")}`}>
            Dashboard
          </a>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${t(
              "bg-slate-800 hover:bg-slate-700 text-amber-400",
              "bg-stone-100 hover:bg-stone-200 text-slate-600",
            )}`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <a
            href="https://github.com/robonex"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
