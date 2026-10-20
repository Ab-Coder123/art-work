import { z } from "zod";

export const ADMIN_ROLES = ["super_admin", "editor", "viewer"] as const;

export const AdminRoleEnum = z.enum(ADMIN_ROLES);
export type AdminRole = z.infer<typeof AdminRoleEnum>;

/**
 * Zod schema for administrative user membership.
 */
export const AdminUserInputSchema = z.object({
  user_id: z.string().uuid("user_id must be a valid UUID matching auth.users"),
  email: z.string().email("Invalid admin email address"),
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  role: AdminRoleEnum.default("editor"),
  is_active: z.boolean().default(true),
});

export type AdminUserInput = z.infer<typeof AdminUserInputSchema>;

export interface AdminUserRow extends AdminUserInput {
  created_at: string;
  updated_at: string;
}
