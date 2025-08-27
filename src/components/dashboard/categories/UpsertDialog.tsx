// src/app/(dashboard)/categories/_components/upsert-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { CategoryImageUploader } from "@/components/global/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createCategory, updateCategory } from "@/lib/actions/CategoryActions";
import {
  CategoryUpsertInput,
  categoryUpsertSchema,
} from "@/lib/validators/CategoryValidator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  trigger: React.ReactNode;
  initial?: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    image?: string | null;
  };
};

export default function UpsertDialog({ trigger, initial }: Props) {
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(categoryUpsertSchema),
    defaultValues: {
      id: initial?.id,
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      isActive: initial?.isActive ?? true,
      imageUrl: initial?.image ?? "",
    },
  });
  const { isSubmitting } = form.formState;

  // Prevent closing while submitting
  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    setOpen(next);
  };

  const imageUrl = form.watch("imageUrl") || "";
  const onSubmit = async (values: CategoryUpsertInput) => {
    try {
      if (initial?.id) {
        await updateCategory({ ...values, id: initial.id });
        toast.success("Category updated");
      } else {
        await createCategory(values);
        toast.success("Category created");
        form.reset({ name: "", description: "", isActive: true });
      }
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    }
  };

  const clearImage = () => form.setValue("imageUrl", "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Flameproof Junction Boxes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Short description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  {/* <FormLabel>Thumbnail</FormLabel> */}
                  <FormControl>
                    <CategoryImageUploader
                      multiple={false}
                      value={form.watch("imageUrl") || ""}
                      onChange={(v) => {
                        const url = Array.isArray(v) ? v[0] : v;
                        form.setValue("imageUrl", url ?? "", {
                          shouldDirty: true,
                        });
                      }}
                      label="Thumbnail"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <FormLabel>Status</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Toggle to enable/disable this category.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : initial ? (
                  "Save changes"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
