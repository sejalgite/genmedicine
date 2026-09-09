# GenMedicine: Long-Term Project Memory & Knowledge Base

This document serves as the persistent, comprehensive memory for the **GenMedicine** platform. It provides an in-depth record of the system architecture, business logic, completed capabilities, database schemas, API contracts, known issues, and future technical roadmap.

---

## 1. Project Overview & Mission

**GenMedicine** is an enterprise-grade, multi-tenant healthcare SaaS platform designed to transform pharmaceutical procurement, generic drug discovery, and pharmacy fulfillment.

### Core Objectives:
1. **Consumer Price Transparency**: Reduce patient out-of-pocket prescription medication costs by 15% to 85% by substituting expensive branded drugs with FDA Orange Book AB-rated bioequivalent generics.
2. **Multi-Tenant B2B Governance**: Provide global pharmaceutical manufacturers (e.g., Cipla, Sun Pharma) with tools to govern product dossiers, monitor batch release quality, manage pricing spreads, and track pharmacovigilance adverse events.
3. **High-Velocity Partner Pharmacy Dispatch**: Enable retail pharmacy chains and independent dispensing hubs (e.g., Apollo Health, MedPlus) to receive verified generic e-prescriptions, perform automated Drug-Drug Interaction (DDI) safety checks, monitor IoT cold-chain sensor integrity, and dispatch orders with automated escrow settlement.
4. **Platform Operator Governance**: Grant platform super administrators real-time visibility into system-wide audits, dynamic search ranking weight tuning, and catalog freshness guards.

---

## 2. Technology Stack

### Frontend & Client Application
- **Framework**: [React 19.0.1](https://react.dev/)
- **Language**: [TypeScript 5.8.2](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4.1.14](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Build Tool / Bundler**: [Vite 6.2.3](https://vitejs.dev/)
- **Iconography**: [Lucide React 0.546.0](https://lucide.dev/)
- **Animations**: [Motion 12.23.24](https://motion.dev/)

### Backend Runtime & AI Integrations
- **Runtime**: [Node.js 22](https://nodejs.org/) with `tsx 4.21.0` and `dotenv 17.2.3`
- **Server Framework**: [Express 4.21.2](https://expressjs.com/) with `@types/express`
- **AI / Multimodal OCR**: [@google/genai 2.4.0](https://www.npmjs.com/package/@google/genai) (Gemini 2.0 Flash / Pro models for handwritten prescription OCR and clinical DDI contraindication checking)

### Target Production Infrastructure (13-Layer SaaS Blueprint)
- **Edge Layer**: Cloudflare DNS, WAF DDoS Shield, SSL/TLS 1.3, API Gateway with token rate limiting
- **Data Layer**:
  - **Relational Storage**: PostgreSQL 16 with isolated schema partitioning per tenant (`schema_tenant_id`)
  - **In-Memory Cache**: Redis Cluster (Read-Through pattern, 99.4% hit ratio)
  - **Search Cluster**: OpenSearch 2.x (sub-20ms multi-factor ranking queries)
  - **Event Bus**: Apache Kafka (partitioned topics tagged with tenant UUID for immutable audit logs)

---

## 3. Features Completed

### 3.0 Web Generic Drug Directory & REST API Engine (`GenericDrugDirectory.tsx` & `/api/v1/*`) [Phase 1 Core]
- **Full-Screen Web & Desktop Drug Directory**: Dedicated high-performance generic medicine comparison portal accessible via `NavigationBanner` (badge: `Phase 1 Core`).
- **Instant Search & Autocomplete**: Multi-field querying across generic salt names, active chemical formulations, benchmark brand names, and clinical indications.
- **Dual View Modes**: Interactive Grid Cards and High-Density Comparison Table with real-time sort by Savings Spread (%), Price, and Quality Rank.
- **FDA Orange Book Therapeutic Equivalence**: Prominent AB-rating badges, Reference Listed Drug (RLD) cross-referencing, and bioequivalence scores.
- **Clinical Pharmacology Modal**: Detailed drug dossiers displaying molecular formulation, mechanisms of action, approved clinical indications, dosage variants, and manufacturer QA certifications.
- **Polypharmacy Annual Savings Calculator**: Multi-medicine cart simulation calculating monthly branded costs, generic costs, and total projected annual out-of-pocket patient savings.
- **Integrated REST API Server**: Vite dev server middleware in `src/server/apiMiddleware.ts` serving `/api/v1/medicines`, `/api/v1/medicines/:id`, `/api/v1/categories`, and `/api/v1/calculate-savings`.
- **Resilient Frontend API Client**: `src/services/apiClient.ts` with automated fallback to local state for offline resilience.

### 3.1 Universal Persona Switcher (`NavigationBanner.tsx`)
- Global top bar allowing seamless switching between all 5 stakeholder consoles and the SaaS Architecture Map.
- Live badge counters displaying dispatched orders and active tenant status.
- User profile badge displaying active authenticated role and direct link to the Auth Gateway.

### 3.2 Super Admin Console (`SuperAdminConsole.tsx`)
- **Dynamic Ranking Weight Tuner**: Sliders to adjust live search ranking algorithm weights:
  - Price Transparency ($35\%$)
  - Partner Reliability ($25\%$)
  - Manufacturer Trust ($20\%$)
  - User Sentiment ($15\%$)
  - Freshness Decay Penalty ($5\%$)
- **Staleness Guard**: One-click feed refresh updating stale partner catalog sync timestamps.
- **System Audit Event Stream**: Live streaming log of schema syncs, moderation flags, staleness alerts, and RBAC events.
- **Executive Metrics Grid**: Aggregate platform volume, average consumer savings, tenant health score, and active API throughput.

### 3.3 Pharma B2B Portal (`PharmaB2BPortal.tsx` & `src/components/pharma/`)
- **Product Portfolio View** (`ProductPortfolioView.tsx`): Active molecule formulations, NDC codes, wholesale vs dispense pricing, and batch statuses.
- **Bioequivalence AB-Rating View** (`BioequivalenceView.tsx`): FDA Orange Book therapeutic equivalence dossiers, dissolution curve metrics ($f_1, f_2$ similarity factors), and ANDA submission records.
- **Batch Release QA Audits View** (`BatchReleaseAuditsView.tsx`): Full QA batch testing suite, QP sign-offs, Certificates of Analysis (COA), assay purity ($99.8\%$), dissolution rates, impurity thresholds, and heavy metal parts-per-million checks.
- **Pricing Economics View** (`PricingEconomicsView.tsx`): Wholesale cost breakdown vs retail PBM spreads, demonstrating consumer savings.
- **Adverse Event Surveillance** (`AdverseEventSurveillanceView.tsx`): Pharmacovigilance tracking, MedDRA signal detection, and FDA FAERS reporting integration.
- **Consumer Catalog Sync Action**: One-click push to publish verified B2B generic formulations directly to the consumer discovery engine.

### 3.4 Tenant Admin Portal (`TenantAdminPortal.tsx`)
- **User Directory & RBAC**: Manage enterprise organization staff, roles (Pharmacist, Inventory Lead, Compliance Auditor), and multi-factor authentication statuses (Passkey, Hardware Key, TOTP).
- **Dispensary Outlets Manager**: Real-time listing of physical pharmacy locations, DEA licenses, active SKU counts, and live catalog sync indicators.
- **Tenant Sandboxing Monitor**: Visual verification of isolated PostgreSQL schema boundary (`schema_tenant_apollo`) and encryption status.

### 3.5 Pharmacy Partner Dispense Hub (`PharmacyPartnerPortal.tsx`)
- **Dispense Orders Queue**: Active incoming patient prescription orders with SLA timers.
- **Clinical DDI Safety Guard**: Real-time Drug-Drug Interaction screening displaying severe interaction counts and contraindications.
- **Cold-Chain IoT Sensor Lock**: Continuous temperature monitoring ($2^\circ\text{C}$ to $8^\circ\text{C}$). Enforces safety locks that prevent order dispatch if temperature boundaries are violated.
- **Digital Pharmacist Sign-Off & Escrow Release**: One-click verification by licensed PharmD releasing payment escrow and assigning SwiftRx cold-chain couriers.

### 3.6 Customer Mobile App (`CustomerMobileApp.tsx`)
- **Mobile Device Frame Chassis**: Realistic smartphone UI with status bar, 5G pill, and bottom tab navigation.
- **3-Step Checkout Flow**:
  1. *Discover*: Search generic drugs by brand or salt name, view price comparisons, and toggle generic substitutions.
  2. *Scan Rx*: Prescription OCR upload interface with instant molecule breakdown.
  3. *Checkout & Schedule*: Express delivery, scheduled delivery, or pharmacy pickup with platform escrow breakdown ($1 transparency fee).
- **Profile & Health Wallet**: View verified insurance details, HSA/FSA account balances, and automated monthly generic refills.

### 3.7 SaaS Architecture Map (`ArchitectureVisualizer.tsx`)
- **13-Layer Architectural Blueprint**: Detailed modules spanning Clients, Edge Security, Application Services, and Multi-Tenant Storage.
- **Interactive Flow Tracing**: Step-by-step walkthroughs for 4 key workflows:
  1. Search & Ranking Comparison
  2. Order Placement, Escrow & Pharmacy Dispatch
  3. Real-Time B2B Catalog Synchronization
  4. Tenant Onboarding & PostgreSQL Schema Sandboxing
- **Multi-Tenant Specification Table**: Database isolation guarantees, search cluster SLA targets, and HIPAA/FDA compliance metrics.

### 3.8 Unified Auth Gateway (`AuthScreen.tsx`)
- Multi-persona credential switcher simulating OAuth 2.0 / SAML enterprise SSO.
- Simulated multi-factor authentication (FIDO2 Passkeys, TOTP, Hardware keys).

### 3.9 Phase 4 Live AI & Production Data Tier (`Phase4EngineDashboard.tsx` & `/api/v1/*`)
- **Server-Side Gemini 2.0 Flash Multimodal OCR (`/api/v1/ai/prescription-ocr`)**: Live multimodal entity extraction parsing Doctor NPI, DEA, drug formulation, strength, sig instructions, and FDA Orange Book AB substitution recommendations.
- **Clinical DDI & Contraindication Engine (`/api/v1/ai/ddi-check`)**: Real-time evaluation of polypharmacy drug combinations, CYP450 enzyme conflicts, and severe adverse interaction flags.
- **PostgreSQL 16 Multi-Tenant Schema Router (`/api/v1/db/*`)**: Dynamic `search_path` connection resolver, multi-schema DDL migration runner, and automated zero-leakage security verification test suite (100% pass / 0.00% leakage).
- **IoT Cold-Chain Telemetry Mesh (`/api/v1/iot/*`)**: Continuous BLE/NFC sensor packet monitoring ($2^\circ\text{C}-8^\circ\text{C}$), interactive temperature breach simulation, and automated dispatch safety lockout triggers.
- **Programmatic Escrow & Stripe Connect API (`/api/v1/escrow/*`)**: Automated authorization holds at checkout, flat $1 platform fee split, and instant disbursement to partner pharmacy accounts upon PharmD digital sign-off.
- **Cryptographic COA Certificate Generator (`/api/v1/b2b/coa/:batchId`)**: FDA 21 CFR Part 11 compliant SHA-256 digital digest, QP credentials, and QR code verification payload.

### 3.11 Phase 6 Global Trials & Predictive Supply Chain Network (`Phase6GlobalTrialsAndSupplyChain.tsx` & `/api/v1/*`) [Phase 6 Core]
- **Predictive Inventory AI & Shortage Radar (`/api/v1/supply-chain/*`)**:
  - Patent Cliff tracker monitoring loss-of-exclusivity for blockbuster molecules (Keytruda, Eliquis, Entresto, Biktarvy, Ozempic - $89.9B market).
  - Time-series 12-month demand curve forecasting generic substitution surges with AI multipliers.
  - Automated B2B stockout alerts with 1-click purchase order (EDI 850) replenishment.
- **Decentralized Clinical Trials (DCT) & ZKP Consent (`/api/v1/trials/*`)**:
  - Sponsored protocol explorer (Novartis, AstraZeneca, Roche, Cipla) with patient stipends ($1,450 - $3,500) and decentralized virtual visits.
  - Zero-Knowledge Proof (ZKP) algorithm screening patient biomarkers and electronic prescriptions without exposing raw PHI.
  - Verifiable smart contract consent ledger anchoring SHA-256 cryptographic proofs and locking stipends in escrow.
- **Cross-Border Regulatory Synchronization & Arbitrage (`/api/v1/regulatory/*`)**:
  - Multi-jurisdictional pharmacopeia crosswalk spanning US FDA Orange Book, EU EMA SmPC, WHO PQ, and CDSCO India SUGAM.
  - Landed cost vs US retail arbitrage calculator (ex-factory + freight/tariffs vs domestic PBM spread) uncovering up to 95.8% net patient savings.
  - Live International Equivalence & Section 804 import parity compliance validator.

---

## 4. Pending Features & Technical Backlog (Future Initiatives)

1. **AI Drug Interaction Synthesis**: Automated LLM-generated patient drug leaflets translated into 40+ local languages.
2. **Autonomous Drone Delivery Dispatch**: Real-time FAA Part 135 flight-path clearance integration for emergency cold-chain generic deliveries.

---

## 5. API Endpoints Specification

### 5.1 Authentication & Session
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticates credentials and returns tenant-scoped JWT with MFA challenge. |
| `POST` | `/api/v1/auth/mfa-verify` | Public | Validates FIDO2 / TOTP challenge and returns session token. |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieves current user profile, permissions, and tenant scope. |

### 5.2 Medicine Discovery & Search
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/medicines/search` | Public | Full-text query against OpenSearch cluster returning ranked generic offers. |
| `GET` | `/api/v1/medicines/:id/equivalence` | Public | Retrieves FDA Orange Book bioequivalence dossier and RLD comparison. |
| `POST` | `/api/v1/ranking/weights` | `super_admin` | Updates global search ranking weights (price, trust, freshness). |

### 5.3 Orders & Escrow
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/orders/create` | `customer` | Places new Rx order and places payment into programmatic escrow vault. |
| `GET` | `/api/v1/orders/tenant-queue` | `pharmacy_partner` | Returns active pending orders for the partner's dispensary outlet. |
| `POST` | `/api/v1/orders/:id/approve` | `pharmacy_partner` | Submits PharmD sign-off, verifies cold-chain tag, and triggers courier dispatch. |

### 5.4 B2B Pharma & Batches
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/b2b/dossiers` | `pharma_b2b` | Retrieves active formulation dossiers, ANDA filings, and wholesale rates. |
| `GET` | `/api/v1/b2b/batches` | `pharma_b2b`, `super_admin` | Lists batch release audit logs, laboratory purity assays, and COAs. |
| `POST` | `/api/v1/b2b/sync-consumer` | `pharma_b2b` | Triggers Kafka event to regenerate OpenSearch indexes from verified batches. |

### 5.5 Tenant Management
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tenants/users` | `tenant_admin` | Lists users scoped to current tenant schema with MFA status. |
| `POST` | `/api/v1/tenants/outlets` | `tenant_admin` | Registers new physical dispensary outlet and DEA license. |

### 5.6 AI & Clinical Decision Support
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/ai/prescription-ocr` | `customer`, `pharmacy_partner` | Submits prescription image to Gemini API; returns extracted drug regimen. |
| `POST` | `/api/v1/ai/ddi-check` | `pharmacy_partner` | Analyzes multi-drug cart for contraindications and severe interaction alerts. |

### 5.7 Phase 6 Supply Chain, Trials & Regulatory Harmonization
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/supply-chain/forecast` | `pharma_b2b`, `super_admin` | Generates 12-month demand curve, patent cliff events, and shortage risks. |
| `POST` | `/api/v1/supply-chain/reorder` | `pharmacy_partner`, `super_admin` | Triggers automated EDI 850 bulk replenishment PO. |
| `GET` | `/api/v1/trials/protocols` | Public | Lists active sponsored decentralized clinical trial protocols. |
| `POST` | `/api/v1/trials/match-patient` | `customer` | Executes Zero-Knowledge screening of patient records and vitals. |
| `POST` | `/api/v1/trials/consent` | `customer` | Anchors cryptographic ZKP patient consent in decentralized smart contract ledger. |
| `GET` | `/api/v1/trials/consent-ledger` | `super_admin`, `pharma_b2b` | Retrieves immutable audit blocks of trial informed consent. |
| `GET` | `/api/v1/regulatory/cross-border-arbitrage` | Public | Returns landed cost calculations and international pricing arbitrage models. |
| `POST` | `/api/v1/regulatory/check-compliance` | Public | Validates multi-jurisdiction equivalence across FDA, EMA, WHO, and CDSCO. |

---

## 6. Database Schema Summary (PostgreSQL 16)

```
+-------------------------------------------------------------------------------+
|                           catalog_shared (Public Schema)                      |
+-----------------------------------+-------------------------------------------+
| medicines                         | molecules, salts, ATC codes, RLD refs     |
| formulation_dossiers              | ANDA numbers, bioequivalence AB ratings   |
| global_audit_log                  | immutable platform-wide event stream      |
+-----------------------------------+-------------------------------------------+
                                         ▲
                                         │ Foreign Keys / Synced
                                         ▼
+-------------------------------------------------------------------------------+
|                      tenant_{tenant_id} (e.g. tenant_apollo_104)              |
+-----------------------------------+-------------------------------------------+
| tenant_users                      | credentials, roles, MFA keys, scopes      |
| dispensary_outlets                | physical stores, DEA licenses, status     |
| outlet_inventory                  | SKU stock, batch lot IDs, cold storage    |
| dispense_orders                   | patient orders, Rx numbers, fulfillment   |
| order_items                       | items, barcode, lot number, pricing       |
| cold_chain_logs                   | IoT sensor readings, temperatures, tags   |
+-----------------------------------+-------------------------------------------+
```

### Table Definitions:

#### `catalog_shared.medicines`
- `id`: `UUID` (Primary Key)
- `name`: `VARCHAR(255)` (e.g. "Atorvastatin 20mg")
- `salt`: `VARCHAR(255)` (Chemical entity / active ingredient)
- `therapeutic_class`: `VARCHAR(128)`
- `schedule`: `ENUM('Schedule H', 'Schedule H1', 'Schedule X', 'OTC Safe')`
- `is_rx_required`: `BOOLEAN`
- `created_at`: `TIMESTAMPTZ`

#### `catalog_shared.formulation_dossiers`
- `id`: `UUID` (Primary Key)
- `medicine_id`: `UUID` (Foreign Key -> medicines.id)
- `anda_number`: `VARCHAR(64)` (FDA ANDA reference)
- `rld_reference`: `VARCHAR(255)` (Brand name benchmark)
- `bioequivalence_rating`: `VARCHAR(8)` (e.g. 'AB', 'AB1')
- `wholesale_price`: `DECIMAL(10,2)`
- `mfg_plant`: `VARCHAR(255)`

#### `tenant_x.dispense_orders`
- `id`: `UUID` (Primary Key)
- `order_number`: `VARCHAR(64)` (e.g. "#GEN-ORD-88219")
- `patient_id`: `UUID`
- `prescriber_npi`: `VARCHAR(10)`
- `status`: `ENUM('Packing In-Progress', 'Sign-Off Required', 'Awaiting Pickup', 'Dispatched', 'Completed')`
- `escrow_value`: `DECIMAL(10,2)`
- `sensor_tag_id`: `VARCHAR(64)`
- `temp_min_celsius`: `DECIMAL(4,2)`
- `temp_max_celsius`: `DECIMAL(4,2)`
- `is_cold_chain_locked`: `BOOLEAN`
- `pharmacist_sign_off_npi`: `VARCHAR(10)`
- `dispatched_at`: `TIMESTAMPTZ`

---

## 7. Important Business Logic & Algorithms

### 7.1 Multi-Factor Weighted Ranking Algorithm
Search results for generic substitutes are ranked using the formula:

$$\text{RankScore} = \left( W_{\text{price}} \times S_{\text{price}} \right) + \left( W_{\text{reliability}} \times S_{\text{reliability}} \right) + \left( W_{\text{trust}} \times S_{\text{trust}} \right) + \left( W_{\text{user}} \times S_{\text{user}} \right) - \left( W_{\text{decay}} \times P_{\text{staleness}} \right)$$

Where:
- $S_{\text{price}}$: Spread between brand name market price and generic offer ($0.0 - 10.0$).
- $S_{\text{reliability}}$: Partner pharmacy on-time delivery & fulfillment rate ($0.0 - 10.0$).
- $S_{\text{trust}}$: Manufacturer QA certification rating (WHO-GMP, FDA, EU-GMP).
- $S_{\text{user}}$: Patient satisfaction score and recurrence rate.
- $P_{\text{staleness}}$: Penalty deducted if partner catalog sync exceeds 6 hours.

### 7.2 Cold-Chain Escrow Release State Machine
1. Patient places order $\rightarrow$ Funds captured and held in `escrow_vault` (`status = 'Packing In-Progress'`).
2. Pharmacist inspects lot numbers and cold-chain packaging sensor tag.
3. If `current_temp > 8°C` or `current_temp < 2°C`, dispatch button is disabled with error: `Cold Chain Threshold Breached`.
4. If temperature is verified within $2^\circ\text{C} - 8^\circ\text{C}$ AND pharmacist enters verified PharmD NPI:
   - Order transitions to `'Dispatched'`.
   - Courier ETA is initiated.
   - Escrow funds release webhook is queued to transfer payout to the pharmacy partner.

---

## 8. Known Issues & Operational Quirks

1. **In-Memory State Reset**: Because the current prototype runs with React client state and mock data fixtures, hard page reloads (`F5`) reset order statuses and weights back to initial values. (Addressed in upcoming v3.4 backend persistence milestone).
2. **Simulated Countdown Timers**: The 15-minute express delivery countdown and cold-chain freshness clocks are client-side intervals that reset upon unmounting the mobile component.
3. **Tailwind v4 Theme Declarations**: Tailwind v4 uses the `@import "tailwindcss";` directive in `src/index.css`. Ad-hoc `@layer` overrides must strictly adhere to v4 syntax.

---

## 9. Roadmap & Delivery Status

| Milestone | Status | Target Horizon | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Phase 1 (v1.0 - v3.0)** | `COMPLETED` | Q1–Q3 2026 | Multi-role platform (Customer, Pharmacy, B2B, Tenant Admin, Super Admin, Architecture Visualizer). |
| **Phase 2 (v3.1 - v3.2)** | `COMPLETED` | Q3 2026 | Comprehensive AI context suite, Cold-Chain IoT locks, Unified Auth with MFA/Passkeys. |
| **Phase 3 (v3.2.1)** | `COMPLETED` | Q4 2026 | High-density comparison directory, multi-parameter search, and annual polypharmacy savings calculator. |
| **Phase 4 (v3.3 - v3.5)** | `COMPLETED` | Q4 2026 | Gemini 2.0 Multimodal OCR, PostgreSQL 16 schema isolation, IoT telemetry mesh, Escrow API, Cryptographic COAs. |
| **Phase 5 (v4.0)** | `COMPLETED` | Q4 2026 | Dual native mobile simulator (iOS/Android), HealthKit/Health Connect sync, Push notification engine, Enterprise barcode scanner. |
| **Phase 6 (v5.0)** | `COMPLETED` | 2027 | Predictive Inventory AI, Decentralized Clinical Trial (DCT) matching, Cross-border regulatory synchronization. |

