import { z } from "zod";

const variantSchema = z.object({
  subName: z.string().min(1, "Variant name required"),
  sku: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v?.trim() || undefined),
  typeNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v?.trim() || undefined),
  attributes: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      try {
        return JSON.parse(v);
      } catch {
        throw new Error("Variant attributes must be valid JSON");
      }
    }),
  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  drawingUrl: z
    .string()
    .url("Invalid drawing URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const productFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().uuid(),
  type: z.string().optional(),
  protection: z.string().optional(),
  gasGroup: z.string().optional(),
  material: z.string().optional(),
  finish: z.string().optional(),
  rating: z.string().optional(),
  terminals: z.string().optional(),
  hardware: z.string().optional(),
  gasket: z.string().optional(),
  mounting: z.string().optional(),
  cableEntry: z.string().optional(),
  earthing: z.string().optional(),
  typeNumber: z.string().optional(),
  hsnCode: z.string().min(1, "HSN Code is required"),
  cutoutSize: z.string().optional(),
  plateSize: z.string().optional(),
  glass: z.string().optional(),
  wireGuard: z.string().optional(),
  variant: z.string().optional(),
  size: z.string().optional(),
  rpm: z.string().optional(),
  kW: z.string().optional(),
  HorsePower: z.string().optional(),
  extraSpecs: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      try {
        return JSON.parse(v);
      } catch {
        throw new Error("extraSpecs must be valid JSON");
      }
    }),
  components: z
    .object({
      items: z.string(),
    })
    .array()
    .optional(),
  isActive: z.boolean().default(true),

  variants: z.array(variantSchema).default([]),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;
