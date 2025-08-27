import ProductDialog from "@/components/dashboard/products/ProductDialog";
import { listCategories } from "@/lib/actions/CategoryActions";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const categories = await listCategories();
  return (
    <div>
      <ProductDialog categories={categories}></ProductDialog>
    </div>
  );
};

export default Page;
