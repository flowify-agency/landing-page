# Flowify Landing Page — Systems Operations & Engineering Cockpit

Welcome to the official repository for the **Flowify Landing Page**. This is a premium, production-grade React + TypeScript web application engineered with a clean, high-contrast **Utilitarian Engineering & Modern Editorial** aesthetic.

Instead of traditional, generic "AI slop" templates, this landing page is styled exclusively with raw pixel-perfect vanilla CSS grid layouts, humanist typography stacks, and interactive physical simulation widgets to build high trust with clients.

---

## 🛠️ Operational Engines & Features

### 1. Interactive Operations Cockpit (`Cockpit.tsx`)
* An interactive systems blueprint visualizer displaying flow convergence pipelines.
* Supports **Friction vs. Flow** state toggling, data packet injection, and system reboots.
* Animates flowing network data packet nodes that bottleneck and turn red under Friction mode but transition into glowing, high-velocity green streams in Flow mode.

### 2. Silent Operations Drain Calculator (`Calculator.tsx`)
* An interactive financial ledger audit calculator customized for local business bottlenecks (manual spreadsheets, siloed POS systems, delayed GST invoicing, etc.).
* Computes real-time weekly wasted hours, monthly staff labor overhead in INR (₹), lost operational revenue, and administrative drain.
* Drives a custom radial SVG gauge indicating the operational friction score with smooth dash-offset interpolation.

### 3. Services strip Accordion Stack (`Services.tsx`)
* A full-width vertical strip accordion stack displaying our core operational engines.
* Highlights individual strips with their system theme accent colors (Amber, Mint, Red, Blue).
* Prioritizes high-impact **Workflow Automation** (custom ERP bridges, Tally automation, WhatsApp API notifications, Zoho CRM synchronization) and **Automated Data Pipelines**.

### 4. Segment-Colored Timeline Pipeline (`Process.tsx`)
* A horizontally spanning SVG track tracking our deployment phases: **Audit**, **Build**, and **Launch**.
* Resolves standard browser rendering limitations on zero-height lines by using a responsive coordinate space (`viewBox="0 0 1200 8"`) and `userSpaceOnUse` gradient mapping.
* Features a single pulsing laser indicator that dynamically shifts color (from neutral white to Yellow/Amber, Green, and Royal Blue) as it crosses through the phase boundaries.

### 5. Interaction-Aware Video Testimonials (`VideoReviews.tsx`)
* Scroll-triggered autoplay mechanics for customer reviews.
* Intelligently plays video testimonials unmuted as soon as they scroll into viewport, provided the user has made an initial interaction on the page. Otherwise, presents tactile play overlays to bypass native browser audio policies seamlessly.

---

## 🏗️ Technology Stack

* **Core**: React 19, TypeScript
* **Build System**: Vite (utilizing lightning-fast HMR)
* **Styling**: Modern Vanilla CSS variables, layout grid tokens, and typographic scale pairings (Plus Jakarta Sans & Instrument Serif)
* **Icons**: Lucide React

---

## 🚀 Getting Started

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

### Production Build

1. **Type-Check and Compile Bundle**:
   ```bash
   npm run build
   ```
   Generates a highly optimized, light-weight client bundle in the `dist` directory.

2. **Preview Production Build**:
   ```bash
   npm run preview
   ```
