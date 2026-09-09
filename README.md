# GenMedicine — Enterprise Healthcare Platform

GenMedicine is a decoupled multi-tenant pharmaceutical SaaS platform designed for generic drug discovery, B2B pharmaceutical governance, partner pharmacy dispensing with IoT cold-chain safety locks, and FDA Orange Book bioequivalent substitution.

The repository is structured with a **clean separation between Frontend and Backend**.

---

## 📁 Project Structure

```text
genmedicine/
├── frontend/                     # Client application (React 19, Tailwind CSS v4, Vite 6)
│   ├── src/
│   │   ├── components/           # Multi-persona dashboards, modals, & visualizers
│   │   ├── services/             # REST API clients (apiClient.ts, phase6ApiClient.ts)
│   │   ├── data/                 # Client offline fixtures & initial state
│   │   ├── types.ts              # Frontend domain interfaces & view contracts
│   │   ├── App.tsx               # Persona router & cross-screen simulation state
│   │   ├── main.tsx              # React DOM bootstrap
│   │   └── index.css             # Tailwind design tokens
│   ├── public/                   # Static browser assets
│   ├── vite.config.ts            # Vite proxy configuration (/api -> localhost:5000)
│   ├── tsconfig.json             # Frontend TypeScript configuration
│   ├── package.json              # Frontend dependencies
│   ├── .env.example              # Frontend environment template
│   └── .env                      # Local frontend environment
│
├── backend/                      # Server application (Node.js, Express, Google GenAI)
│   ├── src/
│   │   ├── services/             # Pharmaceutical micro-services (Gemini OCR, DDI, IoT, Escrow, DB)
│   │   ├── routes/               # API endpoint routing
│   │   ├── data/                 # Backend data fixtures & mock PostgreSQL state
│   │   ├── types.ts              # Backend domain types & data models
│   │   └── index.ts              # Express server entry point (Port 5000, CORS, JSON parsing)
│   ├── tsconfig.json             # Backend TypeScript configuration
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Backend environment template
│   └── .env                      # Local backend environment
│
├── README.md                     # Setup and running instructions (this file)
├── .gitignore                    # Git ignore rules for root, frontend, and backend
├── package.json                  # Root runner scripts (concurrently, install:all)
├── decisions.md                  # Architectural Decision Records (ADRs)
├── memory.md                     # Long-term system memory and specifications
├── phases.md                     # Product release phases and roadmap
├── rules.md                      # Engineering guidelines and constraints
└── metadata.json                 # Project configuration metadata
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

---

## 🚀 Quick Start (Running Both Together)

You can install all dependencies and run both servers simultaneously directly from the project root:

```bash
# 1. Install root, backend, and frontend dependencies in one command:
npm run install:all

# 2. Start both the Backend (port 5000) and Frontend (port 3000) concurrently:
npm run dev
```

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
* **Backend Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📦 Independent Setup & Running

You can also run the frontend and backend in separate terminal windows.

### 1. Backend Service

The backend provides the Express REST API, Gemini AI Multimodal OCR, cold-chain telemetry, tenant database simulation, and escrow settlement endpoints.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env (adjust GEMINI_API_KEY if needed)
cp .env.example .env

# Start backend in development mode (with hot reloading via tsx)
npm run dev

# Or build and run production bundle
npm run build
npm start
```

* Backend server runs on **port 5000** (`http://localhost:5000`).
* Healthcheck: `GET http://localhost:5000/api/health`

### 2. Frontend Application

The frontend is a single-page application built with React 19, TypeScript, Tailwind CSS v4, and Vite 6.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env
cp .env.example .env

# Start frontend in development mode
npm run dev

# Or build for production
npm run build
```

* Frontend server runs on **port 3000** (`http://localhost:3000`).
* Any call to `/api/*` is automatically proxied to the backend at `http://localhost:5000`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | HTTP port for the Express server. |
| `GEMINI_API_KEY` | *(Optional)* | Google Gemini API key for live prescription OCR and DDI checks. |
| `APP_URL` | `http://localhost:5000` | Base public URL of the backend service. |

### Frontend (`frontend/.env`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | `http://localhost:5000` | Target URL for the Vite development proxy. |
| `VITE_API_URL` | `/api/v1` | Base REST path for client fetch requests. |

---

## 🧪 Verification & Health Check

1. Verify backend health:
   ```bash
   curl http://localhost:5000/api/health
   # Response: {"status":"HEALTHY","service":"genmedicine-backend","version":"1.0.0","port":5000,...}
   ```
2. Query generic medicine catalog:
   ```bash
   curl "http://localhost:5000/api/v1/medicines?q=Atorvastatin"
   ```
3. Test Multi-Tenant Schema Routing:
   ```bash
   curl http://localhost:5000/api/v1/tenants/topology
   ```

---

## 📄 License & Compliance

Compliant with FDA 21 CFR Part 11, HIPAA Security Rule, and FDA Orange Book Therapeutic Equivalence Evaluation standards.
