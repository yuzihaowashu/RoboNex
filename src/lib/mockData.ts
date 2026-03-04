const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export interface ComputeInfo {
  gpu: string;
  gpuUtil: number;
  gpuMemUsed: number;
  gpuMemTotal: number;
  model: string;
  inferenceMs: number;
  fps: number;
  policyVersion: string;
}

export interface RobotStatus {
  id: string;
  name: string;
  manufacturer: string;
  location: string;
  status: "online" | "warning" | "offline";
  task: string;
  battery: number;
  image: string;
  compute: ComputeInfo;
  joints: { name: string; status: "ok" | "warning" | "error"; value: string }[];
  sensors: { name: string; status: "ok" | "warning" | "error"; value: string }[];
  uptime: string;
  episodesLogged: number;
}

export interface TelemetryPoint {
  time: string;
  joint1: number;
  joint2: number;
  joint3: number;
  battery: number;
  temperature: number;
}

export const robots: RobotStatus[] = [
  {
    id: "r-001",
    name: "Memo",
    manufacturer: "Sunday Robotics",
    location: "Home A - NYC",
    status: "online",
    task: "Floor Cleaning",
    battery: 78,
    image: `${BASE}/robots/memo.jpeg`,
    compute: {
      gpu: "NVIDIA Jetson Orin Nano",
      gpuUtil: 62,
      gpuMemUsed: 3.1,
      gpuMemTotal: 8,
      model: "MemoNav-v2.1",
      inferenceMs: 18,
      fps: 28,
      policyVersion: "v2.1.4-stable",
    },
    joints: [
      { name: "Base (Rotation)", status: "ok", value: "142.3°" },
      { name: "Shoulder", status: "ok", value: "88.1°" },
      { name: "Elbow", status: "warning", value: "12.7° [low torque]" },
      { name: "Gripper", status: "ok", value: "OPEN" },
    ],
    sensors: [
      { name: "LiDAR", status: "ok", value: "Active" },
      { name: "Camera (Front)", status: "ok", value: "1080p @ 30fps" },
      { name: "IMU", status: "ok", value: "Calibrated" },
      { name: "Proximity", status: "warning", value: "Noisy signal" },
    ],
    uptime: "14h 23m",
    episodesLogged: 1847,
  },
  {
    id: "r-002",
    name: "Unitree G1",
    manufacturer: "Unitree Robotics",
    location: "Home B - London",
    status: "online",
    task: "Cooking Assist",
    battery: 92,
    image: `${BASE}/robots/unitree-g1.jpeg`,
    compute: {
      gpu: "NVIDIA Jetson AGX Orin",
      gpuUtil: 78,
      gpuMemUsed: 12.4,
      gpuMemTotal: 32,
      model: "UniManip-G1-v3",
      inferenceMs: 12,
      fps: 42,
      policyVersion: "v3.0.2-nightly",
    },
    joints: [
      { name: "Hip (Left)", status: "ok", value: "45.5°" },
      { name: "Hip (Right)", status: "ok", value: "44.8°" },
      { name: "Knee (Left)", status: "ok", value: "67.2°" },
      { name: "Knee (Right)", status: "ok", value: "66.9°" },
      { name: "Wrist (Left)", status: "ok", value: "12.0°" },
      { name: "Wrist (Right)", status: "ok", value: "CLOSED" },
    ],
    sensors: [
      { name: "Intel RealSense D435", status: "ok", value: "Depth active" },
      { name: "Force Sensors (Hands)", status: "ok", value: "342g load" },
      { name: "IMU (Trunk)", status: "ok", value: "Balanced" },
      { name: "Foot Pressure", status: "ok", value: "Normal" },
    ],
    uptime: "8h 41m",
    episodesLogged: 923,
  },
  {
    id: "r-003",
    name: "Unitree Go2",
    manufacturer: "Unitree Robotics",
    location: "Factory - Los Angeles",
    status: "warning",
    task: "Patrol & Inspection",
    battery: 45,
    image: `${BASE}/robots/unitree-go2.jpeg`,
    compute: {
      gpu: "NVIDIA Jetson Orin NX",
      gpuUtil: 85,
      gpuMemUsed: 6.8,
      gpuMemTotal: 16,
      model: "Go2-Locomotion-v4",
      inferenceMs: 8,
      fps: 60,
      policyVersion: "v4.1.0-release",
    },
    joints: [
      { name: "Front Left Hip", status: "ok", value: "12.3°" },
      { name: "Front Right Hip", status: "ok", value: "11.8°" },
      { name: "Rear Left Hip", status: "warning", value: "18.5° [stiff]" },
      { name: "Rear Right Hip", status: "ok", value: "12.0°" },
      { name: "Front Left Knee", status: "ok", value: "45.2°" },
      { name: "Front Right Knee", status: "ok", value: "44.9°" },
    ],
    sensors: [
      { name: "Intel RealSense D435i", status: "ok", value: "Depth active" },
      { name: "Ultrasonic Array", status: "ok", value: "8 channels" },
      { name: "Foot Force Sensors", status: "warning", value: "Rear L noisy" },
      { name: "IMU (Body)", status: "ok", value: "Balanced" },
    ],
    uptime: "22h 07m",
    episodesLogged: 4210,
  },
  {
    id: "r-004",
    name: "Optimus Gen-2",
    manufacturer: "Tesla",
    location: "Lab - San Francisco",
    status: "online",
    task: "Environment Scan",
    battery: 65,
    image: `${BASE}/robots/optimus.jpeg`,
    compute: {
      gpu: "Tesla FSD Chip (HW4)",
      gpuUtil: 54,
      gpuMemUsed: 8.2,
      gpuMemTotal: 24,
      model: "Optimus-World-v1",
      inferenceMs: 15,
      fps: 35,
      policyVersion: "v1.2.0-beta",
    },
    joints: [
      { name: "Hip (Left)", status: "ok", value: "12.3°" },
      { name: "Hip (Right)", status: "ok", value: "12.1°" },
      { name: "Shoulder (Left)", status: "ok", value: "45.0°" },
      { name: "Shoulder (Right)", status: "ok", value: "43.8°" },
      { name: "Fingers (Left)", status: "ok", value: "Adaptive grip" },
      { name: "Fingers (Right)", status: "ok", value: "Relaxed" },
    ],
    sensors: [
      { name: "Tesla Vision (8 cam)", status: "ok", value: "360° active" },
      { name: "Autopilot HW4 IMU", status: "ok", value: "Calibrated" },
      { name: "Tactile (Fingertips)", status: "ok", value: "Sensitive" },
      { name: "WiFi Connectivity", status: "ok", value: "5GHz linked" },
    ],
    uptime: "5h 58m",
    episodesLogged: 612,
  },
];

export function generateTelemetry(count: number): TelemetryPoint[] {
  const data: TelemetryPoint[] = [];
  let battery = 95;
  for (let i = 0; i < count; i++) {
    battery = Math.max(20, battery - Math.random() * 0.5);
    data.push({
      time: `${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`,
      joint1: 42 + Math.sin(i * 0.1) * 8 + Math.random() * 2,
      joint2: 88 + Math.cos(i * 0.08) * 5 + Math.random() * 1.5,
      joint3: 12 + Math.sin(i * 0.15) * 3 + (i > 40 ? Math.random() * 6 : 0),
      battery: Math.round(battery * 10) / 10,
      temperature: 35 + Math.sin(i * 0.05) * 3 + Math.random(),
    });
  }
  return data;
}

export interface CollectionStation {
  id: string;
  name: string;
  location: string;
  method: "UMI Gripper" | "Teleoperation" | "Motion Capture";
  environment: string;
  operator: string;
  task: string;
  status: "recording" | "idle" | "paused";
  accentColor: string;
  sessionSeconds: number;
  episodes: number;
  rate: number;
  frames: number;
  dataSizeMB: number;
  quality: number;
  latencyMs: number;
  episodeProgress: number;
}

export const collectionStations: CollectionStation[] = [
  {
    id: "cs-001",
    name: "Kitchen Station",
    location: "Kitchen - NYC",
    method: "UMI Gripper",
    environment: "Home Kitchen",
    operator: "Alice Chen",
    task: "Pick & Place",
    status: "recording",
    accentColor: "#60A5FA",
    sessionSeconds: 9252,
    episodes: 142,
    rate: 3.2,
    frames: 284100,
    dataSizeMB: 18200,
    quality: 96.1,
    latencyMs: 14,
    episodeProgress: 0.82,
  },
  {
    id: "cs-002",
    name: "Factory Station",
    location: "Factory - Los Angeles",
    method: "Teleoperation",
    environment: "Industrial Assembly",
    operator: "Bob Kim",
    task: "Part Assembly",
    status: "recording",
    accentColor: "#F97316",
    sessionSeconds: 4365,
    episodes: 87,
    rate: 2.1,
    frames: 174000,
    dataSizeMB: 11400,
    quality: 91.8,
    latencyMs: 32,
    episodeProgress: 0.54,
  },
  {
    id: "cs-003",
    name: "Lab Station",
    location: "Lab - San Francisco",
    method: "Motion Capture",
    environment: "Research Lab",
    operator: "Carol Wu",
    task: "Locomotion Demo",
    status: "idle",
    accentColor: "#A78BFA",
    sessionSeconds: 0,
    episodes: 203,
    rate: 0,
    frames: 406000,
    dataSizeMB: 24800,
    quality: 94.7,
    latencyMs: 8,
    episodeProgress: 0,
  },
];

// --- Safety Map Data ---

export interface RobotAction {
  timestamp: string;
  action: string;
  result: "success" | "warning" | "error";
}

export interface SafetyRobot {
  id: string;
  name: string;
  type: "Humanoid" | "Quadruped" | "Arm" | "Drone";
  status: "safe" | "warning" | "danger";
  lastIncident: string | null;
  image: string;
  manufacturer: string;
  model: string;
  battery: number;
  uptime: string;
  task: string;
  firmware: string;
  lastSafetyCheck: string;
  safetyScore: number;
  actionHistory: RobotAction[];
}

export interface SafetyCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  accentColor: string;
  robots: SafetyRobot[];
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const ROBOT_TYPES: SafetyRobot["type"][] = ["Humanoid", "Quadruped", "Arm", "Drone"];
const ROBOT_PREFIXES = ["RX", "MK", "OP", "QD", "DR", "AT", "NX", "SV"];
const INCIDENTS = [
  "Collision avoidance triggered",
  "Unexpected stop — obstacle",
  "Motor overheat detected",
  "Battery critical shutdown",
  "Sensor fusion anomaly",
  "Grip force exceeded limit",
  "Path deviation > 2m",
  "Communication timeout",
  null,
  null,
  null,
  null,
];

const ACTION_TEMPLATES: { action: string; result: RobotAction["result"] }[] = [
  { action: "Navigation waypoint reached", result: "success" },
  { action: "Object picked up successfully", result: "success" },
  { action: "Obstacle detected — rerouted", result: "success" },
  { action: "Safety zone boundary check", result: "success" },
  { action: "Sensor calibration completed", result: "success" },
  { action: "Battery charging started", result: "success" },
  { action: "Task handoff to next station", result: "success" },
  { action: "Payload delivered to target", result: "success" },
  { action: "Motor temperature spike detected", result: "warning" },
  { action: "Grip force near threshold", result: "warning" },
  { action: "Network latency > 200ms", result: "warning" },
  { action: "LiDAR point cloud degraded", result: "warning" },
  { action: "Emergency stop triggered", result: "error" },
  { action: "Collision detected — halted", result: "error" },
  { action: "Joint torque limit exceeded", result: "error" },
  { action: "Communication link lost (3s)", result: "error" },
];

function generateActionHistory(seed: number, status: SafetyRobot["status"]): RobotAction[] {
  const count = Math.floor(seededRandom(seed + 100) * 5) + 5;
  const actions: RobotAction[] = [];
  let minutesAgo = 1;
  for (let i = 0; i < count; i++) {
    const s = seed * 100 + i + 200;
    const r = seededRandom(s);
    let templateIdx: number;
    if (status === "danger" && i < 2) {
      templateIdx = Math.floor(seededRandom(s + 1) * 4) + 12;
    } else if (status === "warning" && i === 0) {
      templateIdx = Math.floor(seededRandom(s + 1) * 4) + 8;
    } else {
      templateIdx = Math.floor(r * ACTION_TEMPLATES.length);
    }
    const tpl = ACTION_TEMPLATES[templateIdx % ACTION_TEMPLATES.length];
    const hours = Math.floor(minutesAgo / 60);
    const mins = minutesAgo % 60;
    const ts = hours > 0
      ? `${hours}h ${String(mins).padStart(2, "0")}m ago`
      : `${mins}m ago`;
    actions.push({ timestamp: ts, action: tpl.action, result: tpl.result });
    minutesAgo += Math.floor(seededRandom(s + 2) * 25) + 3;
  }
  return actions;
}

interface RobotIdentity {
  image: string;
  manufacturer: string;
  model: string;
}

const ROBOT_IDENTITIES: Record<SafetyRobot["type"], RobotIdentity[]> = {
  Humanoid: [
    { image: `${BASE}/robots/unitree-g1.jpeg`, manufacturer: "Unitree Robotics", model: "G1 Pro" },
    { image: `${BASE}/robots/optimus.jpeg`, manufacturer: "Tesla", model: "Optimus Gen-2" },
  ],
  Quadruped: [
    { image: `${BASE}/robots/unitree-go2.jpeg`, manufacturer: "Unitree Robotics", model: "Go2 Pro" },
  ],
  Arm: [
    { image: `${BASE}/robots/memo.jpeg`, manufacturer: "Sunday Robotics", model: "Memo" },
  ],
  Drone: [
    { image: `${BASE}/robots/unitree-go2.jpeg`, manufacturer: "Unitree Robotics", model: "Go2 Drone" },
  ],
};

const ROBOT_TASKS: Record<SafetyRobot["type"], string[]> = {
  Humanoid: ["Floor Cleaning", "Package Handling", "Cooking Assist", "Warehouse Pick"],
  Quadruped: ["Patrol & Inspection", "Terrain Survey", "Perimeter Guard", "Pipe Inspection"],
  Arm: ["Assembly", "Welding", "Bin Picking", "Quality Inspection"],
  Drone: ["Aerial Survey", "Infrastructure Check", "Delivery", "Environment Scan"],
};

function generateSafetyRobots(cityIndex: number, count: number): SafetyRobot[] {
  const robots: SafetyRobot[] = [];
  for (let i = 0; i < count; i++) {
    const seed = cityIndex * 1000 + i;
    const r = seededRandom(seed);
    const status: SafetyRobot["status"] =
      r < 0.85 ? "safe" : r < 0.95 ? "warning" : "danger";
    const prefix = ROBOT_PREFIXES[Math.floor(seededRandom(seed + 1) * ROBOT_PREFIXES.length)];
    const typeIdx = Math.floor(seededRandom(seed + 2) * ROBOT_TYPES.length);
    const incidentIdx = Math.floor(seededRandom(seed + 3) * INCIDENTS.length);
    const robotType = ROBOT_TYPES[typeIdx];
    const identities = ROBOT_IDENTITIES[robotType];
    const tasks = ROBOT_TASKS[robotType];

    const identityIdx = Math.floor(seededRandom(seed + 4) * identities.length);
    const identity = identities[identityIdx];
    const taskIdx = Math.floor(seededRandom(seed + 6) * tasks.length);
    const battery = status === "danger"
      ? Math.floor(seededRandom(seed + 8) * 30 + 5)
      : Math.floor(seededRandom(seed + 8) * 60 + 40);
    const uptimeHours = Math.floor(seededRandom(seed + 9) * 720);
    const safetyScore = status === "safe"
      ? Math.floor(seededRandom(seed + 10) * 10 + 90)
      : status === "warning"
        ? Math.floor(seededRandom(seed + 10) * 20 + 60)
        : Math.floor(seededRandom(seed + 10) * 40 + 10);

    robots.push({
      id: `${prefix}-${String(cityIndex).padStart(2, "0")}${String(i).padStart(3, "0")}`,
      name: `${prefix}-${String(i + 1).padStart(3, "0")}`,
      type: robotType,
      status,
      lastIncident: status !== "safe" ? INCIDENTS[incidentIdx % 8] : null,
      image: identity.image,
      manufacturer: identity.manufacturer,
      model: identity.model,
      battery,
      uptime: uptimeHours < 24 ? `${uptimeHours}h` : `${Math.floor(uptimeHours / 24)}d ${uptimeHours % 24}h`,
      task: tasks[taskIdx],
      firmware: `v${Math.floor(seededRandom(seed + 11) * 3 + 2)}.${Math.floor(seededRandom(seed + 12) * 9)}.${Math.floor(seededRandom(seed + 13) * 20)}`,
      lastSafetyCheck: `${Math.floor(seededRandom(seed + 14) * 48)}h ago`,
      safetyScore,
      actionHistory: generateActionHistory(seed, status),
    });
  }
  return robots;
}

export const safetyCities: SafetyCity[] = [
  { id: "nyc", name: "New York", lat: 40.71, lng: -74.01, accentColor: "#60A5FA", robots: generateSafetyRobots(0, 150) },
  { id: "ldn", name: "London", lat: 51.51, lng: -0.13, accentColor: "#818CF8", robots: generateSafetyRobots(1, 120) },
  { id: "lax", name: "Los Angeles", lat: 34.05, lng: -118.24, accentColor: "#F97316", robots: generateSafetyRobots(2, 90) },
  { id: "sfo", name: "San Francisco", lat: 37.77, lng: -122.42, accentColor: "#22C55E", robots: generateSafetyRobots(3, 80) },
  { id: "tyo", name: "Tokyo", lat: 35.68, lng: 139.69, accentColor: "#06B6D4", robots: generateSafetyRobots(4, 130) },
  { id: "ber", name: "Berlin", lat: 52.52, lng: 13.41, accentColor: "#A78BFA", robots: generateSafetyRobots(5, 70) },
  { id: "sha", name: "Shanghai", lat: 31.23, lng: 121.47, accentColor: "#F59E0B", robots: generateSafetyRobots(6, 110) },
  { id: "sgp", name: "Singapore", lat: 1.35, lng: 103.82, accentColor: "#14B8A6", robots: generateSafetyRobots(7, 60) },
];

export const collectiveLearningData = [
  { month: "Jan", successRate: 72, robotsActive: 34, approach: 3100, pick: 2800, transport: 3200, place: 2400, others: 900 },
  { month: "Feb", successRate: 75, robotsActive: 41, approach: 4600, pick: 4100, transport: 4700, place: 3500, others: 1300 },
  { month: "Mar", successRate: 79, robotsActive: 58, approach: 6200, pick: 5600, transport: 6400, place: 4800, others: 1800 },
  { month: "Apr", successRate: 82, robotsActive: 72, approach: 7900, pick: 7100, transport: 8100, place: 6100, others: 2300 },
  { month: "May", successRate: 86, robotsActive: 89, approach: 10500, pick: 9500, transport: 10800, place: 8100, others: 3200 },
  { month: "Jun", successRate: 89, robotsActive: 112, approach: 14700, pick: 13200, transport: 15100, place: 11400, others: 4300 },
];
