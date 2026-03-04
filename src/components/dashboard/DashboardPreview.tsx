"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  robots as staticRobots,
  generateTelemetry,
  type RobotStatus,
} from "@/lib/mockData";

function jitter(base: number, range: number) {
  return Math.round((base + (Math.random() - 0.5) * range) * 10) / 10;
}

function jitterAngleValue(val: string): string {
  const m = val.match(/^(-?\d+\.?\d*)°(.*)$/);
  if (!m) return val;
  const base = parseFloat(m[1]);
  const suffix = m[2];
  return `${jitter(base, 2.0).toFixed(1)}°${suffix}`;
}

function jitterSensorValue(val: string): string {
  const gMatch = val.match(/^(\d+\.?\d*)(g load)$/);
  if (gMatch) return `${Math.round(jitter(parseFloat(gMatch[1]), 40))}${gMatch[2]}`;
  const fpsMatch = val.match(/^(\d+p) @ (\d+)(fps)$/);
  if (fpsMatch) return `${fpsMatch[1]} @ ${Math.round(jitter(parseInt(fpsMatch[2]), 4))}${fpsMatch[3]}`;
  const chMatch = val.match(/^(\d+)( channels)$/);
  if (chMatch) return val;
  return val;
}

function applyJitter(r: RobotStatus) {
  return {
    ...r,
    battery: Math.max(5, Math.round(r.battery + (Math.random() - 0.52) * 0.4)),
    compute: {
      ...r.compute,
      gpuUtil: jitter(r.compute.gpuUtil, 8),
      gpuMemUsed: jitter(r.compute.gpuMemUsed, 0.6),
      inferenceMs: jitter(r.compute.inferenceMs, 4),
      fps: Math.round(jitter(r.compute.fps, 6)),
    },
    joints: r.joints.map((j) => ({ ...j, value: jitterAngleValue(j.value) })),
    sensors: r.sensors.map((s) => ({ ...s, value: jitterSensorValue(s.value) })),
  };
}

function useTickingRobots() {
  const [liveRobots, setLiveRobots] = useState(staticRobots);
  useEffect(() => {
    setLiveRobots(staticRobots.map(applyJitter));
    const id = setInterval(() => {
      setLiveRobots(staticRobots.map(applyJitter));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return liveRobots;
}

const EMPTY_TELEMETRY = Array.from({ length: 60 }, (_, i) => ({
  time: `${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`,
  joint1: 42, joint2: 88, joint3: 12, battery: 95, temperature: 35,
}));

function useTickingTelemetry() {
  const [data, setData] = useState(EMPTY_TELEMETRY);
  useEffect(() => { setData(generateTelemetry(60)); }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const nextMin = parseInt(last.time.split(":")[0]);
        const nextSec = (parseInt(last.time.split(":")[1]) + 1) % 60;
        const newMin = nextSec === 0 ? nextMin + 1 : nextMin;
        const newPoint = {
          time: `${String(newMin).padStart(2, "0")}:${String(nextSec).padStart(2, "0")}`,
          joint1: jitter(42 + Math.sin(Date.now() * 0.001) * 8, 3),
          joint2: jitter(88 + Math.cos(Date.now() * 0.0008) * 5, 2),
          joint3: jitter(12 + Math.sin(Date.now() * 0.0015) * 3, 5),
          battery: Math.max(20, last.battery - Math.random() * 0.3),
          temperature: jitter(35, 4),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return data;
}

function StatusDot({ status }: { status: "ok" | "warning" | "error" | "online" | "offline" }) {
  const colors = {
    ok: "bg-emerald-400", online: "bg-emerald-400", warning: "bg-amber-400",
    error: "bg-red-400", offline: "bg-slate-500",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status]}`} />;
}

function LiveValue({ value, color = "text-slate-300" }: { value: string; color?: string }) {
  return (
    <span className={`${color} font-mono transition-all duration-300`}>
      {value}
    </span>
  );
}

function GpuBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = Math.min(100, (used / total) * 100);
  return (
    <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function FleetOverview({
  robots,
  onSelectRobot,
  selectedId,
}: {
  robots: RobotStatus[];
  onSelectRobot: (r: RobotStatus) => void;
  selectedId: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-300">Fleet Status</h4>
        <span className="text-xs text-slate-500">
          {robots.filter((r) => r.status === "online").length}/{robots.length} online
        </span>
      </div>
      {robots.map((robot) => (
        <button
          key={robot.id}
          onClick={() => onSelectRobot(robot)}
          className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 ${
            selectedId === robot.id
              ? "border-blue-500/40 bg-blue-500/10"
              : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <img src={robot.image} alt={robot.name} className="w-10 h-10 rounded-md object-cover bg-slate-700/50" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <StatusDot status={robot.status} />
                  <span className="text-sm font-medium text-slate-200 truncate">{robot.name}</span>
                </div>
                <LiveValue value={`${robot.battery}%`} color={robot.battery > 50 ? "text-emerald-400" : "text-amber-400"} />
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-600 font-mono truncate">{robot.manufacturer}</span>
                <span className="text-[10px] text-slate-400 shrink-0">{robot.task}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function RobotDetail({ robot }: { robot: RobotStatus }) {
  return (
    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
      <div className="flex items-start gap-3">
        <img src={robot.image} alt={robot.name} className="w-16 h-16 rounded-lg object-cover bg-slate-700/50 border border-slate-700/30" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200">{robot.name}</h4>
            <div className="flex items-center gap-1.5">
              <StatusDot status={robot.status} />
              <span className="text-xs text-slate-400 capitalize">{robot.status}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">{robot.manufacturer}</p>
          <p className="text-xs text-slate-500 mt-0.5">{robot.location} &middot; {robot.task}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Battery", value: `${robot.battery}%`, color: robot.battery > 50 ? "text-emerald-400" : "text-amber-400" },
          { label: "Uptime", value: robot.uptime, color: "text-blue-400" },
          { label: "Episodes", value: robot.episodesLogged.toLocaleString(), color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="p-2 rounded-md bg-slate-800/50 text-center">
            <div className={`text-sm font-semibold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h5 className="text-xs font-semibold text-slate-400 mb-2">Compute & Model</h5>
        <div className="space-y-2 p-2 rounded-lg bg-slate-800/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{robot.compute.gpu}</span>
            <LiveValue value={`${robot.compute.gpuUtil}%`} color={robot.compute.gpuUtil > 80 ? "text-amber-400" : "text-emerald-400"} />
          </div>
          <GpuBar used={robot.compute.gpuUtil} total={100} color={robot.compute.gpuUtil > 80 ? "#FBBF24" : "#34D399"} />
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">VRAM</span>
            <LiveValue value={`${robot.compute.gpuMemUsed} / ${robot.compute.gpuMemTotal} GB`} color="text-slate-300" />
          </div>
          <GpuBar used={robot.compute.gpuMemUsed} total={robot.compute.gpuMemTotal} color="#60A5FA" />
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            <div className="text-center p-1.5 rounded bg-slate-800/60">
              <div className="text-xs font-semibold text-cyan-400 font-mono"><LiveValue value={`${robot.compute.inferenceMs}ms`} color="text-cyan-400" /></div>
              <div className="text-[9px] text-slate-600">Inference</div>
            </div>
            <div className="text-center p-1.5 rounded bg-slate-800/60">
              <div className="text-xs font-semibold text-teal-400 font-mono"><LiveValue value={`${robot.compute.fps}`} color="text-teal-400" /></div>
              <div className="text-[9px] text-slate-600">FPS</div>
            </div>
            <div className="text-center p-1.5 rounded bg-slate-800/60">
              <div className="text-[10px] font-semibold text-purple-400 font-mono truncate">{robot.compute.policyVersion}</div>
              <div className="text-[9px] text-slate-600">Policy</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-600 font-mono">
            Model: {robot.compute.model}
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-slate-400 mb-2">Joints</h5>
        <div className="space-y-1">
          {robot.joints.map((j) => (
            <div key={j.name} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-800/30">
              <div className="flex items-center gap-2">
                <StatusDot status={j.status} />
                <span className="text-slate-300">{j.name}</span>
              </div>
              <span className="text-slate-500 font-mono">{j.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-slate-400 mb-2">Sensors</h5>
        <div className="space-y-1">
          {robot.sensors.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-800/30">
              <div className="flex items-center gap-2">
                <StatusDot status={s.status} />
                <span className="text-slate-300">{s.name}</span>
              </div>
              <span className="text-slate-500 font-mono">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TelemetryChart({ data }: { data: ReturnType<typeof generateTelemetry> }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-300 mb-3">
        Joint Telemetry <span className="text-emerald-400 text-xs font-mono ml-1">LIVE</span>
      </h4>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748B" }} interval={9} />
          <YAxis tick={{ fontSize: 10, fill: "#64748B" }} width={30} />
          <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} />
          <Line type="monotone" dataKey="joint1" stroke="#60A5FA" strokeWidth={1.5} dot={false} name="Shoulder" isAnimationActive={false} />
          <Line type="monotone" dataKey="joint2" stroke="#A78BFA" strokeWidth={1.5} dot={false} name="Elbow" isAnimationActive={false} />
          <Line type="monotone" dataKey="joint3" stroke="#FBBF24" strokeWidth={1.5} dot={false} name="Wrist" isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LiveStatsGrid() {
  const [stats, setStats] = useState({
    latency: 23, dataRate: 1.2, alerts: 3, uptime: 99.7,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setStats({
        latency: Math.round(jitter(23, 8)),
        dataRate: Math.round(jitter(1.2, 0.4) * 10) / 10,
        alerts: Math.random() > 0.9 ? Math.round(jitter(3, 2)) : 3,
        uptime: Math.round(jitter(99.7, 0.4) * 10) / 10,
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "Avg Latency", value: `${stats.latency}ms`, color: "text-emerald-400" },
    { label: "Data Rate", value: `${stats.dataRate} GB/hr`, color: "text-blue-400" },
    { label: "Active Alerts", value: `${stats.alerts}`, color: "text-amber-400" },
    { label: "Uptime (Fleet)", value: `${stats.uptime}%`, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.label} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
          <div className="text-xs text-slate-500 mb-1">{item.label}</div>
          <div className={`text-lg font-semibold font-mono ${item.color} transition-all duration-300`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

type Tab = "fleet" | "telemetry";

export default function DashboardPreview() {
  const liveRobots = useTickingRobots();
  const liveTelemetry = useTickingTelemetry();
  const [selectedId, setSelectedId] = useState(staticRobots[0].id);
  const [activeTab, setActiveTab] = useState<Tab>("fleet");

  const selectedRobot = liveRobots.find((r) => r.id === selectedId) || liveRobots[0];

  const handleSelect = useCallback((r: RobotStatus) => {
    setSelectedId(r.id);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "fleet", label: "Fleet" },
    { id: "telemetry", label: "Telemetry" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-slate-500 ml-2 font-mono">RoboNex Fleet Dashboard</span>
          </div>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  activeTab === tab.id ? "bg-blue-500/20 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="p-4 relative overflow-hidden">
          <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
            <div className={`transition-opacity duration-300 ${activeTab === "fleet" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FleetOverview robots={liveRobots} onSelectRobot={handleSelect} selectedId={selectedId} />
                <RobotDetail robot={selectedRobot} />
              </div>
            </div>
            <div className={`transition-opacity duration-300 ${activeTab === "telemetry" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
              <div className="space-y-6">
                <TelemetryChart data={liveTelemetry} />
                <LiveStatsGrid />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
