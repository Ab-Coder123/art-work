/**
 * @art-work/database
 * Core Supabase & PostgreSQL client infrastructure for Art Work platform
 */

// Configuration & Environment Validation
export * from "./config/env";

// Supavisor Connection Pooling
export * from "./pooler/connection";

// Supabase Clients (Browser, Server SSR, Guarded Admin)
export * from "./client/browser";
export * from "./client/server";
export * from "./client/admin";

// System Health & Deterministic Audits
export * from "./health/check";

// Relational Schemas & Domain Models (Phase 02)
export * from "./schemas/index";

// Authentication, Session Lifecycle & CSRF Defense (Phase 03)
export * from "./auth/index";
