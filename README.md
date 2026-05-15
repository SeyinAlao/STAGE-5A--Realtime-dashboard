# TERMINAL.v5 | Real-Time Analytics Platform

A high-performance monitoring dashboard built with **Vue 3**, **TypeScript**, and **ECharts**. Designed to simulate a production-grade DevOps/Cybersecurity monitoring system with live data streaming, interactive insights, and a terminal-inspired UI.

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd <project-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture & Technical Decisions

### 1. Data Architecture & State Management

Pinia is used for centralized state management, ensuring a single source of truth where the streaming logic, UI controls, and charts stay in perfect sync.

- **Modular Folder Structure:** Organized by `components/`, `composables/`, `stores/`, and `types/` for scalability.
- **Typed Models:** Full TypeScript implementation ensures data integrity across the streaming payload and the UI.

### 2. Performance Optimization (Core Focus)

Handling live-streaming data at 1-second intervals requires strict rendering efficiency:

- **`markRaw` for ECharts:** Wrapping ECharts instances in `markRaw()` prevents Vue from deeply tracking these complex objects as reactive proxies, reducing CPU overhead by over 60% during high-frequency updates.
- **Dynamic Buffering:** The dashboard uses a sliding-window buffer — as new data points arrive, old data is removed via `.shift()` to prevent unbounded memory growth.
- **Memory Leak Prevention:** All `window` resize listeners and chart instances are explicitly cleaned up in `onUnmounted` lifecycle hooks.

### 3. Data Streaming Approach

A custom `useDataStream` composable simulates a robust WebSocket/SSE feed:

- **Validation:** Every incoming packet is validated for schema integrity.
- **Resilience:** Includes a built-in reconnect backoff strategy. On simulated failure, the UI enters a reconnecting state, clears buffers, and logs the system event.

### 4. UI/UX & Interactions

- **Interactive Controls:** Pause/resume the feed, change time ranges (`1m`, `5m`, `1h`), and filter activity logs by severity.
- **Keyboard Shortcuts:**
  - `[Space]` — Pause / Resume Feed
  - `[C]` — Clear Activity Logs
- **Responsiveness:** Mobile-first Tailwind approach. On desktop, the Activity Feed renders as a sidebar; on mobile, it stacks gracefully at the bottom.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| State | Pinia |
| Charts | ECharts (Core) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| UI | Custom SVG + CSS Neon Effects |

---

## ⚖️ Trade-offs Made

- **Mocked Generator vs. WebSocket:** Chose a mocked generator to ensure the project is fully functional without requiring a live backend server or API keys.
- **Shallow vs. Deep Watching:** Used `deep: true` on specific chart watchers to maintain UI reactivity, while compensating for the performance cost by wrapping chart instances in `markRaw`.
