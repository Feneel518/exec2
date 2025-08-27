"use server";

import { Prisma } from "@/generated/prisma";
import { db } from "../prisma/db";
import {
  productFormSchema,
  ProductFormValues,
} from "../validators/ProductValidator";

export async function upsertProductAction(
  values: ProductFormValues & { productId?: string }
) {
  const parsed = productFormSchema.parse(values);

  // normalize variants: ensure only one default
  let defaultSeen = false;
  const variants = (parsed.variants ?? []).map((v) => {
    const clean = {
      subName: v.subName?.trim() ?? "",
      sku: v.sku?.trim() || undefined,
      typeNumber: v.typeNumber?.trim() || undefined,
      attributes: v.attributes ?? undefined, // string->JSON handled by Zod
      imageUrl: v.imageUrl || undefined,
      drawingUrl: v.drawingUrl || undefined,
      isDefault: Boolean(v.isDefault),
      isActive: v.isActive ?? true,
      sortOrder: Number.isFinite(v.sortOrder as any) ? Number(v.sortOrder) : 0,
    };

    if (clean.isDefault && !defaultSeen) {
      defaultSeen = true;
      return clean;
    }

    return { ...clean, isDefault: false };
  });

  if (!defaultSeen && variants.length > 0) {
    variants[0].isDefault = true;
  }
  if (!values.productId) {
    return await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: parsed.name,
          slug: parsed.slug,
          categoryId: parsed.categoryId,
          image: parsed.image || undefined,
          type: parsed.type,
          protection: parsed.protection,
          gasGroup: parsed.gasGroup,
          material: parsed.material,
          finish: parsed.finish,
          rating: parsed.rating,
          terminals: parsed.terminals,
          hardware: parsed.hardware,
          gasket: parsed.gasket,
          mounting: parsed.mounting,
          cableEntry: parsed.cableEntry,
          earthing: parsed.earthing,
          typeNumber: parsed.typeNumber,
          hsnCode: parsed.hsnCode,
          cutoutSize: parsed.cutoutSize,
          plateSize: parsed.plateSize,
          glass: parsed.glass,
          wireGuard: parsed.wireGuard,
          size: parsed.size,
          rpm: Number(parsed.rpm) ?? undefined,
          kW: parsed.kW ?? null,
          horsePower: Number(parsed.HorsePower) ?? null,
          extraSpecs: parsed.extraSpecs ?? undefined,
          isActive: parsed.isActive ?? true,
          includedComponents: {
            create: values.components?.map((c) => {
              return {
                productComponent: {
                  create: {
                    item: c.items,
                  },
                },
              };
            }),
          },
          variants: {
            create: variants.map((v) => ({
              subName: v.subName,
              sku: v.sku,
              typeNumber: v.typeNumber,
              attributes: v.attributes,
              imageUrl: v.imageUrl,
              drawingUrl: v.drawingUrl,
              isDefault: v.isDefault,
              isActive: v.isActive,
              sortOrder: v.sortOrder,
            })),
          },
        },
        select: { id: true, slug: true },
      });
      return { ok: true, id: product.id, slug: product.slug };
    });
  } else {
    const productId = values.productId;

    return await db.$transaction(async (tx) => {
      await tx.productComponentsOnProducts.deleteMany({
        where: { productId },
      });
      const updated = await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          name: parsed.name,
          slug: parsed.slug,
          categoryId: parsed.categoryId,
          image: parsed.image || undefined,
          type: parsed.type,
          protection: parsed.protection,
          gasGroup: parsed.gasGroup,
          material: parsed.material,
          finish: parsed.finish,
          rating: parsed.rating,
          terminals: parsed.terminals,
          hardware: parsed.hardware,
          gasket: parsed.gasket,
          mounting: parsed.mounting,
          cableEntry: parsed.cableEntry,
          earthing: parsed.earthing,
          typeNumber: parsed.typeNumber,
          hsnCode: parsed.hsnCode,
          cutoutSize: parsed.cutoutSize,
          plateSize: parsed.plateSize,
          glass: parsed.glass,
          wireGuard: parsed.wireGuard,
          size: parsed.size,
          rpm: Number(parsed.rpm) ?? null,
          kW: (parsed.kW as any) ?? null,
          horsePower: (parsed.HorsePower as any) ?? null,
          extraSpecs: parsed.extraSpecs ?? undefined,
          isActive: parsed.isActive ?? true,
          includedComponents: {
            create: values.components?.map((c) => {
              return {
                productComponent: {
                  create: {
                    item: c.items,
                  },
                },
              };
            }),
          },
        },
        select: { id: true, slug: true },
      });

      await tx.productVariant.deleteMany({ where: { productId } });

      if (variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v) => {
            return {
              id: crypto.randomUUID(),
              productId,
              subName: v.subName,
              sku: v.sku ?? null,
              typeNumber: v.typeNumber ?? null,
              attributes: v.attributes ?? Prisma.DbNull,
              imageUrl: v.imageUrl ?? null,
              drawingUrl: v.drawingUrl ?? null,
              isDefault: v.isDefault,
              isActive: v.isActive,
              sortOrder: v.sortOrder,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }),
          skipDuplicates: true,
        });
      }

      return { ok: true, id: updated.id, slug: updated.slug };
    });
  }
}
