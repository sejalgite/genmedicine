# Architectural & Product Decision Records (ADRs)

This document captures all significant technical, architectural, and product decisions for the **GenMedicine** platform. It provides persistent context for AI coding assistants and engineers regarding *why* specific patterns, technologies, and paradigms are used.

---

## Index of Decisions

- [ADR-001: Multi-Tenant Architecture — Isolated PostgreSQL Schemas vs Shared Database](#adr-001-multi-tenant-architecture--isolated-postgresql-schemas-vs-shared-database)
- [ADR-002: Real-Time Hybrid Drug Discovery Engine — OpenSearch + Redis Read-Through Cache](#adr-002-real-time-hybrid-drug-discovery-engine--opensearch--redis-read-through-cache)
- [ADR-003: UI Tech Stack — React 19, TypeScript, Tailwind CSS v4, and Lucide React](#adr-003-ui-tech-stack--react-19-typescript-tailwind-css-v4-and-lucide-react)
- [ADR-004: Unified Cross-Persona Simulation Architecture & Global App State](#adr-004-unified-cross-persona-simulation-architecture--global-app-state)
- [ADR-005: Pharmaceutical Regulatory Compliance — FDA Orange Book Bioequivalence AB-Rating Engine](#adr-005-pharmaceutical-regulatory-compliance--fda-orange-book-bioequivalence-ab-rating-engine)
- [ADR-006: Pharmacy Order Fulfillment, Cold-Chain IoT Sensor Lock, and Escrow Release](#adr-006-pharmacy-order-fulfillment-cold-chain-iot-sensor-lock-and-escrow-release)
- [ADR-007: Prescription OCR & AI Drug Interaction Guardrails — Server-Side Gemini API](#adr-007-prescription-ocr--ai-drug-interaction-guardrails--server-side-gemini-api)
- [ADR-008: Immutable Audit & Governance Trail — Kafka Event Bus & Append-Only Audit Logging](#adr-008-immutable-audit--governance-trail--kafka-event-bus--append-only-audit-logging)
- [ADR-009: Authentication & RBAC — Multi-Role Unified Gateway with FIDO2/TOTP MFA Simulation](#adr-009-authentication--rbac--multi-role-unified-gateway-with-fido2totp-mfa-simulation)
- [ADR-010: Pricing Transparency Spread & Escrow Payment Vault](#adr-010-pricing-transparency-spread--escrow-payment-vault)

---

## ADR-001: Multi-Tenant Architecture — Isolated PostgreSQL Schemas vs Shared Database

- **Status**: Accepted
- **Date**: 2026-03-12
- **Context / Problem**: 
  GenMedicine serves disparate enterprise pharma clients (e.g., Cipla, Sun Pharma), pharmacy networks (e.g., Apollo Health, MedPlus), and consumers. Healthcare data security laws (HIPAA, GDPR, FDA 21 CFR Part 11) mandate strict tenant data isolation. We needed to choose between:
  1. Shared database with `tenant_id` column and Row-Level Security (RLS).
  2. Isolated PostgreSQL schema per tenant (`schema_tenant_apollo`, `schema_tenant_cipla`).
  3. Separate database instance per tenant.
- **Decision Taken**: 
  Adopt an **isolated PostgreSQL schema-per-tenant** model managed through dynamic database connection routing and `search_path` configuration, backed by tenant-specific encryption keys (BYOK).
- **Reasoning**:
  - Eliminates accidental cross-tenant data leaks caused by missing `WHERE tenant_id = x` clauses.
  - Allows independent schema migrations, tenant backup/restore, and custom audit retention per enterprise partner.
  - Avoids the extreme operational cost and connection pool fragmentation of hundreds of separate database servers.
- **Alternatives Considered**:
  - *Shared Table with RLS*: Lower operational overhead, but a single application-layer query misconfiguration could leak Protected Health Information (PHI).
  - *Separate DB Instances*: Maximum physical isolation, but prohibitive maintenance overhead, resource underutilization, and complex cross-tenant aggregation for platform analytics.
- **Impact on Project**:
  - Application code must always resolve the tenant context prior to database querying.
  - Migration runners must apply DDL migrations iteratively across all active tenant schemas.
  - Tenant Admin console includes schema provisioning and status monitors.

---

## ADR-002: Real-Time Hybrid Drug Discovery Engine — OpenSearch + Redis Read-Through Cache

- **Status**: Accepted
- **Date**: 2026-03-28
- **Context / Problem**: 
  Consumers and pharmacy dispatch operators search through hundreds of thousands of generic molecules, brand names, formulations, NDC codes, and active ingredients. Search requests must resolve under 20ms while factoring in dynamic ranking weights (price transparency, reliability, freshness, trust).
- **Decision Taken**: 
  Deploy a dual-layer search architecture:
  1. **OpenSearch 2.x Cluster**: Full-text fuzzy matching, phonetic search (Metaphone) for complex chemical salt names, and multi-factor ranking scoring.
  2. **Redis Cluster (Read-Through)**: In-memory caching for popular salt comparisons, pre-computed generic substitution recommendations, and active pharmacy partner stock levels with a 99.4% target hit ratio.
- **Reasoning**:
  - Relational databases (PostgreSQL) cannot perform sub-20ms multi-token fuzzy search across massive pharmaceutical catalogs while calculating multi-parameter ranking weights.
  - Caching identical molecule queries in Redis offloads over 90% of repeat search traffic.
- **Alternatives Considered**:
  - *PostgreSQL `pg_trgm` / Full-Text Search*: Adequate for small catalogs, but degraded performance under concurrent load with complex ranking formulas.
  - *Algolia / Pinecone SaaS*: High cost per search operation; external SaaS raises HIPAA/PHI compliance concerns when query strings contain specific patient medication regimens.
- **Impact on Project**:
  - `SuperAdminConsole` provides an interactive slider interface allowing platform administrators to adjust ranking weights dynamically.
  - Data syncing pipeline must invalidate Redis cache keys whenever B2B partners push batch updates.

---

## ADR-003: UI Tech Stack — React 19, TypeScript, Tailwind CSS v4, and Lucide React

- **Status**: Accepted
- **Date**: 2026-04-05
- **Context / Problem**: 
  The frontend requires responsive dashboards for enterprise pharma compliance officers, rapid order dispatchers in high-volume pharmacies, mobile-first consumer interfaces, and complex interactive architecture diagrams.
- **Decision Taken**: 
  Build the frontend with **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4 (Vite plugin)**, and **Lucide React** icons, bundled via **Vite 6**.
- **Reasoning**:
  - React 19 provides modern rendering primitives, streamlined state hooks, and concurrency.
  - TypeScript ensures compile-time type safety across complex pharmaceutical domain models (`MedicineOffer`, `FormulationDossier`, `DispenseOrder`, etc.).
  - Tailwind CSS v4 provides a fast, zero-configuration CSS runtime with first-class utility performance and modern CSS features.
  - Lucide React delivers lightweight, tree-shakeable icons for clinical, inventory, and administrative workflows.
- **Alternatives Considered**:
  - *Next.js App Router*: High server runtime complexity for an application that operates primarily as a rich single-page client/portal in its prototype and staging phases.
  - *Material UI / Ant Design*: Heavy bundles, rigid component styling, and difficult customization for custom medical and mobile frame interfaces.
- **Impact on Project**:
  - Rapid UI iteration with instant Vite HMR.
  - Clean component hierarchies in `src/components/` and strict typing in `src/types.ts`.

---

## ADR-004: Unified Cross-Persona Simulation Architecture & Global App State

- **Status**: Accepted
- **Date**: 2026-05-14
- **Context / Problem**: 
  GenMedicine serves 5 distinct user roles: Super Admin, B2B Pharma Manufacturer, Tenant Admin, Pharmacy Dispense Hub, and Mobile Customer. Stakeholders and QA engineers needed to demonstrate and verify end-to-end data flows (e.g. customer places order -> pharmacy packs & releases cold-chain -> B2B inventory updates -> Super Admin audits) within a single unified interactive prototype.
- **Decision Taken**: 
  Implement a **Cross-Persona Simulation Architecture** in `src/App.tsx` governed by a global `NavigationBanner` persona switcher. Global shared state holds orders, audit events, ranking weights, and tenant rosters in memory with cross-screen event triggers.
- **Reasoning**:
  - Allows instant testing and verification of complex multi-party lifecycle flows without requiring 5 separate login instances or browser windows.
  - Cross-screen event handlers (`handleApproveOrder`, `handleOrderPlacedFromCustomer`, `handleSyncToConsumer`) automatically append audit logs visible across the entire platform.
- **Alternatives Considered**:
  - *Strict URL route splitting with hard authentication walls*: Required logging out and in repeatedly, slowing down multi-stakeholder product reviews and live demos.
- **Impact on Project**:
  - All personas stay in sync. Placing an order in Customer Mobile immediately reflects in Pharmacy Partner Dispense Queue and Super Admin Audit Stream.

---

## ADR-005: Pharmaceutical Regulatory Compliance — FDA Orange Book Bioequivalence AB-Rating Engine

- **Status**: Accepted
- **Date**: 2026-06-02
- **Context / Problem**: 
  Generic drug substitution is heavily regulated. Recommending a non-equivalent drug could cause clinical failure or regulatory fines. We needed an authoritative standard for certifying generic equivalence.
- **Decision Taken**: 
  Adopt the **FDA Orange Book Therapeutic Equivalence (TE) Code standard**, specifically prioritizing **AB-rated** bioequivalent formulations (same active ingredient, dosage form, route of administration, strength, and bioequivalence).
- **Reasoning**:
  - "AB" rating provides gold-standard clinical assurance that the generic can be safely substituted without physician intervention.
  - Transparently displaying the Reference Listed Drug (RLD), ANDA dossier number, dissolution profiles, and assay purity protects the platform from liability and builds consumer trust.
- **Alternatives Considered**:
  - *Generic chemical name matching only*: Dangerous; ignores release profile differences (e.g., immediate-release vs extended-release matrix).
  - *Custom internal scoring*: Lacks regulatory standing and physician acceptance.
- **Impact on Project**:
  - `src/components/pharma/BioequivalenceView.tsx` and `BatchReleaseAuditsView.tsx` provide complete laboratory and regulatory proof cards.
  - Mobile consumer cards display bioequivalence badges ("FDA AB-Rated Generic Substitute").

---

## ADR-006: Pharmacy Order Fulfillment, Cold-Chain IoT Sensor Lock, and Escrow Release

- **Status**: Accepted
- **Date**: 2026-06-25
- **Context / Problem**: 
  Temperature-sensitive medications (e.g., insulin, biologics) degrade if cold-chain thresholds (2°C–8°C) are breached. Additionally, pharmacists require cryptographic proof of identity before dispensing Schedule H/H1 drugs.
- **Decision Taken**: 
  Incorporate an **IoT Cold-Chain Sensor Lock & Escrow Verification** workflow:
  1. Packaging sensor tag (NFC/BLE) logs continuous temperature.
  2. Order status cannot advance to "Dispatched" until the sensor tag reports temperatures within the safe window (2°C–8°C).
  3. Registered Pharmacist (PharmD) must submit digital sign-off with license verification.
  4. Escrow funds are released to the pharmacy only upon successful cold-chain courier acceptance.
- **Reasoning**:
  - Prevents spoiled medication from reaching patients.
  - Eliminates payment disputes between insurers, pharmacies, and patients via programmatic escrow holds.
- **Alternatives Considered**:
  - *Manual paper checklist*: High human error rate, no real-time auditability.
  - *Post-delivery cold-chain inspection*: Too late; patient might consume compromised medication.
- **Impact on Project**:
  - `PharmacyPartnerPortal.tsx` features live cold-chain status indicators, sensor verification locks, and DDI safety checks prior to dispatch button enablement.

---

## ADR-007: Prescription OCR & AI Drug Interaction Guardrails — Server-Side Gemini API

- **Status**: Accepted
- **Date**: 2026-07-10
- **Context / Problem**: 
  Handwritten and formatted doctor prescriptions are difficult for consumers to decode into generic equivalents. Furthermore, polypharmacy patients risk adverse Drug-Drug Interactions (DDIs).
- **Decision Taken**: 
  Integrate **Google Gemini API (@google/genai)** on the server-side (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) for:
  1. Multimodal prescription image OCR and structured extraction (Drug Name, Strength, Dosage, Frequency, Prescriber NPI).
  2. Clinical cross-referencing for contraindications and severe Drug-Drug Interactions (DDIs).
- **Reasoning**:
  - Gemini's multimodal capabilities excel at deciphering handwritten clinical scripts and unstructured medical packaging.
  - Server-side invocation prevents client-side exposure of API keys and allows HIPAA-compliant data scrubbing before model submission.
- **Alternatives Considered**:
  - *Traditional Tesseract OCR*: Unusable for physician handwriting and non-standard prescription formats.
  - *Pure client-side Gemini calls*: High security vulnerability due to exposed API credentials in browser bundles.
- **Impact on Project**:
  - `.env.example` documents `GEMINI_API_KEY`.
  - UI includes prescription upload, scanning simulation, and DDI safety clearance flags.

---

## ADR-008: Immutable Audit & Governance Trail — Kafka Event Bus & Append-Only Audit Logging

- **Status**: Accepted
- **Date**: 2026-07-28
- **Context / Problem**: 
  FDA 21 CFR Part 11 and HIPAA require an immutable, tamper-evident audit trail for every prescription modification, order dispatch, schema alteration, and privilege change.
- **Decision Taken**: 
  Establish an **Append-Only Event Stream Architecture** modeled on Apache Kafka topics with partition headers containing authenticated Tenant UUIDs, visualized through `AuditEvent` models in the platform UI.
- **Reasoning**:
  - Prevents administrative tampering or retroactive edits to prescription release records.
  - Enables event-driven consumers (notification services, courier dispatchers, regulatory reporting) to react asynchronously.
- **Alternatives Considered**:
  - *Traditional mutable SQL audit table*: Vulnerable to database admin tampering or accidental cascading deletes.
- **Impact on Project**:
  - Every major action across all personas creates an `AuditEvent` with type (`SCHEMA_SYNC`, `MODERATION_FLAG`, `STALENESS_GUARD`, `RBAC_AUDIT`, `CONFIG_CHANGE`).
  - Super Admin console streams audit events in real time.

---

## ADR-009: Authentication & RBAC — Multi-Role Unified Gateway with FIDO2/TOTP MFA Simulation

- **Status**: Accepted
- **Date**: 2026-08-15
- **Context / Problem**: 
  Users access the platform across 5 distinct security personas ranging from high-privilege Super Admins down to consumers. Weak authentication in healthcare systems leads to credential stuffing and unauthorized drug access.
- **Decision Taken**: 
  Build a **Multi-Role Unified Auth Gateway (`AuthScreen.tsx`)** supporting:
  - Role-Based Access Control (RBAC) across `customer`, `pharmacy_partner`, `pharma_b2b`, `tenant_admin`, and `super_admin`.
  - Simulated Multi-Factor Authentication (FIDO2 Passkeys, Hardware Keys, and TOTP Authenticators).
  - Granular permission scoping and tenant isolation tags.
- **Reasoning**:
  - Enforces least-privilege security. Pharmacists cannot alter B2B wholesale pricing; B2B manufacturers cannot view individual patient health data.
  - Prepares the application for enterprise Single Sign-On (SAML / Okta / Azure AD).
- **Alternatives Considered**:
  - *Separate login portals on distinct domains*: High maintenance overhead and fragmented user management.
  - *Single role with feature flags*: Insufficient security segregation for HIPAA enterprise audit compliance.
- **Impact on Project**:
  - Global `currentUser` state controls role workspaces and auto-navigates on successful authentication.
  - Authentication events trigger immediate audit logging.

---

## ADR-010: Pricing Transparency Spread & Escrow Payment Vault

- **Status**: Accepted
- **Date**: 2026-09-01
- **Context / Problem**: 
  Pharmaceutical pricing in traditional supply chains is opaque, with pharmacy benefit managers (PBMs) taking hidden spreads. Consumers overpay up to 85% compared to generic manufacturing costs.
- **Decision Taken**: 
  Implement an **Open Pricing Transparency Model** featuring:
  - Exact formula breakdown: Manufacturing Cost + B2B Wholesale + Pharmacy Dispense Margin + Flat $1 Platform Transparency Fee.
  - Programmatic Escrow Vault: Customer payment is locked in escrow upon checkout and only disbursed to the partner pharmacy when verified pharmacist sign-off and courier handoff occur.
- **Reasoning**:
  - Builds customer trust by demonstrating exact dollar savings compared to branded counterparts.
  - Protects patients from being charged for out-of-stock or unfulfilled prescriptions.
- **Alternatives Considered**:
  - *Direct immediate merchant charge*: High chargeback rates when pharmacies cannot fulfill due to stock-outs.
  - *Hidden markup model*: Contradicts the foundational core mission of GenMedicine.
- **Impact on Project**:
  - Customer checkout displays exact savings spread percentage (e.g. 23% savings, $35.00 saved).
  - Escrow amounts are tracked in `DispenseOrder.escrowValue`.

---

## ADR-011: Server-Side Gemini 2.0 Multimodal OCR & PostgreSQL 16 Multi-Tenant Schema Routing

- **Status**: Accepted
- **Date**: 2026-10-08
- **Context / Problem**: 
  Patients frequently upload complex handwritten physician prescriptions or non-standard EHR summary printouts. Processing these client-side poses severe security and HIPAA risks (exposing API keys or PHI). Furthermore, multi-tenant databases require strict, mathematically verifiable isolation across hospital and pharmacy chains without data leakage.
- **Decision Taken**: 
  1. Implement a **Server-Side Gemini 2.0 Flash Multimodal OCR Endpoint (`/api/v1/ai/prescription-ocr`)** via `@google/genai` with strict JSON clinical extraction schemas and clinical guardrails.
  2. Implement a **PostgreSQL 16 Multi-Tenant Connection Pooler & Dynamic Schema Router (`/api/v1/db/*`)** resolving `search_path = schema_{tenant_id}` with automated DDL migrations and a zero-leakage security verification test suite.
- **Reasoning**:
  - Gemini 2.0 Flash excels at low-latency clinical entity recognition (Doctor NPI/DEA, formulation, dosage, frequency, and DAW status).
  - Server-side execution preserves credential hygiene and enforces zero PHI client exposure.
  - PostgreSQL schema routing guarantees 0.00% cross-tenant data leakage while enabling shared table queries for global drug catalogs.
- **Impact on Project**:
  - Dedicated `Phase4EngineDashboard` console and live integration in `CustomerMobileApp`, `PharmacyPartnerPortal`, and `TenantAdminPortal`.

---

## ADR-012: Cross-Platform Native Mobile Architecture & Bi-Directional Health Sync

- **Status**: Accepted
- **Date**: 2026-10-15
- **Context / Problem**: 
  Chronic disease patients require mobile-first daily adherence tracking, automated vitals monitoring (HbA1c, blood pressure, fasting glucose), and push notification reminders. Furthermore, enterprise pharmacy dispense technicians require ultra-high-speed (sub-50ms) hardware barcode scanning (Zebra TC58, Honeywell Dolphin) rather than slow software camera feeds.
- **Decision Taken**: 
  1. Build a **Native Mobile Chassis & Sync Hub (`Phase5MobileHealthSuite.tsx` and `CustomerMobileApp.tsx`)** simulating iOS iPhone 16 Pro (Dynamic Island, Apple HealthKit) and Android Pixel 9 Pro (Material You, Google Health Connect).
  2. Implement **Bi-Directional Health Synchronization APIs (`/api/v1/health/sync` & `/api/v1/health/profile/:patientId`)** unifying Apple HealthKit JSON payloads and Google Health Connect data with live Drug-Allergy Profile Cross-Checking (e.g. Sulfa, Penicillin, ACE-inhibitor contraindications).
  3. Implement **Hardware Barcode Scanner Middleware (`/api/v1/hardware/scan`)** supporting Zebra TC58 and Honeywell SE5500 decoders for 1D/2D GS1 DataMatrix and NDC-11 parsing.
  4. Implement **Multi-Channel Push Notification Dispatcher (`/api/v1/notifications/push`)** with urgency tiers (Refill Alert, Critical Adherence, Cold-Chain Excursion, Dose Reminder).
- **Reasoning**:
  - Direct integration with Apple HealthKit and Google Health Connect enables automated adherence scoring and alerts doctors if vitals deteriorate after a generic substitution.
  - Hardware scanner compatibility allows enterprise high-volume pharmacy chains to verify dispensed lot numbers in milliseconds.
  - Biometric FaceID/TouchID security layer satisfies HIPAA requirements for mobile electronic PHI storage.
- **Impact on Project**:
  - Dual-chassis live interactive simulator with interactive HealthKit sync, notification dispatching, biometric auth, and barcode scanner testing.

---

## ADR-013: Global Decentralized Clinical Trials (DCT), Zero-Knowledge Proof Consent & Predictive Supply Chain Neural Engine

- **Status**: Accepted
- **Date**: 2026-11-01
- **Context / Problem**: 
  1. Drug shortages plague pharmacies worldwide due to sudden patent expirations, unexpected demand surges, and supply chain disruptions. Traditional static inventory models fail to anticipate patent cliff volume spikes.
  2. Clinical trial recruitment is notoriously slow and opaque, often failing to reach qualifying rare disease patients while raising immense PHI privacy concerns.
  3. International generic drug price disparities (e.g. US retail vs WHO-GMP ex-factory India/EU rates) create massive arbitrage opportunities that are hindered by complex multi-jurisdiction regulatory compliance differences.
- **Decision Taken**: 
  1. Implement a **Predictive Supply Chain & Patent Cliff AI Engine (`predictiveSupplyChainService.ts` & `/api/v1/supply-chain/*`)** tracking loss-of-exclusivity timelines ($89.9B market size), 12-month neural demand curves, and automated stockout replenishment POs.
  2. Implement a **Decentralized Clinical Trial (DCT) & Zero-Knowledge Consent Network (`clinicalTrialService.ts` & `/api/v1/trials/*`)** with protocol directory, ZKP patient eligibility screening without raw PHI exposure, and verifiable on-chain smart contract consent ledger.
  3. Implement a **Cross-Border Regulatory Harmonization & Landed Cost Arbitrage Engine (`crossBorderRegulatoryService.ts` & `/api/v1/regulatory/*`)** crosswalking US FDA Orange Book, EU EMA, WHO PQ, and India CDSCO standards, calculating landed costs (tariffs, air freight) to unlock 70%-95% consumer savings.
- **Reasoning**:
  - Proactive B2B replenishment prevents catastrophic dispensary stockouts before patent cliff surges occur.
  - Zero-Knowledge cryptographic hashing allows compliant patient pre-screening under HIPAA Title II and FDA 21 CFR Part 11.
  - Landed cost calculations provide transparent pricing arbitrage models while validating Section 804 import parity compliance.
- **Impact on Project**:
  - Flagship `Phase6GlobalTrialsAndSupplyChain.tsx` dashboard and complete backend service architecture integrated across the platform.


