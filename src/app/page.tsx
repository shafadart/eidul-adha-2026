"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Heart, Users, Crown } from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";
import CrescentMoon from "@/components/CrescentMoon";
import EasterEggToast from "@/components/EasterEggToast";
import useSoundEffects from "@/hooks/useSoundEffects";
import confetti from "canvas-confetti";

/* ══════════════════════════════════════════════
   Scene Definition
   0: Welcome / Name Gate (Intro)
   1: Personalized Greeting (Cinematic presentation)
   2: Epic Animal Reveal (interactive game UI)
   3: Family Chaos (Tap-to-Next Cinematic Story)
   4: Emotional Dua (Spiritual climax)
   ══════════════════════════════════════════════ */
type Scene = 0 | 1 | 2 | 3 | 4;

type EasterEggType = "single" | "vip" | "admin" | null;

function detectEasterEgg(name: string): EasterEggType {
  const n = name.trim().toLowerCase();
  if (n === "single" || n === "sakib") return "single";
  if (n === "shafa") return "vip";
  if (n === "admin") return "admin";
  return null;
}

function getEasterEggMessage(type: EasterEggType): string {
  switch (type) {
    case "single":
      return "Single detected 💔 এই ঈদে শুধু গরুই কুরবানি হচ্ছে না 😭";
    case "admin":
      return "Admin panel locked. Go slice some meat! 🔪";
    case "vip":
      return "👑 VIP access granted — স্বাগতম, Shafa!";
    default:
      return "";
  }
}

const ANIMALS = [
  { name: "Legendary Deshi Goat 🐐", emoji: "🐐", desc: "গতি এবং নাটকীয়তায় ভরপুর! সহজে ধরা দেয় না।", sound: "goat" },
  { name: "Sigma Goru 🐂", emoji: "🐂", desc: "শীতল মেজাজ, কিন্তু রেগে গেলে পুরো পাড়া কুপোকাত!", sound: "cow" },
  { name: "VIP Khassi 👑", emoji: "👑", desc: "ঈদের সবচেয়ে দামি এবং আলিশান কুরবানি।", sound: "goat" },
  { name: "Village Boss Bull 🐃", emoji: "🐃", desc: "বিশাল বপু এবং দানবীয় ক্ষমতার অধিকারী বস!", sound: "cow" },
  { name: "Emotional Bokri 🥺", emoji: "🥺", desc: "সারাক্ষণ করুণ চোখে চেয়ে আবেগঘন পরিবেশ তৈরি করে।", sound: "goat" },
];

const familyDialogues = [
  { text: "এই নামাজ পড়ে বাড়ি চলি গেছিস কেন কুরবানী দিতি হবে না?", audio: "/sounds/s1.mp3" },
  { text: "এই হুজুর আপনি কোনে", audio: "/sounds/s2.mp3" },
  { text: "এই গরু ওরাম করে ধরে গরু ভালো করে ধর, দোর মারছে কি জন্নি", audio: "/sounds/s3.mp3" },
  { text: "এই কতক্ষণ ধরে ছুরি চাচ্ছি ছুরি কনে ছুরি নিয়ে এসো", audio: "/sounds/s4.mp3" },
  { text: "এই তুই ফোন টিপছিস কেন গরু ধরতে পারছিস না ফোন থো", audio: "/sounds/s5.mp3" },
  { text: "এই তুমি এখন গোশ নিতি এইছো ক্যা তোমার কি কোনো কমনসেন্স নাই", audio: "/sounds/s6.mp3" },
  { text: "ঐরম করি ঝোরে,, ঐরম করি ঝোরে ছিলেপিলে মোবাইল টিপেই কুল পায় না দে আমার কাছে দে আমি ঝুইরে দেখাচ্ছি দে", audio: "/sounds/s7.mp3" },
  { text: "শালারা কারেন্ট বন্ধ করার টাইম পাইনি,, এই কারেন্ট বন্ধ করিছিস কিডা ফ্যান চলবে না,,, কুরবানীর দিন কেউ কারেন্ট বন্ধ করে ???", audio: "/sounds/s8.mp3" },
  { text: "সুজা বারি মারো সুজা এরাম কইরা থ্যাত লাচ্ছো কি জন্যি???", audio: "/sounds/s9.mp3" },
  { text: "হ দিবানে দিবানে তোমার বাড়ি ভুরি দিবানে", audio: "/sounds/s10.mp3" },
  { text: "আমি আমার মাথার গোস্ত খেয়ে হচ্ছে না আমার মাথার গোস্ত তোমার বাপের বাড়ি দেয়া লাগবে", audio: "/sounds/s11.mp3" },
  { text: "নতুন জামা পরে কেউ আসে এই নতুন জামা কাপড় খুলে আয় যা", audio: "/sounds/s12.mp3" },
  { text: "হাট একদম চুপ", audio: "/sounds/s13.mp3" },
  { text: "দুইশো টাকায় কোনো চামড়া হয় না বুঝতে পেরেছো ওই তা তোমার তোমার নিয়া লাগবে না তুমি যাও তুমি যাও আমি আমি ওই চামড়া দিয়ে আমি কম্বল বানাবো", audio: "/sounds/s14.mp3" },
  { text: "এই তোমরা এখনো ভিডিও দেখছো কি জন্যি ??? বাপে যে হেল্প করতে পারছো না আর মেয়েরা যে ভুঁড়ি সাফ করো গে যাও....", audio: "/sounds/s15.mp3" }
];

/* ──────────────────────────────────────────────
   Typewriter-style text reveal
   ────────────────────────────────────────────── */
function TypewriterText({
  text,
  className,
  onComplete,
  speed = 60,
}: {
  text: string;
  className?: string;
  onComplete?: () => void;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        className="inline-block w-[2px] h-[1em] ml-1 align-middle"
        style={{ background: "var(--teal-accent)" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  );
}

/* ──────────────────────────────────────────────
   Floating Spiritual Stars for Dua Scene
   ────────────────────────────────────────────── */
function FloatingGoldParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; dur: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 300,
        size: Math.random() * 6 + 3,
        delay: Math.random() * 4,
        dur: Math.random() * 5 + 4,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${p.x}px)`,
            bottom: `-20px`,
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? "rgba(212, 168, 83, 0.4)" : "rgba(45, 212, 191, 0.3)",
            filter: "blur(1px)",
          }}
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
            y: [-p.y - 100],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   PAGE COMPONENT
   ────────────────────────────────────────────── */
export default function Home() {
  const [scene, setScene] = useState<Scene>(0);
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [easterEgg, setEasterEgg] = useState<EasterEggType>(null);
  const [showToast, setShowToast] = useState(false);

  // Appearance Theme state
  const [theme, setTheme] = useState<"dark" | "evening">("dark");

  // Particle Star Trail state
  const [trail, setTrail] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const trailIdRef = useRef(0);
  const lastSpawnRef = useRef({ x: 0, y: 0 });

  // Animal Reveal states
  const [revealState, setRevealState] = useState<"idle" | "analyzing" | "unlocked">("idle");
  const [selectedAnimal, setSelectedAnimal] = useState<(typeof ANIMALS)[0] | null>(null);
  const [animalStats, setAnimalStats] = useState<number[]>([0, 0, 0]);

  // Family Chaos states
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Audio Hooks
  const {
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
  } = useSoundEffects();

  // Mouse Glow Movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, (v) => `${v}px`);
  const glowY = useTransform(mouseY, (v) => `${v}px`);

  // spawn star trail particle
  const spawnParticle = useCallback((x: number, y: number) => {
    const dist = Math.hypot(x - lastSpawnRef.current.x, y - lastSpawnRef.current.y);
    if (dist < 10) return; // spawn particle every 10px of movement
    lastSpawnRef.current = { x, y };

    const newParticle = {
      id: trailIdRef.current++,
      x,
      y,
      size: Math.random() * 8 + 6,
    };

    setTrail((prev) => {
      const filtered = prev.slice(-14); // Keep maximum 15 particles for performance
      return [...filtered, newParticle];
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    mouseX.set(x);
    mouseY.set(y);
    spawnParticle(x, y);
  }, [mouseX, mouseY, spawnParticle]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      spawnParticle(x, y);
    }
  }, [spawnParticle]);

  // Framer Motion Scene Transition Variants
  const sceneVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05, filter: "blur(12px)" },
  };

  const sceneTransition = {
    duration: 0.3,
    ease: "easeOut",
  } as const;

  /* ── Submit Handler (Scene 0 → Scene 1) ── */
  const handleSubmitName = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    // Trigger explosive audio combination
    playClick();
    playWhoosh();
    playFireworks();

    // Trigger double corner fireworks explosion
    const colors = ["#10b981", "#fbbf24", "#ffffff"];
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { x: 0, y: 1 },
      colors,
      angle: 60,
    });
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { x: 1, y: 1 },
      colors,
      angle: 120,
    });

    setSubmittedName(trimmed);
    const egg = detectEasterEgg(trimmed);
    setEasterEgg(egg);

    if (egg) {
      if (egg === "single") {
        playVineBoom();
      }
      setShowToast(true);
    }

    setScene(1);
  }, [name, playClick, playWhoosh, playFireworks, playVineBoom]);

  /* ── Start Experience (Scene 1 → Scene 2) ── */
  const handleBeginExperience = useCallback(() => {
    playWhoosh();
    startAmbient(); // Loops atmospheric bg audio
    setScene(2);
  }, [playWhoosh, startAmbient]);

  /* ── Reveal Animal (Scene 2) ── */
  const handleRevealAnimal = useCallback(() => {
    playClick();
    setRevealState("analyzing");

    setTimeout(() => {
      const picked = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      // Generate unique stats on the fly
      const stats = [
        Math.floor(Math.random() * 25) + 75, // Eating
        Math.floor(Math.random() * 25) + 75, // Escaping
        Math.floor(Math.random() * 25) + 75, // Drama
      ];

      setSelectedAnimal(picked);
      setAnimalStats(stats);
      setRevealState("unlocked");
      playWhoosh();
      
      // Play exact animal sound
      if (picked.sound === "goat") {
        playGoat();
      } else {
        playCow();
      }
    }, 1200);
  }, [playClick, playWhoosh, playGoat, playCow]);

  // Chat auto-scroll reference
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ── Play Dialogue Audio ── */
  const playDialogueAudio = useCallback((index: number) => {
    if (index < 0 || index >= familyDialogues.length) return;

    // Stop previous audio immediately
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }

    const currentAudioPath = familyDialogues[index].audio;
    const audio = new Audio(encodeURI(currentAudioPath));
    activeAudioRef.current = audio;

    audio.play().catch((err) => {
      console.log("Audio play blocked by browser autoplay policy:", err);
    });
  }, []);

  /* ── Advance Dialogue ── */
  const handleDialogueNext = useCallback(() => {
    if (currentDialogueIndex >= familyDialogues.length - 1) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }
      playClick();
      setCurrentDialogueIndex(familyDialogues.length);
      return;
    }

    const nextIndex = currentDialogueIndex + 1;
    setCurrentDialogueIndex(nextIndex);
    playDialogueAudio(nextIndex);
  }, [currentDialogueIndex, playDialogueAudio, playClick]);

  /* ── Previous Dialogue ── */
  const handleDialoguePrev = useCallback(() => {
    if (currentDialogueIndex <= 0) return;

    const prevIndex = currentDialogueIndex - 1;
    setCurrentDialogueIndex(prevIndex);
    playDialogueAudio(prevIndex);
  }, [currentDialogueIndex, playDialogueAudio]);

  // Handle automatic scrolling to the bottom of the chat thread
  useEffect(() => {
    if (scene === 3) {
      const timer = setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentDialogueIndex, scene]);

  /* ── Reset / Replay Journey ── */
  const handleReplay = useCallback(() => {
    playClick();
    stopDua(); // Stops final dua audio loop
    stopBg(); // Stops regular ambient audio
    
    // Stop any dialogue audio ref
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }

    // Reset all internal states
    setName("");
    setSubmittedName("");
    setEasterEgg(null);
    setShowToast(false);
    setRevealState("idle");
    setSelectedAnimal(null);
    setAnimalStats([0, 0, 0]);
    setCurrentDialogueIndex(0);
    
    setScene(0);
  }, [playClick, stopDua, stopBg]);

  // Handle final Scene 4 spiritual audio loop trigger
  useEffect(() => {
    if (scene === 4) {
      stopBg();
      playDua();
    }
  }, [scene, playDua, stopBg]);

  const isVIP = easterEgg === "vip";

  return (
    <main
      className={`relative min-h-screen bg-[var(--bg-primary)] overflow-hidden flex flex-col items-center justify-center p-4 text-[var(--text-primary)] transition-all duration-1000 ${
        theme === "evening" ? "evening-mode" : ""
      } md:cursor-none`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Global Theme Toggle */}
      <motion.button
        onClick={() => {
          playClick();
          setTheme((prev) => (prev === "dark" ? "evening" : "dark"));
        }}
        className="absolute top-4 right-4 z-40 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer glass-panel shadow-md border border-white/10 hover:brightness-110"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        title={theme === "dark" ? "Evening Mode" : "Night Mode"}
      >
        <span className="text-lg">{theme === "dark" ? "🌇" : "🌙"}</span>
      </motion.button>

      {/* Global Immersive Background & Particles */}
      <AmbientBackground theme={theme} />

      {/* Custom Moon Cursor (Desktop only) */}
      <motion.div
        className="pointer-events-none fixed z-50 hidden md:flex items-center justify-center"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          filter: "drop-shadow(0 0 8px rgba(251,191,36,0.7))",
        }}
      >
        <span className="text-xl select-none">🌙</span>
      </motion.div>

      {/* Sparkling Star Trail (Desktop + Mobile) */}
      <AnimatePresence>
        {trail.map((p) => (
          <motion.span
            key={p.id}
            className="pointer-events-none fixed z-50 font-display text-amber-300 font-bold select-none text-[var(--gold-glow)]"
            style={{
              left: p.x,
              top: p.y,
              fontSize: p.size,
              x: "-50%",
              y: "-50%",
              filter: "drop-shadow(0 0 5px rgba(251,191,36,0.85))",
            }}
            initial={{ opacity: 1, scale: 0.15, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 1.3,
              y: p.y + (Math.random() * 40 - 20),
              x: p.x + (Math.random() * 40 - 20),
              rotate: Math.random() * 180 - 90,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            ✦
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Interactive cursor glow */}
      <motion.div
        className="pointer-events-none fixed z-10 rounded-full"
        style={{
          left: glowX,
          top: glowY,
          width: 380,
          height: 380,
          x: -190,
          y: -190,
          background: theme === "evening"
            ? "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(45,212,191,0.05) 0%, rgba(212,168,83,0.02) 50%, transparent 75%)",
          filter: "blur(20px)",
        }}
      />

      {/* Global Easter Egg Toast overlay */}
      <AnimatePresence>
        {showToast && easterEgg && (
          <EasterEggToast
            message={getEasterEggMessage(easterEgg)}
            type={easterEgg}
            onDismiss={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      {/* SCENE STATE MACHINE Orchestration */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* ══════════════════════════════════════════
              SCENE 0: Welcome / Name input Gate
              ══════════════════════════════════════════ */}
          {scene === 0 && (
            <motion.div
              key="scene-welcome"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sceneTransition}
              className="flex flex-col items-center text-center gap-8 w-full max-w-md"
            >
              <div className="relative pointer-events-none">
                <CrescentMoon />
              </div>

              <div className="flex flex-col gap-5 w-full">
                <h1 className="text-3xl md:text-4xl font-display font-bold leading-snug tracking-wide text-gradient-gold">
                  কুরবানি ঈদ জার্নি ২০২৬
                </h1>
                
                <p className="text-sm font-bangla opacity-70 leading-relaxed px-4">
                  এক অভিনব উৎসবমুখর সিনেমেটিক পথযাত্রা। শুরু করতে নিচে আপনার নামটি লিখুন।
                </p>

                <form onSubmit={handleSubmitName} className="glass-panel p-6 flex flex-col gap-5 w-full">
                  <div className="flex flex-col gap-2.5 text-left">
                    <label htmlFor="nameGate" className="text-xs font-bangla font-semibold opacity-70 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-400" />
                      আপনার নাম দিন
                    </label>
                    <input
                      ref={inputRef}
                      id="nameGate"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        playClick();
                      }}
                      onMouseEnter={playHover}
                      onFocus={playHover}
                      placeholder="যেমন: শাফায়াত"
                      autoComplete="off"
                      className="glow-input w-full rounded-xl px-5 py-4 text-base font-bangla outline-none bg-black/60 border border-white/10"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!name.trim()}
                    className="glow-button w-full rounded-xl py-4 font-bangla font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, var(--emerald-rich), var(--emerald-deep))",
                      border: "1px solid rgba(45, 212, 191, 0.3)",
                    }}
                    whileHover={{ scale: name.trim() ? 1.03 : 1 }}
                    whileTap={{ scale: name.trim() ? 0.97 : 1 }}
                    onMouseEnter={() => name.trim() && playHover()}
                  >
                    যাত্রার সূচনা হোক
                    <ArrowRight size={18} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              SCENE 1: Cinematic Personalized Greeting
              ══════════════════════════════════════════ */}
          {scene === 1 && (
            <motion.div
              key="scene-greeting"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sceneTransition}
              className="flex flex-col items-center text-center gap-8 w-full max-w-2xl px-4 py-8"
            >
              {isVIP && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 10, delay: 0.4 }}
                >
                  <Crown size={64} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                </motion.div>
              )}

              <div className="flex flex-col gap-6">
                <motion.h1
                  className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-none text-gradient-gold"
                  style={{ textShadow: "0 0 40px rgba(212,168,83,0.15)" }}
                >
                  {submittedName}... 🌙
                </motion.h1>

                <h2 className="text-3xl md:text-5xl font-display font-bold leading-normal">
                  <TypewriterText text="Eid-ul-Adha Mubarak ✨" speed={65} />
                </h2>

                <motion.p
                  className="text-lg font-bangla opacity-80 max-w-md mx-auto leading-relaxed mt-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 1 }}
                >
                  আজ তোমার জন্য কিছু বিশেষ জিনিস অপেক্ষা করছে...
                </motion.p>

                <motion.button
                  onClick={handleBeginExperience}
                  className="btn-explore font-bangla font-extrabold py-5 px-10 rounded-full shadow-2xl cursor-pointer self-center mt-6 flex items-center gap-2.5 text-base relative"
                  style={{
                    background: "linear-gradient(135deg, var(--gold-glow), var(--gold-warm))",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    boxShadow: "0 0 30px rgba(212, 168, 83, 0.25)",
                    color: "rgba(3, 7, 18, 0.95)"
                  }}
                  animate={{
                    boxShadow: ["0 0 20px rgba(212,168,83,0.2)", "0 0 40px rgba(212,168,83,0.5)", "0 0 20px rgba(212,168,83,0.2)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={playHover}
                >
                  Begin Journey ✨
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              SCENE 2: The Epic Animal Reveal
              ══════════════════════════════════════════ */}
          {scene === 2 && (
            <motion.div
              key="scene-reveal"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sceneTransition}
              className="w-full max-w-xl flex flex-col items-center py-6 px-4"
            >
              <h2 className="text-xs font-semibold tracking-widest text-[#d4a853] uppercase mb-4 opacity-75 font-display flex items-center gap-2">
                <Sparkles size={12} />
                EPISODE 01: MYSTICAL RITUALS
              </h2>

              <div className="glass-panel p-8 md:p-10 w-full text-center flex flex-col items-center justify-center relative min-h-[360px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                
                {/* 1. IDLE STATE: Reveal fate button */}
                {revealState === "idle" && (
                  <motion.div
                    key="reveal-idle"
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-base font-bangla opacity-85 leading-relaxed">
                      ঈদের প্রধান চমক! আপনার কুরবানির সেই বিশেষ পশুর রহস্য উন্মোচন করতে প্রস্তুত হোন।
                    </p>
                    <motion.button
                      onClick={handleRevealAnimal}
                      className="btn-gold py-5 px-10 rounded-full font-bangla font-extrabold text-base cursor-pointer shadow-lg relative flex items-center gap-2 self-center mt-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onMouseEnter={playHover}
                    >
                      Reveal My Fate 🐐
                    </motion.button>
                  </motion.div>
                )}

                {/* 2. LOADING STATE: Analyzing */}
                {revealState === "analyzing" && (
                  <motion.div
                    key="reveal-analyzing"
                    className="flex flex-col items-center justify-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={42} className="text-[#d4a853]" />
                    </motion.div>
                    <p className="text-base font-bangla font-semibold text-gradient-gold">
                      পশুর শক্তি ও স্বভাব বিশ্লেষণ করা হচ্ছে...
                    </p>
                  </motion.div>
                )}

                {/* 3. REVEALED STATE: Complete game card */}
                {revealState === "unlocked" && selectedAnimal && (
                  <motion.div
                    key="reveal-unlocked"
                    className="flex flex-col gap-6 w-full text-left"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <div className="text-center w-full mb-2">
                      <motion.span
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-400 font-display uppercase"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⚡ LEGENDARY QURBANI UNLOCKED ⚡
                      </motion.span>
                    </div>

                    <div className="flex items-center gap-5 justify-center py-4 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
                      <span className="text-5xl">{selectedAnimal.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold font-bangla text-gradient-gold">
                          {selectedAnimal.name}
                        </h3>
                        <p className="text-xs opacity-75 font-bangla mt-1 max-w-[280px]">
                          {selectedAnimal.desc}
                        </p>
                      </div>
                    </div>

                    {/* Stats details filled dynamically */}
                    <div className="flex flex-col gap-3.5 mt-2">
                      <StatBarLabel label="🌿 Eating Power" value={animalStats[0]} delay={0.2} />
                      <StatBarLabel label="🏃 Escaping Skill" value={animalStats[1]} delay={0.4} />
                      <StatBarLabel label="🎭 Drama Level" value={animalStats[2]} delay={0.6} />
                    </div>

                    <motion.button
                      onClick={() => {
                        playClick();
                        setScene(3);
                        setCurrentDialogueIndex(0);
                        setTimeout(() => {
                          playDialogueAudio(0);
                        }, 50);
                      }}
                      className="btn-teal py-4 px-8 rounded-xl font-bangla font-bold text-sm cursor-pointer shadow-lg mt-4 flex items-center justify-center gap-1.5 self-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onMouseEnter={playHover}
                    >
                      Continue Journey ➡️
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              SCENE 3: The Family Chaos (Tap-to-Next Cinematic Story)
              ══════════════════════════════════════════ */}
          {scene === 3 && (
            <motion.div
              key="scene-chaos"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sceneTransition}
              className="w-full max-w-2xl flex flex-col items-center py-4 px-4"
            >
              <h2 className="text-xs font-semibold tracking-widest text-[#2dd4bf] uppercase mb-4 opacity-75 font-display flex items-center gap-2">
                <Users size={12} />
                EPISODE 02: BABA'S ANGRY CHAOS
              </h2>

              <div
                onClick={handleDialogueNext}
                className="glass-panel p-6 md:p-8 w-full relative min-h-[460px] flex flex-col items-center justify-start border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl bg-black/40 cursor-pointer select-none rounded-3xl"
              >
                {/* Chat Top Header */}
                <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full bg-rose-500/10 border border-rose-500/35 flex items-center justify-center text-xl font-bold">
                      👨‍🦳
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-black animate-pulse" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bangla font-bold tracking-wide text-rose-400">
                        রাগী আব্বা 😡
                      </h3>
                      <p className="text-xxs font-display text-emerald-400 font-semibold opacity-90 flex items-center gap-1">
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="text-xxs font-display font-medium text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    ঈদের দিন বাপ সমাজ 😵💫
                  </div>
                </div>

                {/* Active Dialogues loop */}
                {currentDialogueIndex < familyDialogues.length ? (
                  <div className="flex-1 flex flex-col justify-between w-full py-2 gap-4">
                    {/* Scrollable chat body */}
                    <div className="w-full h-[340px] max-h-[340px] overflow-y-auto pr-1 pb-10 flex flex-col gap-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-emerald-500/20 [&::-webkit-scrollbar-thumb]:rounded-full scroll-smooth">
                      <AnimatePresence initial={false}>
                        {familyDialogues.slice(0, currentDialogueIndex + 1).map((item, idx) => {
                          const isLast = idx === currentDialogueIndex;
                          return (
                            <motion.div
                              key={`chat-bubble-${idx}`}
                              className={`w-full max-w-[85%] rounded-2xl rounded-tl-none p-5 relative transition-all duration-500 text-left ${
                                isLast
                                  ? "bg-white/10 backdrop-blur-xl"
                                  : "bg-white/5 backdrop-blur-sm opacity-45 scale-[0.98] select-none"
                              }`}
                              style={
                                isLast
                                  ? {
                                      border: "1px solid rgba(239, 68, 68, 0.4)",
                                      boxShadow: "0 0 25px rgba(239, 68, 68, 0.18)",
                                    }
                                  : {
                                      border: "1px solid rgba(255, 255, 255, 0.05)",
                                    }
                              }
                              initial={isLast ? { opacity: 0, y: 35, scale: 0.92 } : {}}
                              animate={
                                isLast
                                  ? {
                                      opacity: 1,
                                      y: 0,
                                      scale: 1,
                                      rotate: [-1.2, 1.2, -0.8, 0.8, -0.4, 0.4, 0],
                                    }
                                  : { opacity: 0.45, scale: 0.98, y: 0 }
                              }
                              transition={{
                                default: {
                                  type: "spring",
                                  stiffness: 220,
                                  damping: 18,
                                },
                                rotate: {
                                    type: "keyframes",
                                    duration: 0.55,
                                    ease: "easeInOut",
                                },
                              }}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <p
                                    className={`font-bangla leading-relaxed font-bold transition-all duration-500 ${
                                      isLast
                                        ? "text-lg md:text-xl text-slate-100 drop-shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                                        : "text-sm text-slate-300"
                                    }`}
                                  >
                                    &ldquo;{item.text}&rdquo;
                                  </p>
                                </div>

                                {isLast && (
                                  /* Voice Note Audio Wave for current message */
                                  <div className="flex items-center gap-1.5 shrink-0 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full select-none">
                                    <span className="text-sm">🎤</span>
                                    <div className="flex items-end gap-0.5 h-3">
                                      <motion.span
                                        className="w-[2px] h-2 bg-rose-400 rounded-full"
                                        animate={{ scaleY: [1, 2.4, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                        style={{ originY: 1 }}
                                      />
                                      <motion.span
                                        className="w-[2px] h-3.5 bg-rose-400 rounded-full"
                                        animate={{ scaleY: [1, 1.8, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                                        style={{ originY: 1 }}
                                      />
                                      <motion.span
                                        className="w-[2px] h-2.5 bg-rose-400 rounded-full"
                                        animate={{ scaleY: [1, 2.7, 1] }}
                                        transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }}
                                        style={{ originY: 1 }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Bubble time / progress label */}
                              <div className="mt-3.5 flex justify-between items-center text-slate-400 text-xxs font-display opacity-60">
                                <span>আব্বা • Voice {idx + 1}</span>
                                <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      <div ref={chatEndRef} className="h-8 shrink-0" />
                    </div>

                    {/* WhatsApp style footer input bar */}
                    <div className="w-full mt-4 flex items-center gap-3 pt-3 border-t border-white/5 shrink-0">
                      {/* Left circular Previous button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent duplicate trigger
                          handleDialoguePrev();
                        }}
                        disabled={currentDialogueIndex === 0}
                        className="h-12 w-12 rounded-full shrink-0 flex items-center justify-center cursor-pointer shadow-lg border border-white/10 bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed"
                        whileHover={{ scale: currentDialogueIndex > 0 ? 1.08 : 1 }}
                        whileTap={{ scale: currentDialogueIndex > 0 ? 0.92 : 1 }}
                        onMouseEnter={() => currentDialogueIndex > 0 && playHover()}
                      >
                        <ArrowLeft size={20} className="text-slate-300" />
                      </motion.button>

                      <div className="flex-1 bg-black/50 border border-white/10 rounded-full py-3 px-5 flex items-center justify-between text-xs font-bangla text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="text-lg opacity-85">🤪</span>
                          <span className="animate-pulse">
                            {currentDialogueIndex === familyDialogues.length - 1
                              ? "আব্বা রেকর্ডিং শেষ করছেন... 🤫"
                              : "আব্বা পরবর্তী ধমক দেওয়ার জন্য রেডি... 🔥"}
                          </span>
                        </div>
                        <span className="opacity-60 text-xxs tracking-wider uppercase font-display hidden md:block">
                          Chat Mode
                        </span>
                      </div>

                      {/* WhatsApp-like pulsing send green button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent duplicate trigger
                          handleDialogueNext();
                        }}
                        className="h-12 w-12 rounded-full shrink-0 flex items-center justify-center cursor-pointer shadow-lg border border-emerald-500/30"
                        style={{
                          background: "linear-gradient(135deg, var(--emerald-glow), var(--emerald-deep))",
                          boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onMouseEnter={playHover}
                      >
                        <ArrowRight size={20} className="text-white" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  /* Completed dialogues, show transition to Scene 4 */
                  <motion.div
                    className="flex-1 flex flex-col justify-center items-center gap-6 text-center py-6 w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-lg font-bangla font-medium text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] mb-2">
                      🎉 ঈদের সকালের সব হট্টগোল সফলভাবে কাটিয়ে উঠেছো!
                    </p>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent clicking dialog index trigger
                        playClick();
                        setScene(4);
                      }}
                      className="btn-teal font-bangla font-extrabold py-5 px-10 rounded-full shadow-2xl cursor-pointer self-center text-base flex items-center justify-center gap-2 hover:brightness-110 relative"
                      style={{
                        background: "linear-gradient(135deg, var(--emerald-glow), var(--emerald-deep))",
                        border: "1px solid rgba(45, 212, 191, 0.3)",
                        boxShadow: "0 0 30px rgba(45, 212, 191, 0.3)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onMouseEnter={playHover}
                    >
                      ঈদের দোয়া 🤲
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              SCENE 4: The Emotional Dua (Cinematic Spiritual Ending)
              ══════════════════════════════════════════ */}
          {scene === 4 && (
            <motion.div
              key="scene-dua"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sceneTransition}
              className="w-full max-w-lg flex flex-col items-center py-6 px-4"
            >
              {/* Background gold lighting particles */}
              <FloatingGoldParticles />

              <div className="glass-panel p-8 md:p-12 w-full text-center flex flex-col items-center justify-center relative overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-full mb-6 relative"
                >
                  <Heart size={44} className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)] animate-pulse" />
                </motion.div>

                <motion.h3
                  className="text-2xl font-bold font-bangla text-gradient-gold mb-4 leading-snug"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  আমিন... 🤲
                </motion.h3>

                <motion.p
                  className="text-lg md:text-xl font-bangla leading-relaxed text-slate-100 mb-6 font-medium max-w-sm px-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1.2 }}
                >
                  আল্লাহ তোমার কুরবানী কবুল করুন ও তোমার জীবনে সুখ ও সমৃদ্ধি নিয়ে আসুন।
                </motion.p>

                <motion.div
                  className="flex items-center justify-center gap-2 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 2 }}
                >
                  <span className="block h-px w-14 bg-gradient-to-r from-transparent to-amber-500/50" />
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="block h-px w-14 bg-gradient-to-l from-transparent to-amber-500/50" />
                </motion.div>

                <motion.button
                  onClick={handleReplay}
                  className="text-xs font-bangla cursor-pointer text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-all underline decoration-dotted"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  Replay Journey ↻
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────
   StatBar component (Framer motion spring stats)
   ────────────────────────────────────────────── */
function StatBarLabel({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bangla opacity-80">{label}</span>
        <motion.span
          className="font-bold text-[#d4a853]"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--emerald-glow), var(--gold-warm))",
            boxShadow: "0 0 10px rgba(52,211,153,0.2)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: active ? `${value}%` : "0%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
