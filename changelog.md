# Changelog

All notable changes to the **GenMedicine** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Autonomous drone delivery dispatch & FAA flight path clearance integration.
- Multilingual LLM drug leaflet synthesis in 40+ local languages.

---

## [5.0.0] - 2026-11-01 (Phase 6 Milestone: Global Trials & Predictive Supply Chain Network)

### Added
- **Predictive Inventory AI & Patent Cliff Forecasting Engine (`Phase6GlobalTrialsAndSupplyChain.tsx` & `/api/v1/supply-chain/*`)**:
  - Patent Cliff expiration radar tracking upcoming loss-of-exclusivity for blockbuster molecules (Keytruda, Eliquis, Entresto, Biktarvy, Ozempic - $89.9B market).
  - 12-month time-series demand curve comparing baseline historical consumption against neural generic substitution surge multipliers.
  - Active regional drug shortage radar with automated 1-click B2B purchase order (EDI 850) replenishment.
- **Decentralized Clinical Trial (DCT) Matching & Zero-Knowledge Proof Consent (`/api/v1/trials/*`)**:
  - Global sponsored protocol directory (Novartis, AstraZeneca, Roche, Cipla) supporting decentralized virtual home visits and patient stipends ($1,450 - $3,500).
  - Zero-Knowledge Proof (ZKP) patient screening matching biomarkers and electronic prescriptions without exposing raw PHI.
  - Verifiable smart contract consent ledger with tamper-proof SHA-256 digital digests and automated stipend escrow locking.
- **Cross-Border Regulatory Synchronization & Landed Cost Arbitrage (`/api/v1/regulatory/*`)**:
  - Multi-jurisdictional pharmacopeia harmonization crosswalk (US FDA Orange Book, EU EMA SmPC, WHO PQ, India CDSCO SUGAM).
  - Landed cost arbitrage calculator factoring ex-factory synthesis, air freight cold-chain, and customs tariffs to unlock up to 95.8% net patient savings.
  - Live International Equivalence & Section 804 import parity compliance validator.
- **Architectural Decision Record (ADR-013)**:
  - Added ADR-013 in `decisions.md` documenting decentralized trial matching and predictive supply chain neural network.

---

## [4.0.0] - 2026-10-15 (Phase 5 Milestone: Native Mobile Ecosystem & Bi-Directional Health Sync)

### Added
- **Native Dual-Chassis Mobile Health Simulator (`Phase5MobileHealthSuite.tsx`)**:
  - Live iOS iPhone 16 Pro mockup featuring Dynamic Island, glassmorphic navigation bar, Apple HealthKit sync, and FaceID biometric authentication.
  - Live Android Pixel 9 Pro mockup featuring Material You dynamic theming, notification shade, and Google Health Connect sync.
- **Bi-Directional Apple HealthKit & Google Health Connect Synchronization (`/api/v1/health/*`)**:
  - Full synchronization of daily adherence logs (94.2% on-time score) and real-time vitals (HbA1c, Blood Pressure, Heart Rate, Blood Glucose).
  - Automated Drug-Allergy Profile cross-checking with contraindication alerts (Sulfa, Penicillin, ACE-inhibitors).
- **Multi-Channel Push Notification Dispatcher (`/api/v1/notifications/*`)**:
  - Real-time notification queue and dispatcher supporting 4 urgency tiers (Refill Alert, Critical Adherence, Cold-Chain Excursion, Dose Reminder) with interactive delivery simulator.
- **Enterprise Pharmacy Hardware Barcode Scanner Engine (`/api/v1/hardware/*`)**:
  - Sub-50ms Zebra TC58 and Honeywell SE5500 decoder simulation for 1D/2D GS1 DataMatrix and NDC-11 barcode validation on dispense counters.
- **Architectural Decision Record (ADR-012)**:
  - Documented native mobile ecosystem and bi-directional health sync architecture in `decisions.md`.


## [3.3.0] - 2026-10-08 (Phase 4 Milestone: Live AI Multimodal OCR & Production Data Tier)

### Added
- **Server-Side Gemini 2.0 Flash Multimodal Prescription OCR (`/api/v1/ai/prescription-ocr`)**:
  - Live AI OCR service parsing Doctor NPI, DEA registration, chemical formulation, dosage, frequency, and DAW status.
  - Automated FDA Orange Book AB-rating match against active formulary with instant savings calculator.
- **Clinical DDI & Contraindication Engine (`/api/v1/ai/ddi-check`)**:
  - Polypharmacy interaction screener checking CYP450 conflicts, macrolide-statin competitive inhibition, and dietary warnings.
- **PostgreSQL 16 Multi-Tenant Schema Engine (`/api/v1/db/*`)**:
  - Dynamic `SET search_path TO schema_{tenant_id}` connection router isolating tenant data boundaries.
  - Synchronous DDL migration runner applying migrations across all active tenant schemas.
  - Automated Zero-Leakage Security Verification test suite demonstrating 0.00% cross-tenant data leakage.
- **IoT Cold-Chain Telemetry Mesh (`/api/v1/iot/*`)**:
  - Live BLE/NFC sensor packet monitor tracking $2^\circ\text{C}-8^\circ\text{C}$ temperature, humidity, and GPS coordinates.
  - Interactive breach simulator triggering automatic dispatch freeze upon thermal excursions and pharmacist safety restoration.
- **Programmatic Escrow & Stripe Connect API (`/api/v1/escrow/*`)**:
  - Automated checkout payment vault holds with flat $1.00 platform transparency fee split.
  - Automatic fund disbursement to pharmacy partner connected accounts upon verified PharmD digital sign-off.
- **Cryptographic COA Studio (`/api/v1/b2b/coa/:batchId`)**:
  - FDA 21 CFR Part 11 compliant SHA-256 digital certificate generation with QP electronic signatures and QR code verification.
- **Phase 4 Engine Dashboard (`Phase4EngineDashboard.tsx`)**:
  - Comprehensive 5-pillar mission control console accessible directly from `NavigationBanner`.
- **Architectural Decision Record (ADR-011)**:
  - Added ADR-011 in `decisions.md` detailing server-side Gemini 2.0 OCR and PostgreSQL schema pooler architecture.

### Added
- **Phase 1 Core Generic Drug Directory (`GenericDrugDirectory.tsx`)**:
  - Full-screen desktop & tablet generic medicine comparison suite accessible from `NavigationBanner` with badge `Phase 1 Core`.
  - Multi-parameter live search with autocomplete across generic salts, active chemical entities, brand names, and clinical indications.
  - Dual view modes: Visual Cards Grid and High-Density Comparison Table with dynamic sorting (savings spread %, cash price, quality rank).
  - Brand vs. Generic pricing spread section detailing exact dollar savings, percentage spread, and packaging units.
  - Clinical Pharmacology Dossier modal displaying mechanisms of action, approved indications, dosage variants, and manufacturer QA certifications.
  - Polypharmacy Annual Prescription Savings Calculator with multi-drug selection and real-time annual savings projections.
- **REST API Middleware Layer (`/api/v1/*`)**:
  - Dev server middleware in `src/server/apiMiddleware.ts` integrated directly into `vite.config.ts`.
  - Implemented `GET /api/v1/medicines`, `GET /api/v1/medicines/:id`, `GET /api/v1/categories`, and `POST /api/v1/calculate-savings`.
- **Frontend API Client (`src/services/apiClient.ts`)**:
  - Typed client for asynchronous API operations with resilient local state fallback.
- **Expanded Pharmaceutical Catalog**:
  - Expanded `initialMedicineOffers` from 4 to 10 essential formulations covering Cardiovascular, Diabetes, Antibiotics, Gastrointestinal, Analgesic, CNS/Mental Health, and Respiratory therapeutic classes.

---

## [3.2.0] - 2026-09-08

### Added
- **AI Persistent Context Suite**:
  - `decisions.md`: Architecture Decision Records (ADRs 001 through 010) documenting PostgreSQL schemas, OpenSearch/Redis caching, cold-chain IoT locks, and Gemini OCR.
  - `rules.md`: Comprehensive AI operational guidelines covering coding standards, folder rules, naming conventions, UI/UX consistency, and git rules.
  - `memory.md`: Long-term platform memory detailing tech stack, completed features, API endpoints, database schemas, and business logic algorithms.
  - `changelog.md`: Chronological project history following Keep a Changelog standards.
- **SaaS Architecture Visualizer (`ArchitectureVisualizer.tsx`)**:
  - 13-layer architectural blueprint spanning Clients, Edge Security, Application Services, and Multi-Tenant Storage.
  - Interactive end-to-end flow tracer for 4 core workflows (Search & Ranking, Order Escrow Dispatch, B2B Sync, and Tenant Onboarding).
  - Multi-tenant database specification table comparing PostgreSQL schemas, OpenSearch SLAs, and Kafka audit streams.
- **Multi-Role Unified Auth Gateway (`AuthScreen.tsx`)**:
  - Persona switcher supporting Customer, Pharmacy Partner, Pharma B2B, Tenant Admin, and Super Admin roles.
  - Simulated multi-factor authentication (FIDO2 Passkeys, Hardware Security Keys, and TOTP Authenticators).
  - Direct integration into `NavigationBanner` with auto-routing to authenticated workspaces.
- **IoT Cold-Chain Sensor Lock & Verification**:
  - Added packaging temperature sensor check ($2^\circ\text{C}$ to $8^\circ\text{C}$) to `PharmacyPartnerPortal.tsx`.
  - Dispatches are automatically blocked if temperature boundaries are violated.

### Changed
- Refactored `App.tsx` to coordinate shared state across all 5 consoles with reactive audit logging.
- Enhanced `NavigationBanner.tsx` with live dispatched order counters, current user avatar pill, and dark mode badges.
- Updated Tailwind CSS configuration to version 4 with modern CSS color variable bindings.

### Fixed
- Fixed state desynchronization where approving an order in Pharmacy Partner did not update the courier status across child components.
- Resolved type mismatch in `src/types.ts` for optional `UserAccount` metadata fields.

---

## [3.1.0] - 2026-08-20

### Added
- **Batch Release QA Audits View (`BatchReleaseAuditsView.tsx`)**:
  - Comprehensive pharmaceutical QA batch testing dashboard in the B2B portal.
  - Interactive Certificates of Analysis (COA) modal with assay purity ($99.8\%$), dissolution curves, impurity thresholds, and heavy metals testing.
  - Qualified Person (QP) regulatory sign-off tracking under US FDA and EU GMP regulations.
- **Clinical Drug-Drug Interaction (DDI) Guard**:
  - Real-time contraindication checker in the pharmacy order fulfillment queue.
  - Cryptographic verification hash and mandatory pharmacist sign-off protocol.

### Changed
- Standardized badge styling across all pharma sub-views to use monospace typography and color-coded opacity borders.
- Upgraded `lucide-react` to version `0.546.0` for clinical and logistics icons.

### Fixed
- Addressed layout clipping on high-resolution widescreen monitors within the B2B dossier tables.

---

## [3.0.0] - 2026-07-15

### Added
- **Tenant Admin Portal (`TenantAdminPortal.tsx`)**:
  - Multi-tenant user roster with role-based permission scoping and MFA audit statuses.
  - Physical dispensary outlet manager tracking active catalog SKU sync status and DEA numbers.
  - Schema boundary isolation monitor verifying PostgreSQL `schema_tenant_apollo` sandboxing.
- **Super Admin Dynamic Ranking Weight Tuner (`SuperAdminConsole.tsx`)**:
  - Sliders allowing live adjustment of search ranking weights (price transparency, partner reliability, manufacturer trust, user sentiment, and freshness decay).
  - Real-time catalog feed staleness guard and refresh trigger.
  - Append-only system audit event stream.

### Changed
- Migrated global types into a single consolidated contract file [`src/types.ts`](file:///c:/agenticworkshop/genmedicine/src/types.ts).
- Upgraded React dependency to React 19 (`react@19.0.1`, `react-dom@19.0.1`).

### Removed
- Deprecated legacy hardcoded mock user objects in favor of dynamic `UserAccount` states.

---

## [2.1.0] - 2026-06-01

### Added
- **Customer Mobile App (`CustomerMobileApp.tsx`)**:
  - High-fidelity smartphone chassis mockup with native status bar and 5G network indicators.
  - 3-step checkout flow (Discover $\rightarrow$ Scan Rx $\rightarrow$ Checkout & Schedule).
  - Generic drug substitution toggle demonstrating real-time patient dollar savings.
  - FDA Orange Book AB-rating badge with clinical equivalence explanation.
  - Prescription document upload simulation with molecule breakdown.
  - Health Wallet interface displaying HSA/FSA balances and auto-refill management.

### Changed
- Optimized mobile device mockup to be responsive across standard desktop and laptop screen sizes.

---

## [2.0.0] - 2026-04-18

### Added
- **Pharma B2B Portal (`PharmaB2BPortal.tsx`)**:
  - Product portfolio manager displaying active ANDA filings, wholesale prices, and manufacturing plants.
  - Bioequivalence rating inspection view comparing generic formulations against Reference Listed Drugs (RLD).
  - Wholesale pricing economics dashboard comparing manufacturer margins against retail PBM markups.
  - Adverse event surveillance log for pharmacovigilance tracking.
  - Consumer catalog synchronization action.

### Changed
- Replaced basic HTML tables with structured Tailwind CSS card grids and clean data tables.

---

## [1.0.0] - 2026-02-10

### Added
- **Initial Prototype Release**:
  - Core directory of common generic pharmaceutical molecules and salt formulations.
  - Basic price comparison between branded medications and generic equivalents.
  - Vite + React + TypeScript baseline setup.
  - Initial mock data fixtures for essential medicines (Atorvastatin, Metformin, Azithromycin, Paracetamol).
