"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const features = [
  {
    title: "Real-Time Tracking",
    description:
      "Monitor every joint, sensor, and actuator across your entire fleet. Per-second telemetry with anomaly detection and safety alerts.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="20" fill="#3B82F6" opacity="0.15" />
        <circle cx="24" cy="24" r="4" fill="#60A5FA" />
        <circle cx="24" cy="24" r="10" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="24" cy="24" r="16" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
        <line x1="24" y1="24" x2="34" y2="18" stroke="#60A5FA" strokeWidth="2" />
      </svg>
    ),
    darkColor: "from-blue-500/10 to-blue-600/5",
    lightColor: "from-blue-50 to-blue-100/40",
    darkBorder: "border-blue-500/20",
    lightBorder: "border-blue-200/60",
    darkTag: "text-blue-400",
    lightTag: "text-blue-600",
    tag: "Tracking",
  },
  {
    title: "Collective Learning",
    description:
      "Break data silos. Federated learning and behavior cloning across your fleet. A robot in NYC learns from London's experience.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="20" fill="#8B5CF6" opacity="0.15" />
        <circle cx="14" cy="20" r="5" fill="#A78BFA" opacity="0.6" />
        <circle cx="34" cy="20" r="5" fill="#A78BFA" opacity="0.6" />
        <circle cx="24" cy="34" r="5" fill="#A78BFA" opacity="0.6" />
        <line x1="14" y1="20" x2="34" y2="20" stroke="#A78BFA" strokeWidth="1.5" />
        <line x1="14" y1="20" x2="24" y2="34" stroke="#A78BFA" strokeWidth="1.5" />
        <line x1="34" y1="20" x2="24" y2="34" stroke="#A78BFA" strokeWidth="1.5" />
      </svg>
    ),
    darkColor: "from-purple-500/10 to-purple-600/5",
    lightColor: "from-purple-50 to-purple-100/40",
    darkBorder: "border-purple-500/20",
    lightBorder: "border-purple-200/60",
    darkTag: "text-purple-400",
    lightTag: "text-purple-600",
    tag: "Learning",
  },
  {
    title: "Safety & Audit",
    description:
      'The "Black Box" for robots. Every action logged, every decision traceable. Built for compliance, insurance, and trust.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="20" fill="#14B8A6" opacity="0.15" />
        <rect x="14" y="16" width="20" height="18" rx="2" fill="none" stroke="#2DD4BF" strokeWidth="1.5" />
        <line x1="14" y1="22" x2="34" y2="22" stroke="#2DD4BF" strokeWidth="1.5" />
        <circle cx="24" cy="28" r="3" fill="#2DD4BF" opacity="0.6" />
        <line x1="24" y1="28" x2="24" y2="32" stroke="#2DD4BF" strokeWidth="1.5" />
      </svg>
    ),
    darkColor: "from-teal-500/10 to-teal-600/5",
    lightColor: "from-teal-50 to-teal-100/40",
    darkBorder: "border-teal-500/20",
    lightBorder: "border-teal-200/60",
    darkTag: "text-teal-400",
    lightTag: "text-teal-600",
    tag: "Safety",
  },
];

export default function FeatureCards() {
  const { t } = useTheme();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          className={`relative rounded-xl border bg-gradient-to-b p-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 ${t(
            `${feature.darkBorder} ${feature.darkColor}`,
            `${feature.lightBorder} ${feature.lightColor}`,
          )}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {feature.icon}
            <span className={`text-xs font-mono uppercase tracking-wider ${t(feature.darkTag, feature.lightTag)}`}>
              {feature.tag}
            </span>
          </div>
          <h3 className={`text-lg font-semibold mb-2 transition-colors ${t("text-slate-100", "text-slate-800")}`}>
            {feature.title}
          </h3>
          <p className={`text-sm leading-relaxed transition-colors ${t("text-slate-400", "text-slate-500")}`}>
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
