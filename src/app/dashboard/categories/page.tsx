import UpsertDialog from "@/components/dashboard/categories/UpsertDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { FC } from "react";
import { DataTable } from "./data-table";

import { listCategories } from "@/lib/actions/CategoryActions";
import { columns } from "./columns";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const data = await listCategories();

  console.log(data);

  return (
    <Card className="space-y-6 font-thin ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Categories</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage product categories.
            </p>
          </div>
          {/* <UpsertDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Button>
            }
          /> */}
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};

export default Page;
