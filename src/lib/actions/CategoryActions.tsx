"use server";

import { revalidatePath } from "next/cache";
import { db } from "../prisma/db";
import { slugify } from "../utils";
import {
  CategoryUpsertInput,
  categoryUpsertSchema,
} from "../validators/CategoryValidator";
import z from "zod";

const idArraySchema = z.array(z.string().uuid()).min(1);

export async function listCategories() {
  const rows = await db.category.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  return rows;
}

export async function createCategory(input: CategoryUpsertInput) {
  const data = categoryUpsertSchema.parse(input);
  const slug = slugify(data.name);

  const created = await db.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      isActive: data.isActive,
      image: data.imageUrl || "",
    },
  });

  revalidatePath("/dashboard/categories");
  return created;
}
export async function updateCategory(input: CategoryUpsertInput) {
  const data = categoryUpsertSchema
    .extend({ id: z.string().uuid() })
    .parse(input);
  const slug = slugify(data.name);

  const updated = await db.category.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      isActive: data.isActive,
      image: data.imageUrl || "",
    },
  });

  revalidatePath("/dashboard/categories");
  return updated;
}

export async function deleteCategories(ids: unknown) {
  const parsed = idArraySchema.parse(ids);
  await db.category.deleteMany({ where: { id: { in: parsed } } });
  revalidatePath("/dashboard/categories");
  return { success: true, count: parsed.length };
}

export async function toggleActive(id: string, isActive: boolean) {
  const updated = await db.category.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/dashboard/categories");
  return updated;
}
