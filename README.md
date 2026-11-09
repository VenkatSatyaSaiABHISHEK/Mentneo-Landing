# MENTNEO — The AI Family Built for Every World

> Premium, dark, glassmorphic landing page for **MENTNEO**, an AI research & development company founded in 2025 across Hyderabad, Kakinada, the United States, and the United Kingdom.

---

## 🌟 Overview & Highlights

- **The AI Character Concept**: Every product is an AI character with its own distinct color identity, personality, voice, and 3D sticker cut-out mascot.
- **Hero Card Fan**: An interactive fan of 7 tilted, bottom-anchored, overlapping character cards. Hover straightens and lifts them; click centers with spring physics; keyboard arrows & touch gestures supported; auto-orbit mode when idle.
- **Micro-Interactions & Floating Props**: Megaphone, chat bubbles, browser window, cursor, condenser mic, and stars with mouse parallax and floating physics.
- **3D Silicon Hero Accent**: Lazy-loaded React Three Fiber (R3F) floating 2.2 mm Neuro HGI chip with metallic chrome reflections and quantum cyan circuitry, with static fallback for mobile.
- **Bento Grid**: 12-column glassmorphic grid with custom hover spotlights and mini animated visuals for all 11 core offerings.
- **Interactive Showcase**: Live duplex voice audio visualizer with realistic latency & emotion badges, paired with an autonomous multi-agent task checklist ticking itself off in real time.
- **Mascot Gallery Marquee**: Smooth infinite scrolling marquee featuring character stickers with expressive witty quotes on hover.
- **Trust Strip**: Global R&D hubs (Hyderabad, Kakinada, US, UK) and air-gapped sovereign deployment credentials with animated counters.
- **Mentlearn Academy**: Glass course cards with curriculum breakdowns and interactive enrollment with celebratory confetti.
- **Final Watermark CTA & Footer**: Faint outlined "MENTNEO" watermark, mascot speech bubble, priority early-access form, and full glass footer.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom Glassmorphic Design Tokens
- **Animations**: Framer Motion + GSAP + CSS Keyframes
- **Smooth Scrolling**: Lenis (`lenis`)
- **3D Accents**: Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Icons**: Lucide React (`lucide-react`)
- **Confetti Micro-actions**: Canvas Confetti (`canvas-confetti`)

---

## 🎨 Design System & Glass Tokens

- **Background**: Near-black `#07070B` with subtle noise grain, faint grid matrix lines, star speckles, and large blurred color blobs (`#8B5CF6`, `#06B6D4`, `#FB7185`) drifting softly in the background.
- **Glassmorphism**:
  - `background: rgba(255, 255, 255, 0.05);`
  - `backdrop-filter: blur(20px) saturate(140%);`
  - `border: 1px solid rgba(255, 255, 255, 0.12);`
  - `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 20px 50px rgba(0, 0, 0, 0.6);`
- **Glow & Sheen**:
  - Dynamic card spotlight that follows the cursor (`--mouse-x`, `--mouse-y`).
  - Diagonal sheen sweep animation across cards on hover.
- **Sticker Mascots**:
  - Thick 4px white outline (`filter: drop-shadow(0 0 0 4px #ffffff) drop-shadow(...)`).
- **Typography**:
  - Bold Sans: **Plus Jakarta Sans**
  - Accent Script: **Caveat** (used for one italic/script accent word per headline)

---

## 📁 Project Structure

```bash
mentneo/
├── public/
│   ├── characters/            # 3D sticker-style character vector assets
│   │   ├── saadhyam.svg       # Voice calling agent (Purple)
│   │   ├── mentneo-chat.svg   # Enterprise chat (Cyan)
│   │   ├── mentneo-voice.svg  # Real-time voice AI (Coral)
│   │   ├── mentneo-search.svg # RAG search engine (Lime)
│   │   ├── mentneo-studio.svg # 4K video creator (Orange)
│   │   ├── mentneo-agents.svg # Autonomous swarms (Blue)
│   │   └── neuro-hgi-chip.svg # 2.2mm silicon wafer (Chrome)
│   └── props/                 # Floating hero props (megaphone, mic, chat, etc.)
├── src/
│   ├── app/
│   │   ├── globals.css        # Glass tokens, shine sheen, grid & animations
│   │   ├── layout.tsx         # Google Fonts (Plus Jakarta Sans & Caveat)
│   │   └── page.tsx           # Assembled page orchestrator
│   ├── components/
│   │   ├── 3d/
│   │   │   └── HeroChip3D.tsx # Three.js / R3F floating chip accent
│   │   ├── sections/
│   │   │   ├── Navbar.tsx     # Floating glass pill navbar
│   │   │   ├── Hero.tsx       # Hero with metallic headline & character fan
│   │   │   ├── CharacterFan.tsx   # Progressive tilt fan with physics
│   │   │   ├── CharacterCard.tsx  # Glass card with sticker artwork & glow
│   │   │   ├── FloatingProps.tsx  # Mouse parallax floating props
│   │   │   ├── Showcase.tsx       # Duplex waveform & agent checklist
│   │   │   ├── BentoGrid.tsx      # 12-column ecosystem bento grid
│   │   │   ├── BentoTile.tsx      # Individual bento cards with cursor spotlight
│   │   │   ├── CharacterMarquee.tsx # Infinite marquee with speech bubbles
│   │   │   ├── TrustStrip.tsx     # Global hubs & animated counters
│   │   │   ├── Mentlearn.tsx      # Course cards & enroll action
│   │   │   └── FooterCTA.tsx      # Watermark text, mascot speech & footer
│   │   └── ui/
│   │       ├── AmbientBackground.tsx # Drift blobs, grid, mouse spotlight
│   │       └── SmoothScrollProvider.tsx # Lenis smooth scroll
│   ├── data/
│   │   ├── characters.ts      # All character metadata, colors & quotes
│   │   └── products.ts        # Bento items, courses, stats, nav links
│   └── lib/
│       └── utils.ts           # Classnames & Tailwind merge utility
```

---

## 🔄 How to Customize & Swap Content

All textual content, colors, and asset references are **decoupled into data files** for effortless editing:

### 1. Swapping Characters & Mascot Art
Open [`src/data/characters.ts`](file:///E:/project/ML/src/data/characters.ts):
```ts
{
  id: "saadhyam",
  name: "SAADHYAM",
  type: "AI Voice Calling Agent",
  tagline: "Autonomous Voice Outreach",
  color: "#8B5CF6",                         // Accent color
  glowColor: "rgba(139, 92, 246, 0.45)",
  quote: "Need 10,000 phone calls completed before lunch? Hand me the phone!",
  sticker: "/characters/saadhyam.svg",       // Replace with your PNG / WebP
  stats: { primary: "180ms", label: "Duplex Latency", secondary: "14+ Languages" },
}
```
To swap artwork, drop your transparent PNG or WebP into `public/characters/` and update the `sticker` path.

### 2. Updating Bento Grid Features
Open [`src/data/products.ts`](file:///E:/project/ML/src/data/products.ts):
Update or append items in `BENTO_TILES`. You can adjust responsive column spans using standard Tailwind classes (e.g. `lg:col-span-6 col-span-12`).

### 3. Modifying Mentlearn Courses
Edit `MENTLEARN_COURSES` in [`src/data/products.ts`](file:///E:/project/ML/src/data/products.ts). Change titles, curricula, durations, or pricing tags.

### 4. Updating Global Hubs & Trust Statistics
Edit `TRUST_STATS` and location tags in [`src/data/products.ts`](file:///E:/project/ML/src/data/products.ts) and [`src/components/sections/TrustStrip.tsx`](file:///E:/project/ML/src/components/sections/TrustStrip.tsx).

---

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification
```bash
npm run build
npm run start
```

---

## ⚡ Performance & Accessibility
- Respects `prefers-reduced-motion` to smoothly disable animations for users with motion sensitivity.
- Lazy loads below-the-fold assets and 3D Canvas.
- Fully keyboard accessible (cards navigable with arrow keys; modals dismissable with Escape).
- Responsive across mobile (360px), tablet (768px), desktop (1280px), and ultrawide (1920px).
