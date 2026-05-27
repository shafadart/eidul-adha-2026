"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator } from "lucide-react";

/* ──────────────────────────────────────────────
   QurbaniCalculatorCard
   ────────────────────────────────────────────── */
export default function QurbaniCalculatorCard({
  onClickSound,
}: {
  onClickSound?: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<{
    ownership: number;
    tail: number;
  } | null>(null);
  const [key, setKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount.trim()) return;
    onClickSound?.();

    const ownership =
      Math.floor(Math.random() * 14) + 2;
    const tail =
      Math.round((Math.random() * 4.9 + 0.1) * 10) / 10;

    setResult({ ownership, tail });
    setKey((k) => k + 1);
  };

  const handleReset = () => {
    onClickSound?.();
    setAmount("");
    setResult(null);
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🐄</span>
        <h3 className="text-lg font-bangla font-semibold text-gradient-gold leading-tight">
          মালিকানা হিসাব
        </h3>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label
            htmlFor="qurbaniAmount"
            className="text-sm font-bangla"
            style={{ color: "var(--text-secondary)" }}
          >
            💸 তুমি কত টাকা দিছো?
          </label>

          <div className="flex gap-3">
            <input
              id="qurbaniAmount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              autoComplete="off"
              className="glow-input flex-1 rounded-xl px-4 py-3 text-base font-bangla outline-none"
              style={{
                background: "rgba(3,7,18,0.7)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
              }}
            />
            <motion.button
              type="submit"
              disabled={!amount.trim()}
              className="btn-gold px-5 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={{ scale: amount.trim() ? 1.04 : 1 }}
              whileTap={{ scale: amount.trim() ? 0.97 : 1 }}
            >
              <Calculator size={16} />
              <span className="font-bangla font-semibold text-sm">হিসাব করো</span>
            </motion.button>
          </div>
        </form>

        {/* Result */}
        <div className="flex-1 flex items-center justify-center mt-5 min-h-[100px]">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={key}
                className="w-full flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  damping: 14,
                  stiffness: 250,
                }}
              >
                {/* Ownership percentage — big number */}
                <motion.div
                  className="w-full text-center py-4 rounded-xl"
                  style={{
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.15)",
                  }}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 300,
                    delay: 0.1,
                  }}
                >
                  {/* Big percentage */}
                  <motion.p
                    className="text-4xl font-bold font-display mb-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #f87171, #fbbf24)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: [0.5, 1.15, 1] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {result.ownership}%
                  </motion.p>
                  <motion.p
                    className="text-sm font-bangla"
                    style={{ color: "var(--text-secondary)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    তুমি আসলে{" "}
                    <span style={{ color: "#fca5a5" }}>
                      {result.ownership}%
                    </span>{" "}
                    গরুর মালিক 😭
                  </motion.p>
                </motion.div>

                {/* Tail ownership */}
                <motion.div
                  className="w-full text-center py-2.5 rounded-lg"
                  style={{
                    background: "rgba(212,168,83,0.06)",
                    border: "1px solid rgba(212,168,83,0.15)",
                  }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <p
                    className="text-xs font-bangla"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    🎉 Bonus: লেজের ownership{" "}
                    <span
                      className="font-bold"
                      style={{ color: "var(--gold-warm)" }}
                    >
                      {result.tail}%
                    </span>
                  </p>
                </motion.div>

                {/* Reset */}
                <motion.button
                  onClick={handleReset}
                  className="text-xs font-bangla cursor-pointer transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  whileHover={{ color: "var(--teal-accent)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  আবার হিসাব করো ↻
                </motion.button>
              </motion.div>
            ) : (
              <motion.p
                key="placeholder"
                className="text-sm font-bangla text-center"
                style={{ color: "var(--text-secondary)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
              >
                তোমার টাকা দাও, আমরা হিসাব করি! 🧮
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
