# 🌙 Qurbani Eid Experience 2026

An ultra-premium, interactive, and highly cinematic Next.js web application built to celebrate the festive spirit of **Eid-ul-Adha 2026**. Experience a highly theatrical storytelling journey filled with custom audio, animations, particle trails, and interactive states.

---

## 🎬 The Storyline & Scenes

The application operates as a full-screen scene-by-scene interactive state machine:

1. **🚪 Welcome / Name Gate (Scene 0)**:
   - Floating crescent moon and twinkling starfields.
   - Dynamic typewriter name inputs.
   - Interactive hover and click audio controls (`ui-hover.mp3`, `ui-click.mp3`).
   - Triggering the enter button releases a massive confetti celebration and plays synced fireworks sound effects.

2. **🌅 Personalized Greeting (Scene 1)**:
   - Huge cinematic serif typography displaying `"[Name]... 🌙"` in glowing gold gradient overlays.
   - A pulsing gold CTA that starts the immersive background atmospheric audio.

3. **🐐 Epic Animal Reveal (Scene 2)**:
   - Rebuilt as a gamified interface.
   - Analyzer spinner dynamically calculates your animal's properties (*Eating Power*, *Escaping Skill*, *Drama Level*).
   - plays deterministic animal call sounds matching the exact animal unlocked (goat bleats for goats/khassi, cow moos for cows/bulls).

4. **💬 The Family Chaos (Scene 3)**:
   - Formatted as a high-fidelity **WhatsApp Conversational Chat Thread** featuring your angry father on Eid morning.
   - Dialogues display vertically inside iOS glassmorphic bubbles that pop in with 3D keyframe rotation shaking animations (`rotate: [-1.2, 1.2, -0.8, 0.8, -0.4, 0.4, 0]`).
   - Completed messages automatically scale down and fade to `opacity: 0.45` while new ones auto-scroll smoothly into focus.
   - Audio notes (`s1.mp3` through `s15.mp3`) play immediately on transition, with fully functional **Next (Forward)** and **Previous (Rewind)** round buttons.

5. **🕌 Spiritual Ending & Dua (Scene 4)**:
   - A quiet spiritual climax with golden particles rising up the canvas.
   - Looped emotional soundtrack (`emotional-dua.mp3`) and a replay gateway.

---

## 🎨 Creative Aesthetic Upgrades

* **Theme Switcher (Dusk / Night)**: A floating glassmorphic toggle (`🌇` / `🌙`) that dynamically alters global CSS variable mappings to switch between deep dark blue/green space and warm Sunset Twilight tones.
* **Interactive Moon Cursor**: Hides browser cursor and renders a floating glowing crescent moon that follows coordinate coordinates.
* **Magic Star Trail Particles**: Tracks cursor moves on desktop (`mousemove`) and touch drags on mobile (`touchmove`) to spawn glowing golden stars (`✦`) that drift and fade out smoothly at 60fps.
* **100% Responsive Design**: Grid parameters, fonts, spacing, and maximum Heights have been thoroughly refined to provide fluid, high-fidelity responsive formats on smartphones, tablets, and desktop displays.

---

## 🛠️ Technology Stack

- **Core Framework**: [Next.js 14+](https://nextjs.org/)
- **Visual logic & Physics**: [Framer Motion](https://www.framer.com/motion/)
- **Audio Rendering**: [use-sound](https://github.com/joshwcomeau/use-sound) (Howler.js client-side wrappers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Custom Cinematic CSS properties
- **Decorative FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Local Installation & Execution

1. Clone the repository:
   ```bash
   git clone https://github.com/shafadart/eidul-adha.git
   cd eidul-adha
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development Turbopack server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 📜 License

Created with ❤️ by [shafadart](https://github.com/shafadart). Free to use, adapt, and share for Eid celebrations.
