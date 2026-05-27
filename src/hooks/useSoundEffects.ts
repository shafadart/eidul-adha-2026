"use client";

import { useCallback, useRef } from "react";
import useSound from "use-sound";

/* ══════════════════════════════════════════════
   useSoundEffects
   Centralised audio manager for the entire app.
   All sounds are lazy-loaded via use-sound (Howler).
   ══════════════════════════════════════════════ */
export default function useSoundEffects() {
  const bgStarted = useRef(false);

  /* ── Background ambient (looped) ── */
  const [playBg, { stop: stopBg }] = useSound("/sounds/bg-ambient.mp3", {
    volume: 0.2,
    loop: true,
  });

  /* ── UI sounds ── */
  const [playClick] = useSound("/sounds/ui-click.mp3", { volume: 0.35 });
  const [playHover] = useSound("/sounds/ui-hover.mp3", { volume: 0.15 });

  /* ── Transition ── */
  const [playWhoosh] = useSound("/sounds/transition-whoosh.mp3", {
    volume: 0.4,
  });

  /* ── Animal reveal sounds ── */
  const [playGoat] = useSound("/sounds/goat-funny.mp3", { volume: 0.5 });
  const [playCow] = useSound("/sounds/cow-funny.mp3", { volume: 0.5 });

  /* ── Easter egg ── */
  const [playVineBoom] = useSound("/sounds/vine-boom.mp3", { volume: 0.6 });

  /* ── Fireworks sound ── */
  const [playFireworks] = useSound("/sounds/Fireworks.mp3", { volume: 0.55 });

  /* ── Emotional Dua sound ── */
  const [playDua, { stop: stopDua }] = useSound("/sounds/emotional-dua.mp3", {
    volume: 0.35,
    loop: true,
  });

  /* ── Start ambient (call once on first user interaction) ── */
  const startAmbient = useCallback(() => {
    if (!bgStarted.current) {
      bgStarted.current = true;
      playBg();
    }
  }, [playBg]);

  /* ── Random animal sound ── */
  const playAnimalReveal = useCallback(() => {
    if (Math.random() > 0.5) {
      playGoat();
    } else {
      playCow();
    }
  }, [playGoat, playCow]);

  return {
    startAmbient,
    stopBg,
    playClick,
    playHover,
    playWhoosh,
    playAnimalReveal,
    playVineBoom,
    playFireworks,
    playDua,
    stopDua,
    playGoat,
    playCow,
  };
}
