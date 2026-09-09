# AI Coding Assistant Rules & Project Guidelines

This document defines the strict, mandatory operational rules and technical standards that any **AI Coding Assistant** (and contributing human engineer) must follow when reading, generating, refactoring, or testing code in the **GenMedicine** repository.

---

## Table of Contents

1. [The Prime Directive: Preserve Existing Functionality](#1-the-prime-directive-preserve-existing-functionality)
2. [TypeScript & Coding Standards](#2-typescript--coding-standards)
3. [Folder Structure & Architecture Rules](#3-folder-structure--architecture-rules)
4. [Naming Conventions](#4-naming-conventions)
5. [UI/UX & Design Consistency Rules](#5-uiux--design-consistency-rules)
6. [Git Commit Rules](#6-git-commit-rules)
7. [Security & Environment Variable Rules](#7-security--environment-variable-rules)
8. [Healthcare Regulatory & Data Handling Rules](#8-healthcare-regulatory--data-handling-rules)
9. [Pre-Commit & Verification Checklist](#9-pre-commit--verification-checklist)

---

## 1. The Prime Directive: Preserve Existing Functionality

> [!IMPORTANT]
> **NEVER BREAK EXISTING FUNCTIONALITY UNLESS EXPLICITLY REQUESTED BY THE USER.**

- **Preserve Cross-Persona Flow**: The 5 core personas (`super-admin`, `b2b-pharma`, `tenant-admin`, `pharmacy-partner`, `customer-mobile`) and the `architecture` visualizer in `src/App.tsx` must remain accessible and functional at all times.
- **Maintain In-Memory State Cohesion**: Cross-persona state updates (such as approving an order in Pharmacy Partner and seeing it update the global dispatched count, or placing an order on Customer Mobile and generating an audit event) must never be severed or bypassed.
- **Do Not Remove Mock Datasets**: Existing mock datasets in `src/data/mockData.ts` and `src/data/batchData.ts` are foundational fixtures. Do not wipe or truncate mock data unless augmenting it with realistic pharmaceutical data.
- **Backward Compatibility**: If a component interface or type contract in `src/types.ts` must change, ensure existing components either continue working via optional fields or are all systematically updated in the same changeset.

---

## 2. TypeScript & Coding Standards

### 2.1 Strict Type Discipline
- **No Unjustified `any`**: Always type data structures, event payloads, and function signatures. If an unknown payload is received from an external API, use `unknown` with runtime type narrowing or create a descriptive interface.
- **Centralize Shared Types**: Domain-wide entities (`MedicineOffer`, `FormulationDossier`, `DispenseOrder`, `TenantUser`, `AuditEvent`, etc.) must live in [`src/types.ts`](file:///c:/agenticworkshop/genmedicine/src/types.ts). Do not declare duplicate parallel interfaces in individual component files.
- **Union Types Over Loose Strings**: Use strict string literal unions for statuses, modes, and roles (e.g., `status: 'Packing In-Progress' | 'Sign-Off Required' | 'Awaiting Pickup' | 'Dispatched' | 'Completed'`).

### 2.2 React 19 Practices
- **Functional Components with Explicit Typing**:
  ```tsx
  interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: string;
    isPositive?: boolean;
    icon: React.ComponentType<{ className?: string }>;
  }

  export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    trend,
    isPositive,
    icon: Icon,
  }) => {
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        {/* Component JSX */}
      </div>
    );
  };
  ```
- **State Immutability**: Always use functional state updates when deriving state from previous values:
  ```tsx
  // CORRECT
  setAuditEvents((prev) => [newEvent, ...prev]);

  // INCORRECT (Never mutate state in place)
  auditEvents.push(newEvent);
  setAuditEvents(auditEvents);
  ```
- **Clean Effect Lifecycles**: Always return cleanup functions for timers, intervals, or WebSocket subscriptions in `useEffect`.

### 2.3 Defensive Rendering & Null Safety
- Always handle optional fields defensively using optional chaining (`?.`) and nullish coalescing (`??`).
- Provide meaningful fallback UI if an array is empty or an object is loading.

---

## 3. Folder Structure & Architecture Rules

```
genmedicine/
├── public/                     # Static browser assets (SVGs, logos, favicons)
├── src/
│   ├── components/             # Reusable UI modules and Persona screens
│   │   ├── pharma/             # Domain sub-components for B2B Pharma Portal
│   │   │   ├── AdverseEventSurveillanceView.tsx
│   │   │   ├── BatchReleaseAuditsView.tsx
│   │   │   ├── BioequivalenceView.tsx
│   │   │   ├── MarketSubstitutionView.tsx
│   │   │   ├── PricingEconomicsView.tsx
│   │   │   └── ProductPortfolioView.tsx
│   │   ├── ArchitectureVisualizer.tsx # 13-layer blueprint & flow tracer
│   │   ├── AuthScreen.tsx             # Multi-role authentication gateway
│   │   ├── CustomerMobileApp.tsx      # Patient discovery & checkout
│   │   ├── NavigationBanner.tsx       # Universal persona switcher
│   │   ├── PharmaB2BPortal.tsx        # Manufacturer governance portal
│   │   ├── PharmacyPartnerPortal.tsx  # Dispense hub & cold-chain orders
│   │   ├── SuperAdminConsole.tsx      # Ops console, ranking tuner, audits
│   │   └── TenantAdminPortal.tsx      # Multi-tenant user & outlet manager
│   ├── data/                   # Data fixtures and mock state
│   │   ├── batchData.ts        # QA batch audit records and COAs
│   │   └── mockData.ts         # Initial offers, orders, tenants, audits
│   ├── App.tsx                 # Root application & cross-screen coordinator
│   ├── index.css               # Global styles & Tailwind v4 theme directives
│   ├── main.tsx                # React DOM entrypoint
│   └── types.ts                # Canonical platform domain types
├── .env.example                # Example environment variables template
├── decisions.md                # Architectural Decision Records (ADRs)
├── rules.md                    # This document (AI operational rules)
├── memory.md                   # Long-term platform memory & schema guide
├── changelog.md                # Chronological change log
├── package.json                # Project dependencies and scripts
└── vite.config.ts              # Vite 6 build configuration
```

### Folder Placement Constraints:
1. **Never create standalone loose files in `src/`**: All files in `src/` must be either core root entries (`App.tsx`, `main.tsx`, `types.ts`, `index.css`) or placed inside appropriate subdirectories (`components/`, `data/`, `utils/`, `services/`).
2. **Sub-component Grouping**: If a persona or domain has more than 3 sub-views (such as Pharma B2B), place them in a dedicated sub-folder (`src/components/pharma/`).
3. **Data Isolation**: Static datasets, initial state fixtures, and mock collections must reside in `src/data/`, never embedded inline in large component files.

---

## 4. Naming Conventions

| Entity | Convention | Example |
| :--- | :--- | :--- |
| **React Components** | PascalCase (`.tsx`) | `SuperAdminConsole.tsx`, `BioequivalenceView.tsx` |
| **TypeScript Types & Interfaces** | PascalCase | `MedicineOffer`, `DispenseOrder`, `RankingWeights` |
| **Type Aliases & Enums** | PascalCase / Union | `AppScreen`, `MobileSubScreen` |
| **Data & Utility Files** | camelCase (`.ts`) | `mockData.ts`, `batchData.ts`, `formatters.ts` |
| **Hook Functions** | camelCase (prefix `use`) | `useColdChainSensor.ts`, `useSearchRankings.ts` |
| **Event Handlers** | camelCase (prefix `handle` or `on`) | `handleApproveOrder`, `onScreenChange` |
| **Constants & Fixed Enums** | UPPER_SNAKE_CASE | `DEFAULT_USER`, `MAX_SLA_MINUTES` |
| **CSS Classes & Route Keys** | kebab-case | `super-admin`, `b2b-pharma`, `customer-mobile` |

---

## 5. UI/UX & Design Consistency Rules

### 5.1 Color Palette System
The platform utilizes a tailored clinical dark-mode aesthetic with purposeful semantic accent colors:

- **Platform Background**: Deep slate/charcoal `#06090e` and `bg-slate-950`.
- **Card & Panel Backgrounds**: `bg-slate-900/80` or `bg-slate-900` with subtle border `border-slate-800`.
- **Primary / Platform Ops**: Cyan (`text-cyan-400`, `bg-cyan-500/10`, `border-cyan-500/30`).
- **Pharma B2B / Manufacturing**: Sky Blue (`text-sky-400`, `bg-sky-500/10`, `border-sky-500/30`).
- **Tenant Admin / Security**: Indigo / Violet (`text-indigo-400`, `bg-indigo-500/10`).
- **Pharmacy Dispense / Verification**: Emerald Green (`text-emerald-400`, `bg-emerald-500/10`, `border-emerald-500/30`).
- **Customer Mobile / Discovery**: Purple / Violet (`text-purple-400`, `bg-purple-500/10`).
- **Warnings / Cold-Chain Alerts**: Amber / Orange (`text-amber-400`, `bg-amber-500/10`).
- **Critical Errors / Severe DDI**: Rose / Red (`text-rose-400`, `bg-rose-500/10`).

### 5.2 Mobile Frame Guidelines
When modifying or extending the `CustomerMobileApp.tsx`:
- Maintain the realistic smartphone viewport chassis (`w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden`).
- Keep the dark top device status bar (time `9:41`, 5G pill, battery indicator).
- Preserve the sticky step navigation pill (`Discover`, `Scan Rx`, `Checkout`, `Profile`).

### 5.3 Iconography & Badges
- Exclusively use **Lucide React** icons.
- Ensure consistent sizing:
  - Micro icons in tags/badges: `w-3 h-3` or `w-3.5 h-3.5`.
  - Action buttons / table headers: `w-4 h-4`.
  - Hero section / stat cards: `w-5 h-5` or `w-6 h-6`.
- Every badge must use the standard formula: padding (`px-2 py-0.5` or `px-2.5 py-1`), rounded corners (`rounded` or `rounded-full`), monospace font for codes (`font-mono text-xs`), with matched background/border opacity.

---

## 6. Git Commit Rules

Follow the **Conventional Commits** specification for all version control records:

```
<type>(<optional scope>): <short description in present tense>

[optional body explaining motivation and details]

[optional footer(s) like BREAKING CHANGE or issue reference]
```

### Allowed Types:
- `feat`: A new user-facing feature or screen capability.
- `fix`: A bug fix in logic, rendering, or state synchronization.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `docs`: Documentation updates (including `decisions.md`, `rules.md`, `memory.md`, `changelog.md`).
- `chore`: Build config, dependency updates, tooling adjustments.
- `perf`: Performance improvements (e.g. memoization, cache optimization).
- `test`: Adding or refactoring unit, component, or end-to-end tests.

### Examples:
- `feat(pharmacy): add cold-chain BLE sensor validation before order dispatch`
- `fix(ranking): correct freshness decay decay penalty calculation in SuperAdminConsole`
- `docs(adrs): add ADR-010 for pricing transparency spread and escrow payment vault`

---

## 7. Security & Environment Variable Rules

> [!CAUTION]
> **NEVER COMMIT CREDENTIALS, API KEYS, OR PRIVATE CERTIFICATES TO SOURCE CODE.**

1. **Environment Variable Prefix**:
   - Variables exposed to the Vite client bundle must be prefixed with `VITE_` (e.g., `VITE_API_URL`).
   - Server-only credentials must **never** carry the `VITE_` prefix and must only be read in Node.js / backend execution environments.
2. **Secret Management**:
   - `GEMINI_API_KEY`: Kept in `.env` (git-ignored) or injected by runtime cloud secrets (AI Studio / Cloud Run).
   - `.env.example`: Must be kept updated with dummy values and descriptive comments for every required variable. Never place actual working keys in `.env.example`.
3. **Multi-Tenant Isolation Awareness**:
   - When writing backend queries or simulated multi-tenant handlers, never query across schemas without verifying the active tenant's cryptographic identity.
   - Respect Row-Level Security (RLS) policies and tenant schema namespaces.

---

## 8. Healthcare Regulatory & Data Handling Rules

1. **HIPAA PHI Protection**:
   - Never log unencrypted Protected Health Information (patient full names, national IDs, medical histories) to the browser console or telemetry endpoints.
   - In mock data, use clearly fictional persona details (e.g. `Alex Morgan`, `test@healthmail.com`, `555-234-5678`).
2. **FDA 21 CFR Part 11 Audit Integrity**:
   - Every state-altering action in the pharmacy fulfillment or B2B manufacturing flow must create an immutable audit entry in the `auditEvents` stream with timestamp, actor role, and cryptographic trace hash.
   - Pharmacist sign-offs require an explicit identifier and cannot be automated without user initiation.
3. **Clinical Equivalence Verification**:
   - Generic substitutions must display bioequivalence credentials (AB-rating, ANDA number, RLD reference) before allowing consumer confirmation.

---

## 9. Pre-Commit & Verification Checklist

Before presenting completed code or committing changes, verify:

- [ ] **Build Check**: Does `npm run build` or `npm run lint` execute without TypeScript compile errors?
- [ ] **Zero Regressions**: Are all 5 persona tabs in `NavigationBanner` still rendering properly?
- [ ] **Cross-Screen State**: Does approving an order or placing an order correctly update cross-screen indicators and audit logs?
- [ ] **No Console Errors**: Is the browser developer console free of unhandled React key warnings or runtime errors?
- [ ] **Documentation Sync**: If architectural changes or new features were added, are `memory.md`, `changelog.md`, or `decisions.md` updated accordingly?
