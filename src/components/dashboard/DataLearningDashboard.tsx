"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  collectionStations as staticStations,
  collectiveLearningData,
  type CollectionStation,
} from "@/lib/mockData";

// --- Shared helpers ---

function jitter(base: number, range: number) {
  return Math.round((base + (Math.random() - 0.5) * range) * 10) / 10;
}

function formatTime(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatFrames(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDataSize(mb: number) {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${Math.round(mb)} MB`;
}

// --- Collection data hook ---

interface ActivityEvent {
  id: number;
  time: string;
  station: string;
  message: string;
  color: string;
}

const EVENT_TEMPLATES = [
  (st: CollectionStation, ep: number) => ({ msg: `Episode #${ep} saved (quality: ${(90 + Math.random() * 8).toFixed(1)}%)`, color: "text-emerald-400" }),
  (st: CollectionStation) => ({ msg: `Frame batch uploaded (${Math.round(800 + Math.random() * 600)} frames)`, color: "text-blue-400" }),
  (st: CollectionStation) => ({ msg: `New task started: ${st.task}`, color: "text-purple-400" }),
  (st: CollectionStation) => ({ msg: `Quality check passed`, color: "text-teal-400" }),
];

function useTickingCollection() {
  const [stations, setStations] = useState<CollectionStation[]>(staticStations);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const eventIdRef = useRef(0);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setStations((prev) =>
        prev.map((st) => {
          if (st.status !== "recording") return st;
          const newProgress = st.episodeProgress + 0.02 + Math.random() * 0.03;
          const episodeComplete = newProgress >= 1;
          return {
            ...st,
            sessionSeconds: st.sessionSeconds + 1,
            episodes: episodeComplete ? st.episodes + 1 : st.episodes,
            rate: jitter(st.rate || 2.5, 0.6),
            frames: st.frames + Math.round(180 + Math.random() * 120),
            dataSizeMB: st.dataSizeMB + Math.round(8 + Math.random() * 6),
            quality: Math.round(jitter(st.quality, 1.5) * 10) / 10,
            latencyMs: Math.max(4, Math.round(jitter(st.latencyMs, 8))),
            episodeProgress: episodeComplete ? Math.random() * 0.1 : newProgress,
          };
        })
      );
      if (tick % 3 === 0) {
        setStations((current) => {
          const activeStations = current.filter((s) => s.status === "recording");
          if (activeStations.length === 0) return current;
          const st = activeStations[Math.floor(Math.random() * activeStations.length)];
          const tmpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
          const { msg, color } = tmpl(st, st.episodes);
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
          eventIdRef.current += 1;
          const newId = eventIdRef.current;
          setEvents((evts) => [{ id: newId, time: timeStr, station: st.name.replace(" Station", ""), message: msg, color }, ...evts].slice(0, 20));
          return current;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { stations, events };
}

// --- Collection sub-components ---

function UmiIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v1H9V5z" />
      <path d="M7 6h10v4a2 2 0 01-2 2h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6H9a2 2 0 01-2-2V6z" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
      <path d="M6 8H4a1 1 0 00-1 1v2" strokeLinecap="round" />
      <path d="M18 8h2a1 1 0 011 1v2" strokeLinecap="round" />
    </svg>
  );
}

function TeleoperationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="8" width="16" height="10" rx="3" />
      <circle cx="9" cy="13" r="2" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
      <path d="M15 11v-1M17 13h1M15 15v1M13 13h-1" strokeLinecap="round" />
      <path d="M8 6h8" strokeLinecap="round" />
    </svg>
  );
}

function MotionCaptureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <path d="M12 11l-4 5" strokeLinecap="round" />
      <path d="M12 11l4 5" strokeLinecap="round" />
      <path d="M8 9l-3 3" strokeLinecap="round" />
      <path d="M16 9l3 3" strokeLinecap="round" />
      <circle cx="5" cy="12" r="0.8" fill="currentColor" className="animate-pulse" />
      <circle cx="19" cy="12" r="0.8" fill="currentColor" className="animate-pulse" />
      <circle cx="8" cy="16" r="0.8" fill="currentColor" className="animate-pulse" />
      <circle cx="16" cy="16" r="0.8" fill="currentColor" className="animate-pulse" />
      <circle cx="12" cy="5" r="0.8" fill="currentColor" className="animate-pulse" />
    </svg>
  );
}

function MethodIcon({ method }: { method: CollectionStation["method"] }) {
  if (method === "UMI Gripper") return <UmiIcon />;
  if (method === "Teleoperation") return <TeleoperationIcon />;
  return <MotionCaptureIcon />;
}

function StationCard({ station }: { station: CollectionStation }) {
  const isActive = station.status === "recording";
  return (
    <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: station.accentColor }}>
      <div className="p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ color: station.accentColor }}><MethodIcon method={station.method} /></span>
            <div>
              <div className="text-xs font-semibold text-slate-200">{station.location}</div>
              <div className="text-[10px] text-slate-500">{station.method}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isActive ? <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-recording-pulse" /> : <span className="inline-block w-2 h-2 rounded-full bg-slate-500" />}
            <span className={`text-[10px] font-mono ${isActive ? "text-red-400" : "text-slate-500"}`}>{station.status === "recording" ? "REC" : station.status.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">{station.operator}</span>
          <span className="text-slate-500 font-mono">{station.task}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { value: isActive ? formatTime(station.sessionSeconds) : "--:--:--", label: "Session", color: "text-slate-200" },
            { value: station.episodes.toLocaleString(), label: "Episodes", color: "text-blue-400" },
            { value: isActive ? `${station.rate.toFixed(1)}/hr` : "--", label: "Rate", color: "text-teal-400" },
            { value: formatFrames(station.frames), label: "Frames", color: "text-purple-400" },
            { value: formatDataSize(station.dataSizeMB), label: "Data", color: "text-amber-400" },
            { value: `${station.quality.toFixed(1)}%`, label: "Quality", color: station.quality > 94 ? "text-emerald-400" : "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="p-1.5 rounded bg-slate-800/60 text-center">
              <div className={`text-xs font-semibold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-600">Cloud Latency</span>
          <span className={`font-mono ${station.latencyMs < 20 ? "text-emerald-400" : "text-amber-400"}`}>{station.latencyMs}ms</span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] text-slate-600">Episode Progress</span>
            <span className="text-[9px] text-slate-500 font-mono">{isActive ? `${Math.round(station.episodeProgress * 100)}%` : "Waiting..."}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: isActive ? `${station.episodeProgress * 100}%` : "0%", backgroundColor: station.accentColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionGlobalStats({ stations }: { stations: CollectionStation[] }) {
  const totalEpisodes = stations.reduce((s, st) => s + st.episodes, 0);
  const activeCount = stations.filter((s) => s.status === "recording").length;
  const totalData = stations.reduce((s, st) => s + st.dataSizeMB, 0);
  const avgQuality = stations.reduce((s, st) => s + st.quality, 0) / stations.length;
  const items = [
    { label: "Total Episodes", value: totalEpisodes.toLocaleString(), color: "text-blue-400" },
    { label: "Active Stations", value: `${activeCount}/${stations.length}`, color: "text-emerald-400" },
    { label: "Data Ingested", value: formatDataSize(totalData), color: "text-amber-400" },
    { label: "Avg Quality", value: `${avgQuality.toFixed(1)}%`, color: "text-purple-400" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {items.map((item) => (
        <div key={item.label} className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center">
          <div className={`text-sm font-semibold font-mono ${item.color} transition-all duration-300`}>{item.value}</div>
          <div className="text-[9px] text-slate-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-semibold text-slate-400">Live Activity</h4>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <div className="h-[120px] overflow-hidden rounded-lg bg-slate-800/30 border border-slate-700/20">
        <div className="p-2 space-y-0.5">
          {events.length === 0 && <div className="text-[10px] text-slate-600 text-center py-3 font-mono">Waiting for events...</div>}
          {events.slice(0, 5).map((evt, i) => (
            <div key={evt.id} className="flex items-center gap-2 text-[10px] py-0.5 animate-feed-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
              <span className="text-slate-600 font-mono shrink-0">{evt.time}</span>
              <span className="text-slate-500 font-medium shrink-0 w-12 truncate">{evt.station}</span>
              <span className={`${evt.color} truncate`}>{evt.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Learning sub-components ---

const episodeCategories = [
  { key: "approach", label: "Approach", color: "#60A5FA" },
  { key: "pick", label: "Pick", color: "#A78BFA" },
  { key: "transport", label: "Transport", color: "#2DD4BF" },
  { key: "place", label: "Place", color: "#FBBF24" },
  { key: "others", label: "Others", color: "#F87171" },
];

function CollectiveLearningChart() {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-300 mb-3">Collective Learning Progress</h4>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={collectiveLearningData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
          <YAxis tick={{ fontSize: 10, fill: "#64748B" }} width={35} />
          <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} />
          <Area type="monotone" dataKey="successRate" stroke="#2DD4BF" fill="#14B8A6" fillOpacity={0.15} strokeWidth={2} name="Success Rate %" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function EpisodesChart() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-300">Episodes by Task Phase</h4>
        <div className="flex items-center gap-3">
          {episodeCategories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: cat.color, opacity: 0.8 }} />
              <span className="text-[10px] text-slate-500">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={collectiveLearningData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
          <YAxis tick={{ fontSize: 10, fill: "#64748B" }} width={40} />
          <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} />
          {episodeCategories.map((cat, i) => (
            <Bar key={cat.key} dataKey={cat.key} stackId="episodes" fill={cat.color} fillOpacity={0.75} name={cat.label}
              radius={i === episodeCategories.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LearningStats() {
  const latest = collectiveLearningData[collectiveLearningData.length - 1];
  const totalEpisodes = latest.approach + latest.pick + latest.transport + latest.place + latest.others;
  const items = [
    { label: "Success Rate", value: `${latest.successRate}%`, color: "text-teal-400" },
    { label: "Total Episodes", value: totalEpisodes.toLocaleString(), color: "text-blue-400" },
    { label: "Fleet Participants", value: "4 / 4", color: "text-emerald-400" },
    { label: "Active Policies", value: "3", color: "text-purple-400" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {items.map((item) => (
        <div key={item.label} className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center">
          <div className={`text-sm font-semibold font-mono ${item.color}`}>{item.value}</div>
          <div className="text-[9px] text-slate-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// --- Main merged component ---

export default function DataLearningDashboard() {
  const { stations, events } = useTickingCollection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-slate-500 ml-2 font-mono">RoboNex Data & Learning</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-[10px] text-purple-400 font-mono">Federated</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Data Collection Section */}
          <div className="mb-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-3">Data Collection</h3>
            <CollectionGlobalStats stations={stations} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stations.map((st) => (
                <StationCard key={st.id} station={st} />
              ))}
            </div>
            <div className="mt-4">
              <ActivityFeed events={events} />
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-slate-700/40" />

          {/* Learning Section */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-3">Collective Learning</h3>
            <LearningStats />
            <div className="space-y-5">
              <CollectiveLearningChart />
              <EpisodesChart />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
