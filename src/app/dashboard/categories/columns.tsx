// src/app/(dashboard)/categories/_components/columns.tsx
"use client";

import DeleteAlert from "@/components/dashboard/categories/DeleteAlert";
import StatusBadge from "@/components/dashboard/categories/StatusBadge";
import UpsertDialog from "@/components/dashboard/categories/UpsertDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image?: string | null; // 👈
  isActive: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<CategoryRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },
  {
    id: "thumb", // 👇 tiny preview
    header: "",
    cell: ({ row }) =>
      row.original.image ? (
        <img
          src={row.original.image}
          alt={row.original.name}
          className="h-10 w-10 rounded-md object-cover border"
        />
      ) : (
        <div className="h-10 w-10 rounded-md border bg-muted" />
      ),
    enableSorting: false,
    size: 12,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="line-clamp-2">{row.original.description || "—"}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex justify-end gap-2">
          <UpsertDialog
            initial={item}
            trigger={
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <DeleteAlert ids={[item.id]}>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteAlert>
        </div>
      );
    },
    enableHiding: false,
  },
];
