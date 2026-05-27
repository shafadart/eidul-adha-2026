"use client";

import { motion } from "framer-motion";

/* ──────────────────────────────────────────────
   CrescentMoon
   An SVG crescent with layered glow filters,
   animated fade-in + gentle pulse.
   ────────────────────────────────────────────── */
export default function CrescentMoon() {
  return (
    <motion.div
      className="crescent-glow flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Outer ambient ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Teal-Gold gradient */}
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Crescent shape via two circles (subtractive) */}
        <mask id="crescentMask">
          <circle cx="55" cy="60" r="38" fill="white" />
          <circle cx="72" cy="52" r="30" fill="black" />
        </mask>

        <g filter="url(#moonGlow)">
          <circle
            cx="55"
            cy="60"
            r="38"
            fill="url(#moonGrad)"
            mask="url(#crescentMask)"
          />
        </g>

        {/* Small star next to crescent */}
        <motion.g
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "92px 30px" }}
        >
          <polygon
            points="92,24 94,28 98,28 95,31 96,35 92,32 88,35 89,31 86,28 90,28"
            fill="url(#moonGrad)"
            filter="url(#moonGlow)"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}
