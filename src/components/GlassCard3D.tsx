"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ══════════════════════════════════════════════
   GlassCard3D
   Wrapper that adds:
   • 3D perspective tilt on hover
   • Mouse-tracking radial spotlight glow
   • Smooth scale lift
   ══════════════════════════════════════════════ */
export default function GlassCard3D({
  children,
  className = "",
  onHoverSound,
}: {
  children: React.ReactNode;
  className?: string;
  onHoverSound?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  /* ── Sprung tilt values (degrees) ── */
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Tilt: ±6 degrees
      rotateX.set((y - 0.5) * -12);
      rotateY.set((x - 0.5) * 12);

      // Spotlight position
      setSpotPos({ x: x * 100, y: y * 100 });
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHoverSound?.();
  }, [onHoverSound]);

  return (
    <motion.div
      ref={cardRef}
      className={`${className}`}
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* 3D tilting inner */}
      <motion.div
        className="glass-card relative h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Mouse spotlight overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[1.25rem] z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(
              400px circle at ${spotPos.x}% ${spotPos.y}%,
              rgba(45, 212, 191, 0.1) 0%,
              rgba(212, 168, 83, 0.05) 35%,
              transparent 70%
            )`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Card content (above spotlight) */}
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </motion.div>
  );
}
