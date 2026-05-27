"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */
const ANIMALS = [
  { name: "Legendary Deshi Goat 🐐", emoji: "🐐" },
  { name: "Sigma Goru 🐂", emoji: "🐂" },
  { name: "VIP Khassi 👑", emoji: "👑" },
  { name: "Village Boss Bull 🐃", emoji: "🐃" },
  { name: "Emotional Bokri 🥺", emoji: "🥺" },
];

const STATS = [
  { label: "Eating Power", icon: "🍃" },
  { label: "Escaping Skill", icon: "🏃" },
  { label: "Drama Level", icon: "🎭" },
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ──────────────────────────────────────────────
   AnimalGeneratorCard
   ────────────────────────────────────────────── */
export default function AnimalGeneratorCard({
  onClickSound,
  onAnimalRevealSound,
}: {
  onClickSound?: () => void;
  onAnimalRevealSound?: () => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "revealed">("idle");
  const [animal, setAnimal] = useState<(typeof ANIMALS)[0] | null>(null);
  const [stats, setStats] = useState<number[]>([0, 0, 0]);

  const handleClick = () => {
    onClickSound?.();
    setState("loading");
    setTimeout(() => {
      const picked = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      const generated = STATS.map(() => randomBetween(70, 99));
      setAnimal(picked);
      setStats(generated);
      setState("revealed");
      onAnimalRevealSound?.();
    }, 1200);
  };

  const handleRetry = () => {
    onClickSound?.();
    setState("idle");
    setAnimal(null);
    setStats([0, 0, 0]);
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🐐</span>
        <h3 className="text-lg font-bangla font-semibold text-gradient-gold leading-tight">
          তোমার কুরবানির পশু কে?
        </h3>
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* ── Idle ── */}
          {state === "idle" && (
            <motion.div
              key="idle"
              className="flex-1 flex flex-col items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="text-sm font-bangla text-center"
                style={{ color: "var(--text-secondary)" }}
              >
                ক্লিক করো এবং জানো তোমার পশু কে!
              </p>
              <motion.button
                onClick={handleClick}
                className="btn-gold font-bangla font-semibold cursor-pointer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                আমার পশু দেখো 🐐
              </motion.button>
            </motion.div>
          )}

          {/* ── Loading ── */}
          {state === "loading" && (
            <motion.div
              key="loading"
              className="flex-1 flex flex-col items-center justify-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={28} style={{ color: "var(--gold-warm)" }} />
              </motion.div>
              <p
                className="text-sm font-bangla"
                style={{ color: "var(--text-secondary)" }}
              >
                বিশ্লেষণ করা হচ্ছে...
              </p>
            </motion.div>
          )}

          {/* ── Revealed ── */}
          {state === "revealed" && animal && (
            <motion.div
              key="revealed"
              className="flex-1 flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animal name */}
              <motion.div
                className="text-center py-3 rounded-xl"
                style={{
                  background: "rgba(212,168,83,0.08)",
                  border: "1px solid rgba(212,168,83,0.2)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  delay: 0.15,
                }}
              >
                <p className="text-xl font-bangla font-bold text-gradient-gold">
                  {animal.name}
                </p>
              </motion.div>

              {/* Stats */}
              <div className="flex flex-col gap-3">
                {STATS.map((stat, i) => (
                  <StatBar
                    key={stat.label}
                    label={stat.label}
                    icon={stat.icon}
                    value={stats[i]}
                    delay={0.3 + i * 0.15}
                  />
                ))}
              </div>

              {/* Retry */}
              <motion.button
                onClick={handleRetry}
                className="mt-auto text-xs font-bangla cursor-pointer self-center transition-colors"
                style={{ color: "var(--text-secondary)" }}
                whileHover={{ color: "var(--teal-accent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                আবার চেষ্টা করো ↻
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Animated stat bar ── */
function StatBar({
  label,
  icon,
  value,
  delay,
}: {
  label: string;
  icon: string;
  value: number;
  delay: number;
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {icon} {label}
        </span>
        <motion.span
          className="text-xs font-bold"
          style={{ color: "var(--gold-warm)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: animated ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {value}%
        </motion.span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--emerald-glow), var(--gold-warm))",
            boxShadow: "0 0 12px rgba(16,185,129,0.3)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: animated ? `${value}%` : "0%" }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}
