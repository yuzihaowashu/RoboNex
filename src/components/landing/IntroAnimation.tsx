"use client";

import { useState, useEffect, useCallback } from "react";

const KEYWORDS = [
  { text: "RoboLake",   color: "#60A5FA", x: -200, y: -130 },
  { text: "RoboBridge",  color: "#A78BFA", x: 210,  y: -120 },
  { text: "RoboCortex",  color: "#2DD4BF", x: -220, y: 110 },
  { text: "RoboFleet",   color: "#FBBF24", x: 200,  y: 130 },
  { text: "RoboNex",     color: "#F472B6", x: 0,    y: 0 },
];

const TAGLINE =
  "The unified cloud platform for robot data, learning, and safety. RoboNex breaks down data silos across manufacturers — enabling collective intelligence, safety forensics, and cross-fleet interoperability.";

function TypewriterText({ text, onDone }: { text: string; onDone: () => void }) {
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex >= text.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const speed = text[charIndex] === " " ? 20 : 28;
    const t = setTimeout(() => setCharIndex((i) => i + 1), speed);
    return () => clearTimeout(t);
  }, [charIndex, text, onDone]);

  return (
    <span className="font-typewriter text-base md:text-lg text-slate-400/90 leading-relaxed">
      {text.slice(0, charIndex)}
      <span className="animate-cursor-blink text-slate-300">|</span>
    </span>
  );
}

type Phase = "init" | "keywords-in" | "collapse" | "nexus" | "tagline" | "typewriter" | "fadeout" | "done";

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("init");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("keywords-in"), 100));
    timers.push(setTimeout(() => setPhase("collapse"), 2800));
    timers.push(setTimeout(() => setPhase("nexus"), 4000));
    timers.push(setTimeout(() => setPhase("tagline"), 5800));
    timers.push(setTimeout(() => setPhase("typewriter"), 7200));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleTypewriterDone = useCallback(() => {
    setPhase("fadeout");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 900);
  }, [onComplete]);

  if (phase === "done") return null;

  const showKeywords = phase === "init" || phase === "keywords-in" || phase === "collapse";
  const keywordsVisible = phase === "keywords-in";
  const keywordsCollapsed = phase === "collapse";
  const showTitle = phase === "nexus" || phase === "tagline" || phase === "typewriter" || phase === "fadeout";
  const showSubtitle = phase === "tagline" || phase === "typewriter" || phase === "fadeout";
  const showTypewriter = phase === "typewriter" || phase === "fadeout";

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#0F172A] overflow-hidden"
      style={{
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.9s ease",
      }}
    >
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]" />

      {/* Keywords — always in DOM, animated via CSS transitions */}
      {showKeywords &&
        KEYWORDS.map((kw, i) => {
          const isVisible = keywordsVisible && !keywordsCollapsed;
          const isCollapsed = keywordsCollapsed;
          return (
            <div
              key={kw.text}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                color: kw.color,
                transform: isCollapsed
                  ? "translate(-50%, -50%) scale(0)"
                  : isVisible
                    ? `translate(calc(-50% + ${kw.x}px), calc(-50% + ${kw.y}px)) scale(1)`
                    : `translate(calc(-50% + ${kw.x * 3}px), calc(-50% + ${kw.y * 3}px)) scale(2.5)`,
                opacity: isCollapsed ? 0 : isVisible ? 1 : 0,
                transition: isCollapsed
                  ? `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.06}s`
                  : `all 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`,
              }}
              className="text-4xl md:text-6xl font-bold whitespace-nowrap select-none pointer-events-none"
            >
              {kw.text}
            </div>
          );
        })}

      {/* Burst ring — centered on viewport */}
      {showTitle && (
        <div
          className="fixed w-32 h-32 rounded-full border-2 border-blue-400/30 pointer-events-none z-[101]"
          style={{
            top: "calc(25vh + 85px)",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "intro-burst 1.8s ease-out forwards",
          }}
        />
      )}

      {/* Title — The Nexus for Embodied AI */}
      {showTitle && (
        <div className="absolute inset-0 flex justify-center" style={{ paddingTop: "25vh" }}>
          <div className="text-center max-w-3xl px-6">
            <h1
              className="text-5xl md:text-7xl font-bold text-slate-50 leading-tight"
              style={{
                animation: "intro-title-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              The Nexus
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                for Embodied AI
              </span>
            </h1>

            {showSubtitle && (
              <p
                className="mt-5 text-xl md:text-2xl text-slate-400 italic"
                style={{
                  animation: "intro-subtitle-in 0.7s ease-out forwards",
                }}
              >
                &mdash; Where Every Robot Connects
              </p>
            )}

            {showTypewriter && (
              <div
                className="mt-8 max-w-2xl mx-auto text-left"
                style={{
                  animation: "intro-fade-in 0.4s ease-out forwards",
                }}
              >
                <TypewriterText text={TAGLINE} onDone={handleTypewriterDone} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skip button */}
      <button
        className="absolute bottom-8 right-8 text-xs text-slate-600 hover:text-slate-400 transition-colors font-mono border border-slate-700/50 px-3 py-1.5 rounded-full hover:border-slate-600/50"
        style={{
          animation: "intro-fade-in 0.5s ease-out 1.5s both",
        }}
        onClick={() => {
          setPhase("done");
          onComplete();
        }}
      >
        Skip Intro ↵
      </button>
    </div>
  );
}
