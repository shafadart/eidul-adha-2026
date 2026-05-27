"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */
const DIALOGUES = [
  {
    speaker: "মা",
    text: "এত মাংস ফ্রিজে ঢুকবে কিভাবে? 🤦‍♀️",
    color: "#f472b6",
  },
  {
    speaker: "চাচা",
    text: "এইবার গরু ছোট হইছে… 😒",
    color: "#a78bfa",
  },
  {
    speaker: "ছোট ভাই",
    text: "লিভারটা আমি খাব 😤",
    color: "#fb923c",
  },
  {
    speaker: "বাবা",
    text: "কসাই তো এখনো আসলো না! 🕰️",
    color: "#60a5fa",
  },
];

/* ──────────────────────────────────────────────
   FamilyDialogueCard
   ────────────────────────────────────────────── */
export default function FamilyDialogueCard({
  onClickSound,
}: {
  onClickSound?: () => void;
}) {
  const [dialogue, setDialogue] = useState<(typeof DIALOGUES)[0] | null>(null);
  const [key, setKey] = useState(0); // force re-animate

  const handleClick = () => {
    onClickSound?.();
    const picked = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
    setDialogue(picked);
    setKey((k) => k + 1);
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">😂</span>
        <h3 className="text-lg font-bangla font-semibold text-gradient-teal leading-tight">
          পারিবারিক অবস্থা
        </h3>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Dialogue bubble */}
        <div className="flex-1 flex items-center justify-center min-h-[120px]">
          <AnimatePresence mode="wait">
            {dialogue ? (
              <motion.div
                key={key}
                className="w-full rounded-2xl p-5 relative"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${dialogue.color}30`,
                  boxShadow: `0 0 25px ${dialogue.color}12`,
                }}
                initial={{ opacity: 0, scale: 0.7, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                }}
              >
                {/* Speaker badge */}
                <motion.span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bangla font-semibold mb-3"
                  style={{
                    background: `${dialogue.color}18`,
                    color: dialogue.color,
                    border: `1px solid ${dialogue.color}30`,
                  }}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <MessageCircle size={12} />
                  {dialogue.speaker}
                </motion.span>

                {/* Quote */}
                <motion.p
                  className="text-base font-bangla leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  &ldquo;{dialogue.text}&rdquo;
                </motion.p>

                {/* Decorative quote mark */}
                <div
                  className="absolute top-3 right-4 text-3xl font-display select-none pointer-events-none"
                  style={{ color: `${dialogue.color}15` }}
                >
                  &rdquo;
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="placeholder"
                className="text-sm font-bangla text-center"
                style={{ color: "var(--text-secondary)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ক্লিক করো আর দেখো আজকে বাসায় কী হবে! 👀
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Button */}
        <motion.button
          onClick={handleClick}
          className="btn-teal font-bangla font-semibold mt-4 cursor-pointer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {dialogue ? "আবার দেখো 👀" : "আজকে বাসায় কী হবে দেখো 👀"}
        </motion.button>
      </div>
    </div>
  );
}
