# ⚡ Bounce, Zoom & Float — Interactive Physics & Forces Explorer

An interactive, kid-friendly physics playground web application built for curious 5-year-olds who love animals! Explore **6 illustrated Physics Zones** and **42 discoverable physics wonders** with concrete cause-and-effect explanations (zero equations!), a **🐾 Animal Physics Pro** comparison on every card, **🧪 Try This at Home!** experiments, **3 interactive mini-playgrounds**, bundled real photography, and pre-generated **Kokoro-82M Studio Voiceovers**.

## ✨ Features

- **🗺️ Physics World Map Mode:** Pan and zoom across an illustrated Science Playground featuring **6 Physics Zones** and **42 wonders**:
  1. **🍎 Gravity & Falling** (Why we stick to Earth, feathers vs. bowling balls, bouncy balls, roller coasters, parachutes, swings, trampolines)
  2. **🏎️ Speed, Momentum & Traction** (Fast vs. slow zoom, heavy trains, grippy tires, bowling pins, shock absorbers, spinning tops, balloon rockets)
  3. **⛸️ Friction & Sliding** (Slippery ice, fuzzy carpet vs. wood, grass & sand, bike brakes, sled hills, friction warmth, soapy slides)
  4. **⛵ Sink or Float — Buoyancy** (Giant floating ships, sinking pebbles, diving submarines, rising air bubbles, floaties, salty ocean lift, icebergs)
  5. **🧲 Magnetism & Invisible Pulls** (Attract & repel poles, compasses, floating maglev trains, fridge magnets, crane electromagnets, Earth's magnetic shield, snap trains)
  6. **⚙️ Simple Machines** (Ramps & slides, seesaw levers, rope pulleys, wheels & axles, interlocking gears, twisty screws, splitting wedges)
- **🐾 Animal Physics Pro on Every Wonder:** Connects every physics concept to an amazing animal (e.g., cheetah traction & tail rudder, penguins belly-sledding on ice, mallard ducks trapping air in oily feathers, woodpeckers absorbing shock, planthopper bugs with real interlocking leg gears!).
- **🧪 Try This at Home!:** Every card includes a 1-sentence household experiment using everyday toys and objects.
- **🃏 Wonder Cards Carousel Mode:** Full-screen touch-friendly picture carousel with zone filters, Shuffle, swipe & keyboard navigation (`←` / `→` / `Enter`), and tap-to-jump onto the map with narration.
- **🎮 Play Lab — 3 Zero-Text-Required Interactive Mini-Playgrounds:**
  - **🏎️ Ramp & Friction Racer:** Pick a racer, surface (Ice, Wood, Carpet, Mud), and ramp height, then launch to watch gravity and friction in action.
  - **⛵ Sink or Float Tub:** Drop 10 everyday objects and animals into animated water with splashes, bubbles, and voice explanations.
  - **🧲 Magnet Tester:** Drag a giant N/S bar magnet around 10 objects (and flip poles!) to see metal stick, opposite/matching magnets attract or repel, and non-metals stay put.
- **🔊 Pre-Generated Studio Voiceovers + Read-Aloud Mode:**
  - All **48 narrations** (6 Physics Zones + 42 Physics Wonders) are pre-generated locally with **Kokoro-82M** as compact `.m4a` clips in `public/audio/` with graceful Web Speech API fallback.
  - Includes **Auto-Read ON/OFF**, **Play / Pause / Stop**, **🎙️ Tour All**, 3 speed presets (`🐢 Slow` / `🦊 Normal` / `⚡ Fast`), live speaking banner, and tap-to-hear cards & facts.
- **⭐ Discovery Tools:** **🔍 Search** (by force, wonder, or animal), **🎲 Surprise Me!**, **Bottom Quick-Jump Bar**, **Big Photo Fullscreen Lightbox**, and **⭐ Physics Explorer Passport** (saved in `localStorage`).

---

## 🛠️ Setup & Local Execution

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ and `npm`

### 1. Install Dependencies
```bash
cd /Users/madhu/adyu-projects/force-lab-explorer
npm install
```

### 2. Run Locally (Development Server)
```bash
npm run dev
```
Open the local URL printed in the terminal (typically `http://localhost:5173`) in your browser.

### 3. Re-Fetch Wonder Photos (Optional)
All 42 optimized photos are bundled in `public/images/wonders/`. To download photos for any newly added wonders:
```bash
python3 scripts/fetch_physics_photos.py
```

### 4. Pre-Generate Studio Voiceovers (Optional — Zero Runtime API Calls)
All 48 studio voiceovers (6 zones + 42 wonders) are pre-generated with **Kokoro-82M** (`voice=af_heart`, `speed=0.86`) in `public/audio/` with `public/audio/manifest.json`. To regenerate or add clips for new wonders:
```bash
uv venv /tmp/kokoro-venv --python 3.12
uv pip install --python /tmp/kokoro-venv/bin/python kokoro-onnx soundfile
mkdir -p /tmp/kokoro-models
curl -sL "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx" -o /tmp/kokoro-models/kokoro-v1.0.onnx
curl -sL "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin" -o /tmp/kokoro-models/voices-v1.0.bin
/tmp/kokoro-venv/bin/python scripts/generate_kokoro_voiceovers.py --workers 4 --threads 2
```
The script skips existing clips by default (use `--force` to regenerate) and updates `public/audio/manifest.json` automatically.

### 5. Build for Production (Standalone Static Website)
```bash
npm run build
```
Outputs a standalone static bundle in `dist/`. Preview it locally with:
```bash
npm run preview
```

---

## 🚀 GitHub Pages Deployment

This project uses `base: './'` in `vite.config.ts` and includes `.github/workflows/deploy.yml`, which automatically builds and deploys `dist/` to **GitHub Pages** on every push to `main` (or via manual `workflow_dispatch`).

Live site: `https://gpop4.github.io/force-lab-explorer/`

---

## 🧹 Clean Up

To remove build outputs and installed dependencies locally:
```bash
rm -rf /Users/madhu/adyu-projects/force-lab-explorer/dist /Users/madhu/adyu-projects/force-lab-explorer/node_modules
```

To reset saved Physics Explorer Passport stamps in the browser, click **Reset Stamps** inside the Passport modal or clear `localStorage` for the site.
