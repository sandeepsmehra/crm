# Nationrise CaseOS — Practice Management Workspace

Modern, high-performance legal practice workspace built for Nationrise Immigration Services, implementing all 56 functional screen contracts from the specifications.

---

## 📋 System Requirements & Prerequisites

Before running the project locally on **macOS**, **Windows**, or **Linux**, ensure your machine meets the following environment specifications:

| Requirement | Supported Version | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | **`20.x LTS`** or **`22.x LTS`** | Verified up to `v24.x`. Compatible with both Apple Silicon (`arm64`) and Intel/AMD (`x64`). |
| **pnpm** | `>= 8.0.0` | **`9.x`** – **`12.x`** | Primary package manager used for deterministic dependency resolution. |
| **npm** *(alternative)* | `>= 9.0.0` | **`10.x`** | Fully supported fallback if pnpm is not installed. |
| **Operating System** | macOS 12+, Windows 10/11, Linux | **macOS Sonoma / Sequoia** or **Windows 11** | Zero OS-specific dependencies; identical execution across platforms. |
| **Web Browser** | Chrome 100+, Safari 16+, Edge 100+, Firefox 100+ | **Chrome** or **Safari** | Requires standard modern ES2022+ and CSS Grid support. |
| **Hardware** | Minimum 2 GB RAM, 500 MB free disk space | 4+ GB RAM | Vite runs sub-second builds and instantaneous HMR. |

---

## 🛠️ Environment Setup

### On macOS (Apple Silicon M1/M2/M3/M4 or Intel):
```bash
# 1. Install Node.js & pnpm using Homebrew (recommended)
brew install node pnpm

# Or using NVM (Node Version Manager):
nvm install 20
nvm use 20
npm install -g pnpm

# 2. Verify installed versions:
node -v   # Should output v18.0.0 or higher
pnpm -v   # Should output 8.0.0 or higher
```

### On Windows (PowerShell / Command Prompt / Git Bash):
```powershell
# 1. Install Node.js LTS via winget (or download from https://nodejs.org/):
winget install OpenJS.NodeJS.LTS

# 2. Enable or install pnpm:
corepack enable
# or: npm install -g pnpm

# 3. Verify installed versions:
node -v
pnpm -v
```

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Start Development Server
```bash
# Standard dev server (runs at http://localhost:5173)
pnpm run dev

# Recommended for macOS (auto-opens default browser & binds network host):
pnpm run dev:mac
```

### 3. Production Build & Test
```bash
# Compile and build production bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## 📜 Available NPM / PNPM Scripts

### 🍎 Dedicated macOS Scripts (`package.json`)

| Script | Command | Purpose on macOS |
| :--- | :--- | :--- |
| `pnpm run dev:mac` | `vite --host --open` | Starts dev server, binds to local network, and auto-opens default browser (Safari/Chrome). |
| `pnpm run build:mac` | `tsc -b && vite build` | Runs TypeScript validation and builds optimized production bundle. |
| `pnpm run preview:mac` | `vite preview --host --open` | Previews built bundle and auto-opens browser on macOS. |
| `pnpm run clean:mac` | `rm -rf dist` | Uses native macOS POSIX command to wipe old build output. |
| `pnpm run build:clean:mac` | `rm -rf dist && tsc -b && vite build` | Clean wipe + full production rebuild in one step. |
| `pnpm run typecheck:mac` | `tsc -b` | Standalone TypeScript compiler verification. |
| `pnpm run lint:mac` | `oxlint` | High-speed Oxlint scan across all source files. |
| `pnpm run lint:fix:mac` | `oxlint --fix` | Automatically fixes all auto-resolvable lint and style rules. |
| `pnpm run fresh:mac` | `rm -rf node_modules dist && pnpm install` | Clean reinstall of all dependencies from scratch. |
| `pnpm run verify:mac` | `tsc -b && oxlint && vite build` | Full pre-commit & CI verification pipeline. |

### 💻 Standard Cross-Platform Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `pnpm run dev` | `vite` | Starts local dev server with hot module replacement (HMR). |
| `pnpm run dev:open` | `vite --open` | Starts server and immediately opens default browser. |
| `pnpm run dev:host` | `vite --host` | Exposes server on local network IP (for mobile/tablet preview). |
| `pnpm run build` | `tsc -b && vite build` | Standard production build to `dist/`. |
| `pnpm run build:clean`| *cross-platform clean & build* | Cleans previous `dist/` directory then compiles new build. |
| `pnpm run typecheck` | `tsc -b` | Standalone TypeScript validation. |
| `pnpm run clean` | *node fs clean* | Cross-platform cleanup script to remove `dist/`. |
| `pnpm run preview` | `vite preview` | Serves and validates the built `dist/` production assets locally. |
| `pnpm run preview:open`| `vite preview --open` | Serves production build and automatically opens browser. |
| `pnpm run lint` | `oxlint` | Ultra-fast linter scanning all source files. |
| `pnpm run lint:fix` | `oxlint --fix` | Automatically fixes auto-resolvable lint rules. |

---

## 📱 Responsive Design & Viewport Support

The application is engineered with a fully responsive architecture that adapts fluidly across all modern form factors and display resolutions:

| Device Category | Target Viewports | Responsive Adaptations |
| :--- | :--- | :--- |
| **Mobile Phones** | `320px` – `480px` | Slide-over navigation drawer with backdrop, hamburger toggle in top bar, stacked metric cards (`grid-cols-1`), touch-friendly inputs, full-width scrollable modal dialogs (`max-h-[92vh] overflow-y-auto`). |
| **Tablets** | `768px` – `1024px` | 2-column KPI grids, responsive tab bars with horizontal drag scrolling, wrap-friendly toolbar buttons, calendar and table column adjustments. |
| **Laptops & Desktops** | `1280px` – `1920px` | Left-docked persistent sidebar, 4-column metric tiles, live Vancouver clock, sticky headers, optimized table padding. |
| **Big Screens & Ultrawide** | `2560px` – `2700px` | Layout expands up to `max-w-[2700px]` with `2xl:` scaled cards and data tables, preventing compressed views or distorted horizontal stretching on 4K, 5K, and 21:9 monitors. |

All data tables include horizontal scroll wrappers (`overflow-x-auto`) and explicit column constraints (`min-w-[640px]` to `min-w-[1000px]`) to safeguard against text clipping on smaller viewports.

---

## 📂 Modular Architecture (56 Screens by Module Group)

All screen views and related modal contracts are organized into self-contained module directories under `src/components/crm/modules/`:

- **`dashboard/`** — File submission deadlines, LMIA advertisement expiry, client updates & PFL request letters (SCR-001–010)
- **`task-manager/`** — Client inquiries, caseworker assignments, and 72-hour aging alert queues (SCR-011–015)
- **`appointments/`** — Front-desk spreadsheet schedule, time-slot calendar view, and booking modal (SCR-016–021)
- **`clients/`** — Individual & Employer directories, consultation notes, communication logs (SCR-022–027)
- **`todo-list/`** — Retained Red Tab, Temporary files, PR files, LMIA, Inactive, and Submitted queues (SCR-028–039)
- **`matter/`** — Application workspace, checklist, document verifications, internal progress notes (SCR-040–046)
- **`case-managers/`** — Caseload balancing directory and bulk file reassignment dialog (SCR-047)
- **`retainers-invoices/`** — Retainer agreement tracking, fee disclosure, and signed records lock (SCR-048–049)
- **`deadline-centre/`** — Hard deadlines, IRCC requests, internal targets with live countdowns (SCR-050)
- **`client-portal/`** — Client document upload simulator, questionnaires, and live chat preview (SCR-056)
- **`settings/`** — Access matrix, spreadsheet import, audit logs, and workflow templates (SCR-051–056)
- **`common/`** — Universal quick action menu launcher modal

---

## 🌐 Default Ports & Network Configuration

- **Default Port**: `5173`
- **Auto-Port Fallback**: If port `5173` is already in use by another application, Vite will automatically select `5174` without terminating.
- **Timezone**: All date-time and deadline calculations default to `America/Vancouver` (Pacific Time).
