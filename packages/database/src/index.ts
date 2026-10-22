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

// YouTube Media Engine (Phase 05)
export * from "./media/youtube";

// Projects Showcase Service & Repository (Phase 06)
export * from "./projects/service";

// Site Content Versioning & Dynamic Content Service (Phase 07)
export * from "./content/default-content";
export * from "./content/service";

// Client Lead Intake & Notification Pipeline (Phase 08)
export * from "./inquiries/types";
export * from "./inquiries/spam-filter";
export * from "./inquiries/notifications";
export * from "./inquiries/repository";
export * from "./inquiries/service";

