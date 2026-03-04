"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface ArchItem {
  name: string;
  desc: string;
}

interface ArchLayer {
  label: string;
  sublabel: string;
  color: string;
  items: ArchItem[];
}

const layers: ArchLayer[] = [
  {
    label: "Edge Devices",
    sublabel: "Robots of all form factors stream telemetry, episodes, and events to the cloud in real time",
    color: "#F97316",
    items: [],
  },
  {
    label: "Data Gateway",
    sublabel: "The entry point that receives, standardizes, and routes all incoming robot data",
    color: "#3B82F6",
    items: [
      { name: "Message Transport", desc: "Receives high-frequency sensor and telemetry streams from edge devices with low latency" },
      { name: "Format Normalization", desc: "Translates manufacturer-specific schemas into a unified cross-fleet data format" },
      { name: "Real-time Filtering", desc: "Deduplicates, validates, and flags anomalous data before it reaches storage" },
    ],
  },
  {
    label: "Data Lake",
    sublabel: "The durable, queryable repository for every piece of data the fleet produces",
    color: "#8B5CF6",
    items: [
      { name: "Time-Series Telemetry", desc: "Stores joint angles, sensor readings, and system metrics at millisecond resolution" },
      { name: "Episode Archives", desc: "Preserves full task demonstrations as replayable, labeled sequences for training" },
      { name: "Safety Audit Trail", desc: "Maintains an immutable ledger of every robot action for compliance and forensics" },
    ],
  },
  {
    label: "Intelligence Engine",
    sublabel: "Learns from aggregated fleet data to improve every robot's behavior over time",
    color: "#14B8A6",
    items: [
      { name: "Cross-Fleet Learning", desc: "Trains shared policies across robots without centralizing private data" },
      { name: "Skill Transfer", desc: "Converts human demonstrations into deployable manipulation and navigation skills" },
      { name: "Anomaly & Drift Detection", desc: "Identifies unsafe behaviors, mechanical degradation, and sensor drift in real time" },
    ],
  },
  {
    label: "Interface Layer",
    sublabel: "How operators, auditors, developers, and robots themselves interact with the platform",
    color: "#EC4899",
    items: [
      { name: "API Access", desc: "Programmatic endpoints for querying fleet data, models, and safety reports" },
      { name: "Monitoring Dashboard", desc: "Visual control room for fleet tracking, safety maps, and learning progress" },
      { name: "On-Device SDK", desc: "Lightweight client that robots use to push data and pull updated policies" },
    ],
  },
];

function DataFlowLine({ fromColor, toColor, index }: { fromColor: string; toColor: string; index: number }) {
  return (
    <div className="flex justify-center h-8 relative overflow-hidden">
      <div className="relative w-px h-full">
        <div
          className="absolute inset-0 w-px"
          style={{
            background: `linear-gradient(to bottom, ${fromColor}40, ${toColor}40)`,
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
            boxShadow: `0 0 6px ${toColor}80`,
            animation: `flowDown 1.5s ease-in-out ${index * 0.3}s infinite`,
          }}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-40">
          <path d="M6 0 L6 12 M3 8 L6 12 L9 8" stroke={toColor} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default function ArchitectureDiagram() {
  const { t } = useTheme();
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div
        className={`rounded-xl border overflow-hidden shadow-2xl backdrop-blur-sm ${t(
          "border-slate-700/50 bg-slate-900/80",
          "border-stone-200 bg-white/90"
        )}`}
      >
        {/* Terminal title bar */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-b ${t(
            "border-slate-700/50 bg-slate-800/50",
            "border-stone-200 bg-stone-50"
          )}`}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className={`text-xs ml-2 font-mono ${t("text-slate-500", "text-stone-500")}`}>
              RoboNex Architecture
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              5 LAYERS
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Flow pipeline breadcrumb */}
          <div className="flex items-center justify-center gap-1 mb-6 flex-wrap">
            {layers.map((layer, i) => (
              <div key={layer.label} className="flex items-center gap-1">
                <button
                  onClick={() => layer.items.length > 0 ? setActiveLayer(activeLayer === i ? null : i) : null}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all duration-200 border ${
                    activeLayer === i
                      ? "scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    borderColor: activeLayer === i ? `${layer.color}60` : "transparent",
                    backgroundColor: activeLayer === i ? `${layer.color}15` : "transparent",
                    color: layer.color,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: layer.color, boxShadow: activeLayer === i ? `0 0 8px ${layer.color}60` : "none" }}
                  />
                  {layer.label}
                </button>
                {i < layers.length - 1 && (
                  <svg width="16" height="10" viewBox="0 0 16 10" className={`shrink-0 ${t("text-slate-600", "text-stone-300")}`}>
                    <path d="M2 5 L14 5 M10 1 L14 5 L10 9" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Layers stack */}
          <div className="space-y-0">
            {layers.map((layer, i) => {
              const isActive = activeLayer === null || activeLayer === i;
              const isHighlighted = activeLayer === i;
              const hasItems = layer.items.length > 0;
              return (
                <div key={layer.label}>
                  {i > 0 && <DataFlowLine fromColor={layers[i - 1].color} toColor={layer.color} index={i} />}

                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    onClick={() => hasItems && setActiveLayer(activeLayer === i ? null : i)}
                    className={`rounded-lg border transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-30"
                    } ${isHighlighted ? "scale-[1.01]" : ""} ${hasItems ? "cursor-pointer" : ""}`}
                    style={{
                      borderColor: isHighlighted ? `${layer.color}50` : `${layer.color}20`,
                      backgroundColor: isHighlighted ? `${layer.color}08` : "transparent",
                      boxShadow: isHighlighted ? `0 0 30px ${layer.color}10, inset 0 0 30px ${layer.color}05` : "none",
                    }}
                  >
                    {hasItems ? (
                      <div className="flex items-stretch">
                        {/* Left: layer label */}
                        <div
                          className="w-40 shrink-0 flex flex-col items-center justify-center py-4 px-3 border-r"
                          style={{
                            borderColor: `${layer.color}20`,
                            background: `linear-gradient(135deg, ${layer.color}10, transparent)`,
                          }}
                        >
                          <div
                            className="w-3 h-3 rounded-full mb-2.5"
                            style={{ backgroundColor: layer.color, boxShadow: `0 0 10px ${layer.color}40` }}
                          />
                          <h4
                            className="text-xs font-bold font-mono uppercase tracking-wider text-center"
                            style={{ color: layer.color }}
                          >
                            {layer.label}
                          </h4>
                          <p className={`text-[9px] text-center mt-1.5 leading-tight px-1 ${t("text-slate-500", "text-stone-500")}`}>
                            {layer.sublabel}
                          </p>
                        </div>

                        {/* Right: functional components */}
                        <div className="flex-1 grid grid-cols-3 divide-x" style={{ borderColor: `${layer.color}12` }}>
                          {layer.items.map((item, j) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 + j * 0.06, duration: 0.4 }}
                              className={`p-3.5 group transition-colors ${t(
                                "hover:bg-slate-800/30",
                                "hover:bg-stone-100/60"
                              )}`}
                              style={{ borderColor: `${layer.color}10` }}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: layer.color }}
                                />
                                <h5
                                  className="text-xs font-semibold"
                                  style={{ color: `${layer.color}DD` }}
                                >
                                  {item.name}
                                </h5>
                              </div>
                              <p className={`text-[10px] leading-relaxed transition-colors ${t(
                                "text-slate-400 group-hover:text-slate-300",
                                "text-stone-500 group-hover:text-stone-700"
                              )}`}>
                                {item.desc}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-4 py-4 px-5"
                        style={{ background: `linear-gradient(135deg, ${layer.color}10, transparent)` }}
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: layer.color, boxShadow: `0 0 10px ${layer.color}40` }}
                        />
                        <div>
                          <h4
                            className="text-xs font-bold font-mono uppercase tracking-wider"
                            style={{ color: layer.color }}
                          >
                            {layer.label}
                          </h4>
                          <p className={`text-[10px] mt-1 leading-relaxed ${t("text-slate-400", "text-stone-500")}`}>
                            {layer.sublabel}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Expanded detail panel */}
          <AnimatePresence>
            {activeLayer !== null && layers[activeLayer].items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 rounded-lg border p-4"
                  style={{
                    borderColor: `${layers[activeLayer].color}30`,
                    backgroundColor: `${layers[activeLayer].color}08`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: layers[activeLayer].color }}
                    />
                    <h4 className="text-xs font-mono uppercase tracking-wider" style={{ color: layers[activeLayer].color }}>
                      {layers[activeLayer].label} — Details
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {layers[activeLayer].items.map((item) => (
                      <div
                        key={item.name}
                        className={`rounded-md border p-3 ${t(
                          "bg-slate-800/40 border-slate-700/30",
                          "bg-white/60 border-stone-200"
                        )}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: layers[activeLayer].color }}
                          />
                          <span className={`text-sm font-semibold ${t("text-slate-200", "text-stone-800")}`}>
                            {item.name}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${t("text-slate-400", "text-stone-500")}`}>
                          {item.desc}
                        </p>
                        <div className="mt-2 flex items-center gap-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: layers[activeLayer].color }}
                          />
                          <span className="text-[9px] font-mono" style={{ color: layers[activeLayer].color }}>Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom flow summary */}
          <div className={`mt-5 pt-4 border-t ${t("border-slate-700/30", "border-stone-200")}`}>
            <p className={`text-center text-[10px] font-mono ${t("text-slate-500", "text-stone-500")}`}>
              DATA FLOW: Edge Devices → Data Gateway → Data Lake → Intelligence Engine → Interface Layer
            </p>
            <p className={`text-center text-[10px] mt-1 ${t("text-slate-600", "text-stone-400")}`}>
              Click any layer to inspect its components in detail
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
