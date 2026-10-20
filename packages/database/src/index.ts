/**
 * @art-work/database
 * Core Supabase & PostgreSQL client infrastructure for Art Work platform
 */

// Configuration & Environment Validation
export * from "./config/env.js";

// Supavisor Connection Pooling
export * from "./pooler/connection.js";

// Supabase Clients (Browser, Server SSR, Guarded Admin)
export * from "./client/browser.js";
export * from "./client/server.js";
export * from "./client/admin.js";

// System Health & Deterministic Audits
export * from "./health/check.js";

// Canonical Migrations
export * from "./migrations/runner.js";

// Relational Schemas & Domain Models (Phase 02)
export * from "./schemas/index.js";
