"use client";

import { motion } from "framer-motion";
import AnimalGeneratorCard from "./AnimalGeneratorCard";
import FamilyDialogueCard from "./FamilyDialogueCard";
import QurbaniCalculatorCard from "./QurbaniCalculatorCard";
import GlassCard3D from "./GlassCard3D";

/* ──────────────────────────────────────────────
   Stagger animation variants
   ────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ──────────────────────────────────────────────
   Sound callback types
   ────────────────────────────────────────────── */
interface DashboardProps {
  userName: string;
  onClickSound?: () => void;
  onHoverSound?: () => void;
  onAnimalRevealSound?: () => void;
}

/* ──────────────────────────────────────────────
   Dashboard
   The main interactive grid revealed after
   the user clicks "Explore Eid Experience".
   Now with 3D tilt cards + sound callbacks.
   ────────────────────────────────────────────── */
export default function Dashboard({
  userName,
  onClickSound,
  onHoverSound,
  onAnimalRevealSound,
}: DashboardProps) {
  return (
    <motion.section
      className="w-full max-w-6xl mx-auto px-4 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section heading */}
      <motion.div className="text-center mb-10" variants={cardVariants}>
        <h2
          className="text-2xl md:text-3xl font-display font-bold mb-2"
          style={{
            background:
              "linear-gradient(135deg, #2dd4bf 0%, #d4a853 50%, #fbbf24 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {userName}-এর Eid Dashboard
        </h2>
        <p
          className="text-sm font-bangla"
          style={{ color: "var(--text-secondary)" }}
        >
          তোমার জন্য কিছু মজার জিনিস প্রস্তুত আছে! ✨
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <span
            className="block h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-warm), transparent)",
            }}
          />
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--gold-warm)", opacity: 0.6 }}
          />
          <span
            className="block h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-warm), transparent)",
            }}
          />
        </div>
      </motion.div>

      {/* Cards grid — wrapped in GlassCard3D with balanced 3-column layout */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants}>
          <GlassCard3D onHoverSound={onHoverSound}>
            <AnimalGeneratorCard
              onClickSound={onClickSound}
              onAnimalRevealSound={onAnimalRevealSound}
            />
          </GlassCard3D>
        </motion.div>
        <motion.div variants={cardVariants}>
          <GlassCard3D onHoverSound={onHoverSound}>
            <FamilyDialogueCard onClickSound={onClickSound} />
          </GlassCard3D>
        </motion.div>
        <motion.div variants={cardVariants}>
          <GlassCard3D onHoverSound={onHoverSound}>
            <QurbaniCalculatorCard onClickSound={onClickSound} />
          </GlassCard3D>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
