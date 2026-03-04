"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

type RobotTask = "clean" | "cook" | "carry" | "scan" | "wave" | "build" | "patrol" | "idle";

function Robot({
  x,
  y,
  accentColor,
  task = "idle",
  delay = 0,
}: {
  x: number;
  y: number;
  accentColor: string;
  task?: RobotTask;
  delay?: number;
}) {
  const bodyWhite = "#F0F0F0";
  const bodyStroke = "#C0C4CC";
  const darkJoint = "#2D3348";
  const handColor = "#8A8E99";

  const taskLabel: Record<RobotTask, string> = {
    clean: "Cleaning",
    cook: "Cooking",
    carry: "Carrying",
    scan: "Scanning",
    wave: "Hello!",
    build: "Building",
    patrol: "Patrolling",
    idle: "",
  };

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + delay, duration: 0.5, type: "spring" }}
    >
      <g transform={`translate(${x}, ${y})`}>

        {/* Task label floating above */}
        {task !== "idle" && (
          <g>
            <rect
              x="-18"
              y="-50"
              width="36"
              height="12"
              rx="6"
              fill={accentColor}
              opacity="0.2"
            />
            <text
              x="0"
              y="-42"
              textAnchor="middle"
              fontSize="6.5"
              fill={accentColor}
              fontFamily="var(--font-geist-sans), sans-serif"
              opacity="0.9"
            >
              {taskLabel[task]}
            </text>
          </g>
        )}

        {/* Whole body group - different base motions per task */}
        <g>
          {/* Body sway for clean/patrol */}
          {(task === "clean" || task === "patrol") && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 6,0; 0,0; -6,0; 0,0"
              dur={task === "clean" ? "2.5s" : "3.5s"}
              repeatCount="indefinite"
            />
          )}
          {/* Bobbing for idle/wave/cook */}
          {(task === "idle" || task === "wave" || task === "cook" || task === "scan") && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-3; 0,0"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          {/* Walking for carry */}
          {task === "carry" && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 4,-1; 8,0; 4,-1; 0,0"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          {/* Hammering bob for build */}
          {task === "build" && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-2; 0,1; 0,-2; 0,0"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}

          {/* === BASE / PLATFORM === */}
          <rect x="-14" y="38" width="28" height="6" rx="3" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.8" />
          <rect x="-12" y="37" width="24" height="3" rx="1.5" fill={accentColor} opacity="0.8" />

          {/* === LEGS === */}
          {/* Left leg */}
          <g>
            {(task === "carry" || task === "patrol") && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 -5.5 20; -8 -5.5 20; 0 -5.5 20; 8 -5.5 20; 0 -5.5 20"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
            <rect x="-9" y="20" width="7" height="12" rx="2" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.7" />
            <circle cx="-5.5" cy="26" r="1.5" fill={bodyStroke} />
            <rect x="-9" y="32" width="8" height="6" rx="2" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.7" />
            <rect x="-9" y="35" width="8" height="3" rx="1.5" fill={darkJoint} opacity="0.7" />
          </g>
          {/* Right leg */}
          <g>
            {(task === "carry" || task === "patrol") && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 5.5 20; 8 5.5 20; 0 5.5 20; -8 5.5 20; 0 5.5 20"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
            <rect x="2" y="20" width="7" height="12" rx="2" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.7" />
            <circle cx="5.5" cy="26" r="1.5" fill={bodyStroke} />
            <rect x="1" y="32" width="8" height="6" rx="2" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.7" />
            <rect x="1" y="35" width="8" height="3" rx="1.5" fill={darkJoint} opacity="0.7" />
          </g>

          {/* === TORSO === */}
          <rect x="-12" y="-8" width="24" height="28" rx="4" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.8" />
          <rect x="-12" y="4" width="24" height="7" rx="0" fill={accentColor} opacity="0.85" />
          <line x1="-8" y1="-2" x2="8" y2="-2" stroke={bodyStroke} strokeWidth="0.5" opacity="0.5" />

          {/* === SHOULDER JOINTS === */}
          <circle cx="-14" cy="-2" r="5" fill={accentColor} opacity="0.7" />
          <circle cx="-14" cy="-2" r="3" fill={darkJoint} />
          <circle cx="14" cy="-2" r="5" fill={accentColor} opacity="0.7" />
          <circle cx="14" cy="-2" r="3" fill={darkJoint} />

          {/* === LEFT ARM === */}
          <g>
            {task === "cook" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 -17 2; -30 -17 2; -60 -17 2; -30 -17 2; 0 -17 2"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
            {task === "build" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 -17 2; -40 -17 2; 0 -17 2"
                dur="0.8s"
                repeatCount="indefinite"
              />
            )}
            {task === "clean" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 -17 2; -15 -17 2; 0 -17 2; 10 -17 2; 0 -17 2"
                dur="2.5s"
                repeatCount="indefinite"
              />
            )}
            <rect x="-20" y="2" width="6" height="13" rx="2.5" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.7" />
            <rect x="-19" y="14" width="5" height="5" rx="2" fill={handColor} opacity="0.8" />
            {/* Broom for cleaning */}
            {task === "clean" && (
              <g>
                <line x1="-17" y1="15" x2="-17" y2="32" stroke="#A0AEC0" strokeWidth="1.5" />
                <rect x="-22" y="30" width="10" height="4" rx="1" fill="#A0AEC0" opacity="0.7" />
              </g>
            )}
            {/* Spatula for cooking */}
            {task === "cook" && (
              <g>
                <line x1="-17" y1="15" x2="-17" y2="28" stroke="#A0AEC0" strokeWidth="1.5" />
                <ellipse cx="-17" cy="30" rx="4" ry="3" fill="#A0AEC0" opacity="0.6" />
              </g>
            )}
          </g>

          {/* === RIGHT ARM === */}
          <g>
            {task === "wave" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 17 2; -50 17 2; -35 17 2; -50 17 2; -35 17 2; 0 17 2"
                dur="2.5s"
                repeatCount="indefinite"
              />
            )}
            {task === "build" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 17 2; -45 17 2; 0 17 2"
                dur="0.8s"
                repeatCount="indefinite"
                begin="0.4s"
              />
            )}
            {task === "scan" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 17 2; -20 17 2; 0 17 2"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
            <rect x="14" y="2" width="6" height="13" rx="2.5" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.7" />
            <rect x="14" y="14" width="5" height="5" rx="2" fill={handColor} opacity="0.8" />
            {/* Hammer for building */}
            {task === "build" && (
              <g>
                <line x1="17" y1="15" x2="17" y2="26" stroke="#A0AEC0" strokeWidth="1.5" />
                <rect x="14" y="24" width="6" height="5" rx="1" fill="#A0AEC0" opacity="0.7" />
              </g>
            )}
          </g>

          {/* Carry box (on top of arms) */}
          {task === "carry" && (
            <g>
              <rect x="-8" y="-2" width="16" height="10" rx="2" fill={accentColor} opacity="0.3" stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.5" />
              <line x1="-8" y1="3" x2="8" y2="3" stroke={accentColor} strokeWidth="0.5" opacity="0.4" />
              <line x1="0" y1="-2" x2="0" y2="8" stroke={accentColor} strokeWidth="0.5" opacity="0.4" />
            </g>
          )}

          {/* === HEAD === */}
          <g>
            {task === "scan" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 -20; -12 0 -20; 0 0 -20; 12 0 -20; 0 0 -20"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
            {task === "cook" && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 -20; -5 0 -20; 0 0 -20; 5 0 -20; 0 0 -20"
                dur="2.5s"
                repeatCount="indefinite"
              />
            )}
            <ellipse cx="0" cy="-20" rx="10" ry="11" fill={bodyWhite} stroke={bodyStroke} strokeWidth="0.8" />
            {/* Eyes */}
            <line x1="-4" y1="-19" x2="-2" y2="-19" stroke={darkJoint} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="2" y1="-19" x2="4" y2="-19" stroke={darkJoint} strokeWidth="1.8" strokeLinecap="round" />
            {/* Cap dome */}
            <ellipse cx="0" cy="-28" rx="11" ry="5" fill={accentColor} />
            <path d="M -11 -28 Q -11 -34 0 -35 Q 11 -34 11 -28" fill={accentColor} />
            {/* Cap brim */}
            <ellipse cx="4" cy="-27" rx="9" ry="2.5" fill={accentColor} opacity="0.85" />
            <path d="M -5 -33 Q 0 -35 5 -33" fill="none" stroke="white" strokeWidth="0.6" opacity="0.4" />
          </g>

          {/* Scan beam effect */}
          {task === "scan" && (
            <g opacity="0.5">
              <line x1="0" y1="-10" x2="-20" y2="20" stroke="#22D3EE" strokeWidth="0.8">
                <animate attributeName="x2" values="-20;20;-20" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="-10" x2="-15" y2="20" stroke="#22D3EE" strokeWidth="0.5">
                <animate attributeName="x2" values="-15;15;-15" dur="3s" repeatCount="indefinite" />
              </line>
              <ellipse cx="0" cy="20" rx="12" ry="3" fill="#22D3EE" opacity="0.15">
                <animate attributeName="rx" values="12;18;12" dur="3s" repeatCount="indefinite" />
              </ellipse>
            </g>
          )}

          {/* Steam for cooking */}
          {task === "cook" && (
            <g transform="translate(-20, 20)">
              <circle r="2" fill="white" opacity="0.2">
                <animate attributeName="cy" values="0;-12;-24" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.15;0" dur="2s" repeatCount="indefinite" />
                <animate attributeName="r" values="1;2;3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="white" opacity="0.2">
                <animate attributeName="cy" values="0;-10;-20" dur="2s" begin="0.7s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.1;0" dur="2s" begin="0.7s" repeatCount="indefinite" />
                <animate attributeName="r" values="1;1.5;2.5" dur="2s" begin="0.7s" repeatCount="indefinite" />
              </circle>
              <circle r="1" fill="white" opacity="0.15">
                <animate attributeName="cy" values="0;-8;-18" dur="2s" begin="1.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.08;0" dur="2s" begin="1.3s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.8;1.5;2" dur="2s" begin="1.3s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Dust particles for cleaning */}
          {task === "clean" && (
            <g transform="translate(-17, 32)">
              {[0, 0.6, 1.2].map((d, i) => (
                <circle key={i} r="1.5" fill={accentColor} opacity="0.3">
                  <animate attributeName="cx" values={`${-3 + i * 3};${-6 + i * 4};${-3 + i * 3}`} dur="2.5s" begin={`${d}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values="0;-6;0" dur="2.5s" begin={`${d}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" begin={`${d}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}

          {/* Sparks for building */}
          {task === "build" && (
            <g transform="translate(17, 26)">
              {[0, 0.3, 0.5].map((d, i) => (
                <circle key={i} r="1" fill="#FBBF24" opacity="0">
                  <animate attributeName="cx" values={`0;${-4 + i * 4};${-8 + i * 8}`} dur="0.8s" begin={`${d}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values="0;-4;-8" dur="0.8s" begin={`${d}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.8;0" dur="0.8s" begin={`${d}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}
        </g>
      </g>
    </motion.g>
  );
}

function House({
  x,
  y,
  label,
  roofColor,
  wallColor,
  children,
  delay = 0,
}: {
  x: number;
  y: number;
  label: string;
  roofColor: string;
  wallColor: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const { t } = useTheme();
  return (
    <motion.g
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
    >
      <g transform={`translate(${x}, ${y})`}>
        <rect x="-62" y="4" width="124" height="96" rx="4" fill="black" opacity={t(0.2, 0.04)} />
        <rect x="-64" y="0" width="128" height="96" rx="4" fill={wallColor} opacity={t(0.12, 0.08)} stroke={wallColor} strokeWidth="1.5" strokeOpacity={t(0.25, 0.3)} />
        <polygon points="-70,-20 0,-45 70,-20" fill={roofColor} opacity={t(0.2, 0.15)} stroke={roofColor} strokeWidth="1.5" strokeOpacity={t(0.35, 0.4)} />
        <line x1="-64" y1="48" x2="64" y2="48" stroke={wallColor} strokeWidth="0.5" strokeOpacity="0.15" />
        <line x1="0" y1="0" x2="0" y2="96" stroke={wallColor} strokeWidth="0.5" strokeOpacity="0.15" />
        <rect x="-50" y="-12" width="12" height="10" rx="1.5" fill="#38BDF8" opacity="0.12" />
        <rect x="38" y="-12" width="12" height="10" rx="1.5" fill="#38BDF8" opacity="0.12" />
        <rect x="-5" y="65" width="10" height="16" rx="1.5" fill={wallColor} opacity="0.15" />
        <text x="0" y="112" textAnchor="middle" fontSize="11" fill={t("#94A3B8", "#64748B")} fontFamily="var(--font-geist-sans), sans-serif">
          {label}
        </text>
        {children}
      </g>
    </motion.g>
  );
}

function DataParticle({
  startX, startY, endX, endY, color, delay, duration,
}: {
  startX: number; startY: number; endX: number; endY: number;
  color: string; delay: number; duration: number;
}) {
  return (
    <motion.circle
      cx={startX} cy={startY} r="3" fill={color}
      initial={{ opacity: 0 }}
      animate={{
        cx: [startX, (startX + endX) / 2, endX],
        cy: [startY, startY - 40, endY],
        opacity: [0, 1, 1, 0],
        r: [2, 3.5, 2],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function CloudIcon({ x, y }: { x: number; y: number }) {
  const { t } = useTheme();
  const cloudFill = t("#1E3A5F", "#EFF6FF");
  const cloudFillOpacity = t(0.6, 0.9);
  const cloudBodyOpacity = t(0.8, 1);
  const cloudStroke = t("#3B82F6", "#93C5FD");
  const cloudStrokeOpacity = t(0.4, 0.7);

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
    >
      <g transform={`translate(${x}, ${y})`} className="animate-cloud-pulse">
        <ellipse cx="0" cy="5" rx="60" ry="30" fill="#3B82F6" opacity={t(0.06, 0.08)} />
        <ellipse cx="0" cy="0" rx="44" ry="20" fill={cloudFill} opacity={cloudFillOpacity} />
        <ellipse cx="-20" cy="-5" rx="24" ry="18" fill={cloudFill} opacity={cloudFillOpacity} />
        <ellipse cx="18" cy="-7" rx="26" ry="18" fill={cloudFill} opacity={cloudFillOpacity} />
        <ellipse cx="0" cy="0" rx="42" ry="18" fill={cloudFill} opacity={cloudBodyOpacity} />
        <ellipse cx="0" cy="0" rx="44" ry="20" fill="none" stroke={cloudStroke} strokeWidth="1.5" opacity={cloudStrokeOpacity} />
        <path d="M -14 -4 Q -7 -10 0 -4 Q 7 2 14 -4" fill="none" stroke={t("#60A5FA", "#3B82F6")} strokeWidth="1.5" opacity={t(0.6, 0.5)} />
        <text x="0" y="9" textAnchor="middle" fontSize="10" fontWeight="bold" fill={t("#60A5FA", "#3B82F6")} fontFamily="var(--font-geist-sans), sans-serif">
          RoboNex
        </text>
      </g>
    </motion.g>
  );
}

export default function HeroAnimation() {
  const { t } = useTheme();

  const houses = [
    { x: 110, y: 230, label: "Home A - NYC", roof: "#7BB8E0", wall: "#7BB8E0" },
    { x: 290, y: 230, label: "Home B - London", roof: "#3A4A6B", wall: "#3A4A6B" },
    { x: 470, y: 230, label: "Factory - Los Angeles", roof: "#E8713A", wall: "#E8713A" },
    { x: 650, y: 230, label: "Lab - San Francisco", roof: "#5BAE7C", wall: "#5BAE7C" },
  ];

  const accentColors = ["#7BB8E0", "#3A4A6B", "#E8713A", "#5BAE7C"];
  const cloudCenter = { x: 380, y: 60 };

  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 760 400" className="w-full max-w-4xl" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor={t("#1E3A5F", "#DBEAFE")} stopOpacity={t(0.3, 0.4)} />
            <stop offset="100%" stopColor={t("#0F172A", "#FEFAF3")} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="760" height="400" fill="url(#bgGlow)" />
        <CloudIcon x={cloudCenter.x} y={cloudCenter.y} />

        {/* Data flow particles */}
        {houses.map((house, i) =>
          Array.from({ length: 4 }).map((_, j) => (
            <DataParticle
              key={`p-${i}-${j}`}
              startX={house.x} startY={house.y - 50}
              endX={cloudCenter.x} endY={cloudCenter.y + 22}
              color={accentColors[i]}
              delay={j * 1.2 + i * 0.3} duration={2.5}
            />
          ))
        )}

        {/* Connection lines */}
        {houses.map((house, i) => (
          <motion.path
            key={`line-${i}`}
            d={`M ${house.x} ${house.y - 50} Q ${(house.x + cloudCenter.x) / 2} ${house.y - 110} ${cloudCenter.x} ${cloudCenter.y + 22}`}
            fill="none" stroke={accentColors[i]} strokeWidth="1" strokeOpacity={t(0.12, 0.25)} strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1 + i * 0.2, duration: 1.5 }}
          />
        ))}

        {/* Home A - NYC: Cleaning + Waving */}
        <House x={houses[0].x} y={houses[0].y} label={houses[0].label} roofColor={houses[0].roof} wallColor={houses[0].wall} delay={0.1}>
          <Robot x={-32} y={28} accentColor="#7BB8E0" task="clean" delay={0.2} />
          <Robot x={32} y={28} accentColor="#8EC8ED" task="wave" delay={0.5} />
        </House>

        {/* Home B - London: Cooking + Idle */}
        <House x={houses[1].x} y={houses[1].y} label={houses[1].label} roofColor={houses[1].roof} wallColor={houses[1].wall} delay={0.3}>
          <Robot x={-32} y={28} accentColor="#3A4A6B" task="cook" delay={0.4} />
          <Robot x={32} y={28} accentColor="#4E5E82" task="scan" delay={0.7} />
        </House>

        {/* Factory C - Tokyo: Carrying + Building */}
        <House x={houses[2].x} y={houses[2].y} label={houses[2].label} roofColor={houses[2].roof} wallColor={houses[2].wall} delay={0.5}>
          <Robot x={-32} y={28} accentColor="#E8713A" task="carry" delay={0.3} />
          <Robot x={32} y={28} accentColor="#F09060" task="build" delay={0.6} />
        </House>

        {/* Lab D - Berlin: Scanning + Patrolling */}
        <House x={houses[3].x} y={houses[3].y} label={houses[3].label} roofColor={houses[3].roof} wallColor={houses[3].wall} delay={0.7}>
          <Robot x={-32} y={28} accentColor="#5BAE7C" task="scan" delay={0.5} />
          <Robot x={32} y={28} accentColor="#78C495" task="patrol" delay={0.8} />
        </House>

        {/* Online status badges */}
        {houses.map((house, i) => (
          <motion.g key={`badge-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 + i * 0.2 }}>
            <circle cx={house.x + 55} cy={house.y - 38} r="4" fill="#22C55E" opacity="0.9" />
            <circle cx={house.x + 55} cy={house.y - 38} r="4" fill="none" stroke="#22C55E" strokeWidth="1" opacity="0.4">
              <animate attributeName="r" from="4" to="9" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
