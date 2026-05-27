"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────
   Tiny decorative stars that twinkle and float around
   the sky — generated client-side only to
   avoid hydration mismatch from Math.random().
   ────────────────────────────────────────────── */
function StarField() {
  const [stars, setStars] = useState<
    {
      id: number;
      left: string;
      top: string;
      size: number;
      delay: number;
      duration: number;
      opacity: number;
      floatX: number;
      floatY: number;
    }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 75 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 1.2,
        delay: Math.random() * 6,
        duration: Math.random() * 5 + 4,
        opacity: Math.random() * 0.6 + 0.15,
        floatX: Math.random() * 30 - 15,
        floatY: Math.random() * 30 - 15,
      }))
    );
  }, []);

  if (stars.length === 0) return null;

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background:
              s.id % 3 === 0
                ? "var(--gold-glow)"
                : s.id % 3 === 1
                ? "var(--teal-accent)"
                : "rgba(240,253,244,0.6)",
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0, s.opacity, 0],
            scale: [0.4, 1, 0.4],
            x: [0, s.floatX, 0],
            y: [0, s.floatY, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────
   BackgroundCrescent
   A large, subtle crescent moon in the top-right
   corner with pulsing scale and glow.
   ────────────────────────────────────────────── */
function BackgroundCrescent({ isLight }: { isLight: boolean }) {
  const currentOpacity = isLight ? 0.35 : 0.12;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: "5%",
        right: "8%",
        width: 200,
        height: 200,
        opacity: currentOpacity,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: currentOpacity, scale: 1 }}
      transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
    >
      {/* Pulsing glow ring */}
      <motion.div
        className="absolute inset-0"
        style={{
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(212,168,83,0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* SVG crescent */}
      <motion.svg
        viewBox="0 0 120 120"
        fill="none"
        className="w-full h-full"
        animate={{
          scale: [1, 1.06, 1],
          filter: isLight
            ? [
                "drop-shadow(0 0 15px rgba(212,168,83,0.3))",
                "drop-shadow(0 0 30px rgba(212,168,83,0.5))",
                "drop-shadow(0 0 15px rgba(212,168,83,0.3))",
              ]
            : [
                "drop-shadow(0 0 15px rgba(45,212,191,0.2))",
                "drop-shadow(0 0 30px rgba(45,212,191,0.35))",
                "drop-shadow(0 0 15px rgba(45,212,191,0.2))",
              ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="bgMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#f59e0b" : "#2dd4bf"} stopOpacity="0.6" />
            <stop offset="50%" stopColor={isLight ? "#fbbf24" : "#d4a853"} stopOpacity="0.4" />
            <stop offset="100%" stopColor={isLight ? "#d4a853" : "#fbbf24"} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <mask id="bgCrescentMask">
          <circle cx="55" cy="60" r="42" fill="white" />
          <circle cx="74" cy="50" r="34" fill="black" />
        </mask>
        <circle
          cx="55"
          cy="60"
          r="42"
          fill="url(#bgMoonGrad)"
          mask="url(#bgCrescentMask)"
        />
        {/* Small star */}
        <polygon
          points="98,22 100,27 105,27 101,30 102,35 98,32 94,35 95,30 91,27 96,27"
          fill="url(#bgMoonGrad)"
          opacity="0.7"
        />
      </motion.svg>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Horizontal Fog Bands
   Full-width translating mist strips for
   a moody, mysterious atmosphere.
   ────────────────────────────────────────────── */
function FogBands({ isLight }: { isLight: boolean }) {
  return (
    <>
      {/* Band 1 — slow rightward drift */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "25%",
          left: "-20%",
          width: "140%",
          height: "180px",
          background: isLight
            ? "linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.05) 20%, rgba(245,158,11,0.04) 50%, rgba(212,168,83,0.03) 80%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.03) 20%, rgba(16,185,129,0.04) 50%, rgba(45,212,191,0.02) 80%, transparent 100%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: ["-10%", "10%", "-10%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Band 2 — slow leftward drift (lower) */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "55%",
          left: "-15%",
          width: "130%",
          height: "200px",
          background: isLight
            ? "linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.04) 25%, rgba(251,191,36,0.05) 50%, rgba(212,168,83,0.03) 75%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.025) 25%, rgba(212,168,83,0.035) 50%, rgba(212,168,83,0.02) 75%, transparent 100%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: ["8%", "-12%", "8%"],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Band 3 — very subtle, near bottom */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "78%",
          left: "-10%",
          width: "120%",
          height: "150px",
          background: isLight
            ? "linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.03) 30%, rgba(251,191,36,0.04) 60%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.02) 30%, rgba(16,185,129,0.03) 60%, transparent 100%)",
          filter: "blur(45px)",
        }}
        animate={{
          x: ["-5%", "15%", "-5%"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </>
  );
}

/* ──────────────────────────────────────────────
   FloatingOrbs
   Two subtle, slowly floating blurred glowing orbs in teal
   and gold positioned in the left-bottom and right-top background areas
   to fill the space and provide deep cinematic immersion.
   ────────────────────────────────────────────── */
function FloatingOrbs({ isLight }: { isLight: boolean }) {
  return (
    <>
      {/* Left-bottom Teal Orb */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: "5%",
          left: "5%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{
          x: [0, 50, -40, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Right-top Gold Orb */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          right: "5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.9, 1.12, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </>
  );
}

/* ──────────────────────────────────────────────
   AmbientBackground
   Full-screen cinematic backdrop with:
   • radial-gradient core
   • three drifting fog layers
   • horizontal fog bands (mist effect)
   • 2 slowly floating glowing orbs (teal/gold)
   • background crescent moon (top-right)
   • twinkling & floating star particles
   ────────────────────────────────────────────── */
export default function AmbientBackground({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <div
      className="ambient-bg transition-all duration-1000"
      style={
        isLight
          ? {
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,168,83,0.14) 0%, rgba(246,243,236,0.98) 60%, #FDFBF7 100%)",
            }
          : {}
      }
      aria-hidden="true"
    >
      {/* Fog layer 1 — bottom-left teal/gold */}
      <motion.div
        className="fog-layer fog-layer-1"
        style={
          isLight
            ? {
                background:
                  "radial-gradient(ellipse 120% 40% at 30% 80%, rgba(212,168,83,0.06) 0%, transparent 70%)",
              }
            : {}
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      {/* Fog layer 2 — mid-right emerald/gold */}
      <motion.div
        className="fog-layer fog-layer-2"
        style={
          isLight
            ? {
                background:
                  "radial-gradient(ellipse 100% 50% at 70% 60%, rgba(251,191,36,0.05) 0%, transparent 60%)",
              }
            : {}
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4, ease: "easeOut", delay: 0.5 }}
      />

      {/* Fog layer 3 — bottom-centre gold */}
      <motion.div
        className="fog-layer fog-layer-3"
        style={
          isLight
            ? {
                background:
                  "radial-gradient(ellipse 80% 30% at 50% 90%, rgba(245,158,11,0.04) 0%, transparent 50%)",
              }
            : {}
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 5, ease: "easeOut", delay: 1 }}
      />

      {/* Horizontal fog/mist bands */}
      <FogBands isLight={isLight} />

      {/* Floating Orbs (Left-Bottom, Right-Top) */}
      <FloatingOrbs isLight={isLight} />

      {/* Central soft glow orb */}
      <motion.div
        className="absolute"
        style={{
          top: "35%",
          left: "50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(212,168,83,0.1) 0%, rgba(251,191,36,0.05) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(45,212,191,0.07) 0%, rgba(16,185,129,0.03) 40%, transparent 70%)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Background crescent moon */}
      <BackgroundCrescent isLight={isLight} />

      {/* Stars */}
      <StarField />
    </div>
  );
}
