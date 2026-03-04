"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import HeroAnimation from "@/components/landing/HeroAnimation";
import FeatureCards from "@/components/landing/FeatureCards";
import ArchitectureDiagram from "@/components/landing/ArchitectureDiagram";
import DashboardPreview from "@/components/dashboard/DashboardPreview";
import DataLearningDashboard from "@/components/dashboard/DataLearningDashboard";
import SafetyDashboard from "@/components/dashboard/SafetyDashboard";
import IntroAnimation from "@/components/landing/IntroAnimation";
import { useTheme } from "@/context/ThemeContext";

function SectionTitle({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle: string;
}) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-4 transition-colors ${t(
        "text-blue-400 bg-blue-500/10 border border-blue-500/20",
        "text-blue-600 bg-blue-50 border border-blue-200/60",
      )}`}>
        {tag}
      </span>
      <h2 className={`text-3xl md:text-4xl font-bold mb-3 transition-colors ${t("text-slate-100", "text-slate-800")}`}>
        {title}
      </h2>
      <p className={`max-w-2xl mx-auto transition-colors ${t("text-slate-400", "text-slate-500")}`}>{subtitle}</p>
    </motion.div>
  );
}

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const { t } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300">
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-6 transition-colors ${t(
              "text-teal-400 bg-teal-500/10 border border-teal-500/20",
              "text-teal-600 bg-teal-50 border border-teal-200/60",
            )}`}>
              Open Source &middot; Cloud Native &middot; Privacy First
            </span>
            <h1 className={`text-4xl md:text-6xl font-bold mb-2 leading-tight transition-colors ${t("text-slate-50", "text-slate-800")}`}>
              The Nexus
              <br />
              <span className={`bg-clip-text text-transparent ${t(
                "bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400",
                "bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500",
              )}`}>
                for Embodied AI
              </span>
            </h1>
            <p className={`text-xl mb-3 italic transition-colors ${t("text-slate-400", "text-slate-500")}`}>
              &mdash; Where Every Robot Connects
            </p>
            <p className={`text-base max-w-2xl mx-auto mb-8 transition-colors ${t("text-slate-500", "text-slate-400")}`}>
              The unified cloud platform for robot data, learning, and safety.
              RoboNex breaks down data silos across manufacturers
              &mdash; enabling collective intelligence, safety forensics, and
              cross-fleet interoperability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <HeroAnimation />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className={`text-xs mt-2 transition-colors ${t("text-slate-600", "text-slate-400")}`}
          >
            Robots across the globe stream data to RoboNex Cloud in real time
          </motion.p>
        </div>
      </section>

      {/* Fleet Dashboard Section */}
      <section id="dashboard" className="py-20 px-6">
        <SectionTitle
          tag="For Robot Operators"
          title="Your Fleet, Your Command"
          subtitle="Monitor every joint, every sensor, every robot — in real time. RoboNex Fleet Dashboard gives you full situational awareness with live telemetry, anomaly alerts, and per-robot diagnostics across your entire fleet."
        />
        <DashboardPreview />
      </section>

      {/* Safety Dashboard Section */}
      <section id="safety" className={`py-20 px-6 transition-colors ${t("bg-slate-900/20", "bg-[#F8F3EB]/40")}`}>
        <SectionTitle
          tag="For Regulators & Auditors"
          title="Trust, but Verify"
          subtitle="A global watchdog for every deployed robot. Safety officers, compliance auditors, and policymakers can inspect any city, drill into any machine, and trace every incident — because autonomous systems demand transparent oversight."
        />
        <SafetyDashboard />
      </section>

      {/* Data & Learning Dashboard Section */}
      <section id="data-learning" className="py-20 px-6">
        <SectionTitle
          tag="For Model Providers & Researchers"
          title="Teach Robots at Scale"
          subtitle="Collect demonstrations, train policies, and deploy skills — all from one control room. RoboNex turns raw human demonstrations into cross-fleet intelligence through federated learning, so every robot benefits from every lesson."
        />
        <DataLearningDashboard />
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-6 transition-colors ${t("bg-slate-900/30", "bg-[#F8F3EB]/60")}`}>
        <SectionTitle
          tag="Core Capabilities"
          title="Three Pillars of Robot Intelligence"
          subtitle="RoboNex provides the unified infrastructure that today's fragmented robotics ecosystem desperately needs."
        />
        <FeatureCards />
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 px-6">
        <SectionTitle
          tag="System Design"
          title="Layered Architecture"
          subtitle="From edge robots to application layer — a clean separation of concerns designed for scale, privacy, and auditability."
        />
        <ArchitectureDiagram />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${t("text-slate-100", "text-slate-800")}`}>
            Ready to connect your robot fleet?
          </h2>
          <p className={`mb-8 transition-colors ${t("text-slate-400", "text-slate-500")}`}>
            RoboNex is open source and community-driven. Star us on GitHub,
            read the position paper, or start contributing today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/robonex"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
            <a
              href="#"
              className={`px-6 py-3 rounded-full border font-medium transition-colors ${t(
                "border-slate-600 hover:border-slate-400 text-slate-300",
                "border-slate-300 hover:border-slate-400 text-slate-600",
              )}`}
            >
              Read the Paper
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 transition-colors ${t("border-slate-800/50", "border-stone-200/60")}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`flex items-center gap-2 text-sm transition-colors ${t("text-slate-500", "text-slate-500")}`}>
            <svg viewBox="0 0 32 32" className="w-5 h-5">
              <circle cx="16" cy="16" r="14" fill="#3B82F6" opacity="0.2" />
              <circle cx="16" cy="16" r="5" fill="#60A5FA" />
            </svg>
            <span>RoboNex &mdash; The Nexus for Embodied AI</span>
          </div>
          <div className={`text-xs transition-colors ${t("text-slate-600", "text-slate-400")}`}>
            NeurIPS 2026 Position Paper Track
          </div>
        </div>
      </footer>
    </div>
  );
}
