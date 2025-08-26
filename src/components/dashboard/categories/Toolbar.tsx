// src/app/(dashboard)/categories/_components/toolbar.tsx
"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import UpsertDialog from "./UpsertDialog";
import DeleteAlert from "./DeleteAlert";
import { Plus } from "lucide-react";

export default function Toolbar<TData>({ table }: { table: Table<TData> }) {
  const selected = table.getFilteredSelectedRowModel().rows;
  const ids = selected.map((r: any) => r.original.id) as string[];

  return (
    <div className="flex items-center gap-2">
      <UpsertDialog
        trigger={
          <Button variant="outline">
            <Plus></Plus>New Category
          </Button>
        }
      />
      {ids.length > 0 && (
        <DeleteAlert ids={ids}>
          <Button variant="destructive">Delete {ids.length}</Button>
        </DeleteAlert>
      )}
    </div>
  );
}
