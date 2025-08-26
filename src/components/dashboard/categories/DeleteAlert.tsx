// src/app/(dashboard)/categories/_components/delete-alert.tsx
"use client";

import { ReactNode, useTransition } from "react";
// import { deleteCategories } from "../actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteCategories } from "@/lib/actions/CategoryActions";

export default function DeleteAlert({
  ids,
  children,
}: {
  ids: string[];
  children: ReactNode;
}) {
  const [pending, start] = useTransition();

  const onDelete = () =>
    start(async () => {
      try {
        const res = await deleteCategories(ids);
        toast.success(
          `Deleted ${res.count} categor${res.count > 1 ? "ies" : "y"}`
        );
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to delete");
      }
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {ids.length} item{ids.length > 1 ? "s" : ""}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the
            categor{ids.length > 1 ? "ies" : "y"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
