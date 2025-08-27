import ProductDialog from "@/components/dashboard/products/ProductDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/prisma/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { columns, ProductRow } from "./column";
import { ProductsDataTable } from "./product-data-table";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const rows: ProductRow[] = (
    await db.product.findMany({
      include: {
        category: { select: { name: true } },
        variants: { select: { id: true } },
        includedComponents: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  ).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category.name,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    variants: p.variants.length,
    components: p.includedComponents.length,
    image: p.image ?? null,
  }));
  return (
    <Card className="space-y-6 font-thin ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Products</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage flameproof products.
            </p>
          </div>
          <Link className={buttonVariants()} href={"/dashboard/products/new"}>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Link>

          {/* <UpsertDialog
              trigger={
              }
            /> */}
        </div>
      </CardHeader>
      <CardContent>
        <ProductsDataTable columns={columns} data={rows}></ProductsDataTable>
        {/* <DataTable columns={columns} data={data} /> */}
      </CardContent>
    </Card>
  );
};

export default Page;
