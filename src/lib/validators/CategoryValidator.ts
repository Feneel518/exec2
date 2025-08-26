import { z } from "zod";

export const categoryUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name is too short").max(80, "Max 80 chars"),
  description: z
    .string()
    .max(300, "Max 300 chars")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
  imageUrl: z.string().url().optional().or(z.literal("")), // 👈 add
});
export type CategoryUpsertInput = z.infer<typeof categoryUpsertSchema>;
