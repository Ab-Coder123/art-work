import { z } from "zod";

/**
 * Environment variables schema for Art Work database & Supabase infrastructure.
 * Enforces strict typing, valid URL formats, and pooler compatibility.
 */
export const DatabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP/HTTPS URL")
    .default("http://127.0.0.1:54321"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(20, "NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid Supabase anonymous JWT key")
    .default("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key"),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(20, "SUPABASE_SERVICE_ROLE_KEY must be a valid Supabase service role key")
    .optional(),

  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, "DATABASE_URL must be a valid PostgreSQL connection URI")
    .default("postgresql://postgres:postgres@127.0.0.1:54322/postgres"),

  DATABASE_POOL_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, "DATABASE_POOL_URL must be a valid PostgreSQL connection URI")
    .refine(
      (url) => url.includes(":6543") || url.includes(":54329") || url.includes("pgbouncer=true"),
      {
        message:
          "DATABASE_POOL_URL must target a Supavisor/PgBouncer pooler port (6543 or 54329) or include ?pgbouncer=true",
      }
    )
    .default("postgresql://postgres:postgres@127.0.0.1:54329/postgres?pgbouncer=true"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type DatabaseEnv = z.infer<typeof DatabaseEnvSchema>;

/**
 * Parses and validates environment variables.
 * Returns typed configuration or throws detailed descriptive error.
 */
export function parseDatabaseEnv(env: Record<string, string | undefined> = process.env): DatabaseEnv {
  const result = DatabaseEnvSchema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues || (result.error as unknown as { errors: Array<{ path: string[]; message: string }> }).errors || [];
    const errorDetails = issues
      .map((err) => `  • [${err.path.join(".")}]: ${err.message}`)
      .join("\n");
    throw new Error(`[DatabaseEnv] Environment validation failed:\n${errorDetails}`);
  }
  return result.data;
}

/**
 * Validates pooler connection string to verify Supavisor transaction mode flags.
 */
export function validatePoolerUrl(poolUrl: string): { isValid: boolean; warning?: string } {
  try {
    const parsed = new URL(poolUrl);
    const isPoolerPort = parsed.port === "6543" || parsed.port === "54329";
    const hasPgbouncerParam = parsed.searchParams.get("pgbouncer") === "true";

    if (!isPoolerPort && !hasPgbouncerParam) {
      return {
        isValid: false,
        warning:
          "Database pooler URL does not use designated transaction pooler port (6543/54329) or missing ?pgbouncer=true query parameter.",
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      warning: "Invalid URL string provided for database pooler.",
    };
  }
}
