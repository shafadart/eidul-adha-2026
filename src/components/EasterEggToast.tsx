"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "single" | "admin" | "vip";
  onDismiss: () => void;
}

/* ──────────────────────────────────────────────
   EasterEggToast
   A glowing, cinematic toast that slides in
   with a type-specific colour scheme.
   ────────────────────────────────────────────── */
export default function EasterEggToast({
  message,
  type,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 500); // let exit animation finish
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const colorMap = {
    single: {
      bg: "rgba(220, 38, 38, 0.15)",
      border: "rgba(248, 113, 113, 0.4)",
      glow: "0 0 30px rgba(239, 68, 68, 0.25), 0 0 60px rgba(239, 68, 68, 0.1)",
      text: "#fca5a5",
      icon: "💔",
    },
    admin: {
      bg: "rgba(99, 102, 241, 0.12)",
      border: "rgba(165, 180, 252, 0.35)",
      glow: "0 0 30px rgba(99, 102, 241, 0.2), 0 0 60px rgba(99, 102, 241, 0.08)",
      text: "#c7d2fe",
      icon: "🔪",
    },
    vip: {
      bg: "rgba(212, 168, 83, 0.12)",
      border: "rgba(212, 168, 83, 0.4)",
      glow: "0 0 30px rgba(212, 168, 83, 0.3), 0 0 60px rgba(212, 168, 83, 0.12)",
      text: "#fde68a",
      icon: "👑",
    },
  };

  const c = colorMap[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-8 left-1/2 z-50 max-w-lg w-[90vw]"
          style={{ x: "-50%" }}
          initial={{ y: -40, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div
            className="relative rounded-2xl px-6 py-4 backdrop-blur-xl"
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              boxShadow: c.glow,
            }}
          >
            <p
              className="text-center text-base md:text-lg font-medium font-bangla leading-relaxed"
              style={{ color: c.text }}
            >
              <span className="mr-2 text-xl">{c.icon}</span>
              {message}
            </p>

            {/* pulsing glow behind */}
            <motion.div
              className="absolute inset-0 rounded-2xl -z-10"
              style={{
                background: c.bg,
                filter: "blur(20px)",
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
