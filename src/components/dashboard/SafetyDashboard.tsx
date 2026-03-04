"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { safetyCities, type SafetyCity, type SafetyRobot } from "@/lib/mockData";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const GEO_URL = `${BASE}/countries-110m.json`;

function statusColor(status: SafetyRobot["status"]) {
  if (status === "safe") return "#22C55E";
  if (status === "warning") return "#F59E0B";
  return "#EF4444";
}

function statusCounts(robots: SafetyRobot[]) {
  let safe = 0, warning = 0, danger = 0;
  for (const r of robots) {
    if (r.status === "safe") safe++;
    else if (r.status === "warning") warning++;
    else danger++;
  }
  return { safe, warning, danger };
}

function cityOverallColor(robots: SafetyRobot[]): string {
  const { danger, warning } = statusCounts(robots);
  if (danger > 5) return "#EF4444";
  if (warning > 10 || danger > 0) return "#F59E0B";
  return "#22C55E";
}

// --- Pseudo Cursor SVG ---

function PseudoCursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <div
      className="absolute z-[100] pointer-events-none"
      style={{
        left: x,
        top: y,
        transition: "left 0.8s cubic-bezier(0.4,0,0.2,1), top 0.8s cubic-bezier(0.4,0,0.2,1)",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
        transform: clicking ? "scale(0.85)" : "scale(1)",
      }}
    >
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
        <path
          d="M2 1L2 19.5L7.5 14.5L12.5 24L16 22.5L11 13L18 13L2 1Z"
          fill="white"
          stroke="#0F172A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {clicking && (
        <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-2 border-blue-400 animate-ping" />
      )}
    </div>
  );
}

// --- World Map View (react-simple-maps) ---

function WorldMapView({ onSelectCity }: { onSelectCity: (city: SafetyCity) => void }) {
  return (
    <div className="relative">
      {/* Global stats bar */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {(() => {
          const allRobots = safetyCities.flatMap((c) => c.robots);
          const { safe, warning, danger } = statusCounts(allRobots);
          return [
            { label: "Total Robots", value: allRobots.length.toLocaleString(), color: "text-blue-400" },
            { label: "Safe", value: safe.toLocaleString(), color: "text-emerald-400" },
            { label: "Warning", value: warning.toLocaleString(), color: "text-amber-400" },
            { label: "Danger", value: danger.toLocaleString(), color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center">
              <div className={`text-sm font-semibold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-slate-500">{s.label}</div>
            </div>
          ));
        })()}
      </div>

      {/* Real world map */}
      <div className="rounded-lg bg-[#0B1120] border border-slate-700/20 overflow-hidden">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [20, 20] }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#334155", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {safetyCities.map((city) => {
            const color = cityOverallColor(city.robots);
            const counts = statusCounts(city.robots);
            return (
              <Marker
                key={city.id}
                coordinates={[city.lng, city.lat]}
                onClick={() => onSelectCity(city)}
                style={{ default: { cursor: "pointer" }, hover: { cursor: "pointer" }, pressed: { cursor: "pointer" } }}
              >
                <g data-city-id={city.id}>
                  <circle r={12} fill="none" stroke={color} strokeWidth={1} opacity={0.3}>
                    <animate attributeName="r" from="12" to="24" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r={7} fill={color} opacity={0.9} />
                  <circle r={3} fill="white" opacity={0.85} />
                  <text
                    y={-14}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#CBD5E1"
                    fontWeight={600}
                    fontFamily="var(--font-geist-sans), sans-serif"
                  >
                    {city.name}
                  </text>
                  <g transform="translate(12, -6)">
                    <rect width={28} height={14} rx={3} fill="#0F172A" stroke={color} strokeWidth={0.8} opacity={0.95} />
                    <text x={14} y={10} textAnchor="middle" fontSize={8} fill={color} fontFamily="var(--font-geist-mono), monospace" fontWeight={600}>
                      {city.robots.length}
                    </text>
                  </g>
                  {counts.danger > 0 && (
                    <g transform="translate(12, 10)">
                      <rect width={22} height={12} rx={2} fill="#EF4444" opacity={0.15} stroke="#EF4444" strokeWidth={0.5} />
                      <text x={11} y={9} textAnchor="middle" fontSize={7} fill="#EF4444" fontFamily="var(--font-geist-mono), monospace">
                        {counts.danger}!
                      </text>
                    </g>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 py-2 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-500">Safe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] text-slate-500">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[10px] text-slate-500">Danger</span>
          </div>
          <span className="text-[10px] text-slate-600 ml-4">Click a city to inspect</span>
        </div>
      </div>
    </div>
  );
}

// --- Robot Detail Panel ---

function SafetyScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#1E293B" strokeWidth="4" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-sm font-bold font-mono" style={{ color }}>{score}</span>
    </div>
  );
}

function RobotDetailPanel({ robot, onClose }: { robot: SafetyRobot; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="space-y-3 overflow-y-auto max-h-[720px] pr-1"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Robot Detail</h4>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-800/50">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex items-start gap-3">
        <img src={robot.image} alt={robot.name} className="w-16 h-16 rounded-lg object-cover bg-slate-700/50 border border-slate-700/30" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200">{robot.name}</h4>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: statusColor(robot.status) }} />
              <span className="text-xs text-slate-400 capitalize">{robot.status}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">{robot.manufacturer}</p>
          <p className="text-xs text-slate-500 mt-0.5">{robot.model} &middot; {robot.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Battery", value: `${robot.battery}%`, color: robot.battery > 50 ? "text-emerald-400" : robot.battery > 20 ? "text-amber-400" : "text-red-400" },
          { label: "Uptime", value: robot.uptime, color: "text-blue-400" },
          { label: "Task", value: robot.task, color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="p-2 rounded-md bg-slate-800/50 text-center">
            <div className={`text-xs font-semibold truncate ${stat.color}`}>{stat.value}</div>
            <div className="text-[9px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h5 className="text-xs font-semibold text-slate-400 mb-2">Safety Score</h5>
        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30">
          <SafetyScoreRing score={robot.safetyScore} />
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Firmware</span>
              <span className="text-slate-300 font-mono">{robot.firmware}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Last Safety Check</span>
              <span className="text-slate-300 font-mono">{robot.lastSafetyCheck}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Compliance</span>
              <span className={`font-mono font-semibold ${robot.safetyScore >= 80 ? "text-emerald-400" : robot.safetyScore >= 50 ? "text-amber-400" : "text-red-400"}`}>
                {robot.safetyScore >= 80 ? "PASS" : robot.safetyScore >= 50 ? "REVIEW" : "FAIL"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-slate-400 mb-2">Battery</h5>
        <div className="p-2 rounded-lg bg-slate-800/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Charge Level</span>
            <span className={`font-mono font-semibold ${robot.battery > 50 ? "text-emerald-400" : robot.battery > 20 ? "text-amber-400" : "text-red-400"}`}>
              {robot.battery}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${robot.battery}%`,
                backgroundColor: robot.battery > 50 ? "#22C55E" : robot.battery > 20 ? "#F59E0B" : "#EF4444",
              }}
            />
          </div>
        </div>
      </div>

      {robot.lastIncident && (
        <div>
          <h5 className="text-xs font-semibold text-slate-400 mb-2">Active Incident</h5>
          <div className={`p-3 rounded-lg border text-xs ${
            robot.status === "danger"
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {robot.lastIncident}
            </div>
          </div>
        </div>
      )}

      {/* Action History */}
      <div>
        <h5 className="text-xs font-semibold text-slate-400 mb-2">Action History</h5>
        <div className="rounded-lg bg-slate-800/30 overflow-hidden">
          <div className="max-h-[280px] overflow-y-auto">
            {robot.actionHistory.map((entry, i) => {
              const dotColor = entry.result === "success"
                ? "bg-emerald-400"
                : entry.result === "warning"
                  ? "bg-amber-400"
                  : "bg-red-400";
              const textColor = entry.result === "success"
                ? "text-slate-300"
                : entry.result === "warning"
                  ? "text-amber-300"
                  : "text-red-300";
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-2.5 py-1.5 text-[10px] ${
                    i > 0 ? "border-t border-slate-700/20" : ""
                  }`}
                >
                  <div className="flex flex-col items-center pt-[3px] shrink-0">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    {i < robot.actionHistory.length - 1 && (
                      <div className="w-px flex-1 bg-slate-700/40 mt-0.5 min-h-[12px]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`leading-tight ${textColor}`}>{entry.action}</p>
                    <p className="text-slate-600 font-mono text-[9px] mt-0.5">{entry.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- City Drill-Down View ---

interface CityViewProps {
  city: SafetyCity;
  onBack: () => void;
  autoSelectRobotId?: string | null;
}

function CityView({ city, onBack, autoSelectRobotId }: CityViewProps) {
  const [selectedRobot, setSelectedRobot] = useState<SafetyRobot | null>(null);
  const counts = useMemo(() => statusCounts(city.robots), [city.robots]);

  const sortedRobots = useMemo(() => {
    return [...city.robots].sort((a, b) => {
      const order = { danger: 0, warning: 1, safe: 2 };
      return order[a.status] - order[b.status];
    });
  }, [city.robots]);

  useEffect(() => {
    if (autoSelectRobotId) {
      const robot = city.robots.find((r) => r.id === autoSelectRobotId);
      if (robot) setSelectedRobot(robot);
    }
  }, [autoSelectRobotId, city.robots]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            data-back-button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 px-2 py-1 rounded border border-slate-700/50 hover:border-slate-600"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            World Map
          </button>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: city.accentColor }} />
              {city.name}
            </h4>
            <span className="text-[10px] text-slate-500">{city.robots.length} robots monitored</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center">
          <div className="text-sm font-semibold font-mono text-blue-400">{city.robots.length}</div>
          <div className="text-[9px] text-slate-500">Total</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center">
          <div className="text-sm font-semibold font-mono text-emerald-400">{counts.safe}</div>
          <div className="text-[9px] text-slate-500">Safe</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center">
          <div className="text-sm font-semibold font-mono text-amber-400">{counts.warning}</div>
          <div className="text-[9px] text-slate-500">Warning</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center">
          <div className="text-sm font-semibold font-mono text-red-400">{counts.danger}</div>
          <div className="text-[9px] text-slate-500">Danger</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className={selectedRobot ? "md:col-span-3" : "md:col-span-5"}>
          <div className="relative rounded-lg bg-slate-800/30 border border-slate-700/20 p-3">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-xs font-semibold text-slate-400">Robot Grid</h4>
              <span className="text-[10px] text-slate-600">Click to inspect</span>
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {sortedRobots.map((robot) => (
                <div
                  key={robot.id}
                  data-robot-id={robot.id}
                  onClick={() => setSelectedRobot(robot)}
                  className={`w-[7px] h-[7px] rounded-full cursor-pointer transition-all hover:scale-[2.5] ${
                    robot.status === "danger" ? "animate-danger-pulse" : ""
                  } ${selectedRobot?.id === robot.id ? "ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-[3]" : ""}`}
                  style={{ backgroundColor: statusColor(robot.status) }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Active Incidents</h4>
            <div className="space-y-1 overflow-y-auto">
              {sortedRobots
                .filter((r) => r.status !== "safe" && r.lastIncident)
                .map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRobot(r)}
                    className={`flex items-center gap-2 text-[10px] py-1 px-2 rounded cursor-pointer transition-colors ${
                      selectedRobot?.id === r.id ? "bg-slate-700/50 ring-1 ring-slate-600" : "bg-slate-800/30 hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColor(r.status) }} />
                    <span className="text-slate-300 font-mono shrink-0 w-16">{r.name}</span>
                    <span className="text-slate-500 shrink-0 w-16">{r.type}</span>
                    <span className={r.status === "danger" ? "text-red-400" : "text-amber-400"}>{r.lastIncident}</span>
                  </div>
                ))}
              {sortedRobots.filter((r) => r.status !== "safe" && r.lastIncident).length === 0 && (
                <div className="text-[10px] text-slate-600 text-center py-2 font-mono">No active incidents</div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedRobot && (
            <div className="md:col-span-2">
              <RobotDetailPanel
                key={selectedRobot.id}
                robot={selectedRobot}
                onClose={() => setSelectedRobot(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- Auto-Demo Orchestrator ---

function pickRandomCity(excludeId?: string): SafetyCity {
  const candidates = excludeId ? safetyCities.filter((c) => c.id !== excludeId) : safetyCities;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function pickDangerRobot(city: SafetyCity): SafetyRobot {
  const sorted = [...city.robots].sort((a, b) => {
    const order = { danger: 0, warning: 1, safe: 2 };
    return order[a.status] - order[b.status];
  });
  const dangerOrWarning = sorted.filter((r) => r.status !== "safe");
  if (dangerOrWarning.length === 0) return sorted[0];
  return dangerOrWarning[Math.floor(Math.random() * dangerOrWarning.length)];
}

// --- Main SafetyDashboard ---

export default function SafetyDashboard() {
  const [selectedCity, setSelectedCity] = useState<SafetyCity | null>(null);
  const [autoDemo, setAutoDemo] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorClicking, setCursorClicking] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [autoRobotId, setAutoRobotId] = useState<string | null>(null);
  const [demoLabel, setDemoLabel] = useState("Interactive demo");
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);
  const demoStartedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const delay = useCallback((ms: number) => {
    return new Promise<void>((resolve, reject) => {
      const id = setTimeout(() => {
        if (cancelledRef.current) reject(new Error("cancelled"));
        else resolve();
      }, ms);
      timersRef.current.push(id);
    });
  }, []);

  const stopDemo = useCallback(() => {
    cancelledRef.current = true;
    clearTimers();
    setAutoDemo(false);
    setCursorVisible(false);
  }, [clearTimers]);

  const getElementCenter = useCallback((selector: string): { x: number; y: number } | null => {
    if (!containerRef.current) return null;
    const el = containerRef.current.querySelector(selector);
    if (!el) return null;
    const elRect = el.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    return {
      x: elRect.left - containerRect.left + elRect.width / 2,
      y: elRect.top - containerRect.top + elRect.height / 2,
    };
  }, []);

  const waitForElement = useCallback(async (selector: string, maxWait = 8000): Promise<{ x: number; y: number }> => {
    const start = Date.now();
    while (Date.now() - start < maxWait) {
      if (cancelledRef.current) throw new Error("cancelled");
      const pos = getElementCenter(selector);
      if (pos) return pos;
      await delay(200);
    }
    throw new Error("element-not-found");
  }, [getElementCenter, delay]);

  const clickAnimation = useCallback(async () => {
    setCursorClicking(true);
    await delay(400);
    setCursorClicking(false);
  }, [delay]);

  const runDemoLoop = useCallback(async () => {
    let lastCityId: string | undefined;

    try {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      // Initial: show cursor at bottom center
      setCursorPos({ x: containerRect.width / 2, y: containerRect.height - 40 });
      setCursorVisible(true);
      setDemoLabel("Select a city...");
      await delay(800);

      // Wait for map to load from CDN
      await waitForElement(`[data-city-id="${safetyCities[0].id}"]`);

      // Infinite loop
      while (true) {
        // --- Pick a random city ---
        const city = pickRandomCity(lastCityId);
        lastCityId = city.id;
        const robot = pickDangerRobot(city);

        // Move cursor to the city marker
        setDemoLabel(`Select ${city.name}...`);
        const cityPos = await waitForElement(`[data-city-id="${city.id}"]`);
        setCursorPos(cityPos);
        await delay(1000);

        // Click the city
        await clickAnimation();
        setSelectedCity(city);
        setAutoRobotId(null);

        // Wait for city view to render
        setDemoLabel("Inspect a robot...");
        await delay(600);

        // Move cursor to a danger/warning robot dot
        const robotPos = await waitForElement(`[data-robot-id="${robot.id}"]`);
        setCursorPos(robotPos);
        await delay(1000);

        // Click the robot dot
        await clickAnimation();
        setAutoRobotId(robot.id);

        // Hold to let user see the detail panel
        setDemoLabel("Click anywhere to take control");
        await delay(3000);

        // --- Navigate back to world map ---
        setDemoLabel("Back to world map...");
        const backPos = await waitForElement("[data-back-button]");
        setCursorPos(backPos);
        await delay(1000);

        // Click the back button
        await clickAnimation();
        setSelectedCity(null);
        setAutoRobotId(null);

        // Wait for world map to re-render
        setDemoLabel("Select a city...");
        await delay(800);
        await waitForElement(`[data-city-id="${safetyCities[0].id}"]`);
        await delay(500);
      }
    } catch {
      // cancelled or element-not-found — silently stop
    }
  }, [delay, waitForElement, clickAnimation]);

  // Start demo only when the component enters the viewport
  useEffect(() => {
    if (!autoDemo || demoStartedRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !demoStartedRef.current && !cancelledRef.current) {
          demoStartedRef.current = true;
          observer.disconnect();
          runDemoLoop();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [autoDemo, runDemoLoop]);

  const handleUserInteraction = useCallback(() => {
    if (autoDemo) {
      stopDemo();
    }
  }, [autoDemo, stopDemo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div
        ref={containerRef}
        className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm overflow-hidden shadow-2xl relative"
        onClick={handleUserInteraction}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-slate-500 ml-2 font-mono">RoboNex Safety Monitor</span>
          </div>
          <div className="flex items-center gap-3">
            {autoDemo && (
              <button
                onClick={(e) => { e.stopPropagation(); stopDemo(); }}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
              >
                Take Control
              </button>
            )}
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedCity ? selectedCity.name : "Global View"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 relative overflow-hidden">
          {/* Grid stacks both views in the same cell; tallest one sets the height */}
          <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
            <div className={`transition-opacity duration-300 ${!selectedCity ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
              <WorldMapView onSelectCity={(city) => { if (autoDemo) stopDemo(); setSelectedCity(city); }} />
            </div>
            <div className={`transition-opacity duration-300 ${selectedCity ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
              {selectedCity && (
                <CityView
                  key={selectedCity.id}
                  city={selectedCity}
                  onBack={() => { setSelectedCity(null); setAutoRobotId(null); }}
                  autoSelectRobotId={autoRobotId}
                />
              )}
            </div>
          </div>
        </div>

        {/* Pseudo cursor overlay */}
        {cursorVisible && (
          <PseudoCursor x={cursorPos.x} y={cursorPos.y} clicking={cursorClicking} />
        )}

        {/* Auto-demo label tooltip */}
        {autoDemo && cursorVisible && (
          <div
            className="absolute z-[101] pointer-events-none bg-slate-900/90 border border-slate-600 rounded-md px-2 py-1 text-[10px] text-slate-300 font-mono shadow-lg whitespace-nowrap"
            style={{
              left: cursorPos.x + 28,
              top: cursorPos.y + 4,
              transition: "left 0.8s cubic-bezier(0.4,0,0.2,1), top 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {demoLabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}
