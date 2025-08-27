"use client";

import CategorySelector from "@/components/global/CategorySelector";
import { ProductImageUploader } from "@/components/global/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/generated/prisma";
import { upsertProductAction } from "@/lib/actions/ProductActions";
import { ProductTechnicalList } from "@/lib/constants/productTechnicalList";
import { slugify } from "@/lib/utils";
import {
  productFormSchema,
  ProductFormValues,
} from "@/lib/validators/ProductValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProductDialogProps {
  productId?: string;
  categories: Category[];
}

const ProductDialog: FC<ProductDialogProps> = ({ productId, categories }) => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
      categoryId: "",
      isActive: true,
      components: [
        {
          items: "",
        },
      ],
      variants: [],
    },
  });

  // ensure only one default at a time in the UI
  const variants = form.watch("variants") || [];
  const setDefault = (idx: number) => {
    const next = variants.map((v: any, i: number) => ({
      ...v,
      isDefault: i === idx,
    }));
    form.setValue("variants", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const name = form.watch("name");
  form.setValue("slug", slugify(name));

  const onSubmit = (values: ProductFormValues) => {
    startTransition(async () => {
      const res = await upsertProductAction({ ...values, productId });

      if (res?.ok) {
        toast.success(productId ? "Product updated" : "Product created");
        router.push(`/dashboard/products`);
      } else {
        toast.error((res as any)?.error ?? "Failed to save product");
      }
    });
  };
  const { isSubmitting } = form.formState;
  const register = form.register;
  const {
    fields: componentsFields,
    append: componentsAppend,
    remove: componentsRemove,
  } = useFieldArray({
    control: form.control,
    name: "components" as const,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants" as const,
  });
  return (
    <div className="">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem className="col-span-1 md:col-span-2">
                        {/* <FormLabel>Thumbnail</FormLabel> */}
                        <FormControl>
                          <ProductImageUploader
                            multiple={false}
                            value={form.watch("image") || ""}
                            onChange={(v) => {
                              const url = Array.isArray(v) ? v[0] : v;
                              form.setValue("image", url ?? "", {
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. FLP/WP Junction Boxes"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <CategorySelector
                            categories={categories}
                          ></CategorySelector>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2">
                    <Separator></Separator>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 md:col-span-2 col-span-1 ">
                    <h3 className="md:col-span-3 col-span-2">
                      Technical Details
                    </h3>
                    {ProductTechnicalList.map(({ key, placeholder }) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">{key}</FormLabel>
                            <FormControl>
                              <Input placeholder={placeholder} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormField
                      control={form.control}
                      name="extraSpecs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extra Specs (JSON)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder={`e.g. {"IP":"IP66","tempClass":"T6"}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <FormLabel className="mb-2">Components</FormLabel>
                    {componentsFields.map((field, index) => {
                      return (
                        <div key={field.id} className="flex gap-2 items-center">
                          <FormField
                            control={form.control}
                            name={`components.${index}.items`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="e.g. FLP/WP Junction Boxes"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              componentsAppend({ items: "" });
                            }}
                          >
                            +
                          </Button>
                          {index !== 0 && (
                            <Button
                              type="button"
                              onClick={() => componentsRemove(index)}
                            >
                              -
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3 col-span-2">
                    <div>
                      <div className="font-medium">Active</div>
                      <div className="text-xs text-muted-foreground">
                        Hide/show from listings
                      </div>
                    </div>
                    <Switch
                      checked={form.watch("isActive")}
                      onCheckedChange={(v) => form.setValue("isActive", v)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => history.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="variants" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">Variants</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        subName: "",
                        sku: "",
                        typeNumber: "",
                        imageUrl: "",
                        drawingUrl: "",
                        isDefault: fields.length === 0,
                        isActive: true,
                        sortOrder: fields.length,
                      })
                    }
                  >
                    Add variant
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No variants yet. Click “Add variant”.
                  </p>
                )}

                <div className="space-y-3">
                  {fields.map((f, idx) => (
                    <div key={f.id} className="rounded-md border p-3 space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.subName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. FLP/WP Junction Boxes"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.sku`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SKU (optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. FLP/WP Junction Boxes"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.typeNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type Number (optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. EXEC-30-WG-16A"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.attributes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Attributes JSON (optional)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='e.g. {"poles":2,"thread":"M20"}'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.imageUrl`}
                            render={() => (
                              <FormItem className="col-span-1 md:col-span-2">
                                {/* <FormLabel>Thumbnail</FormLabel> */}
                                <FormControl>
                                  <ProductImageUploader
                                    multiple={false}
                                    value={
                                      form.watch(`variants.${idx}.imageUrl`) ||
                                      ""
                                    }
                                    onChange={(v) => {
                                      const url = Array.isArray(v) ? v[0] : v;
                                      form.setValue(
                                        `variants.${idx}.imageUrl`,
                                        url ?? "",
                                        {
                                          shouldDirty: true,
                                        }
                                      );
                                    }}
                                    label="Image"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.drawingUrl`}
                            render={() => (
                              <FormItem className="col-span-1 md:col-span-2">
                                {/* <FormLabel>Thumbnail</FormLabel> */}
                                <FormControl>
                                  <ProductImageUploader
                                    multiple={false}
                                    value={
                                      form.watch(
                                        `variants.${idx}.drawingUrl`
                                      ) || ""
                                    }
                                    onChange={(v) => {
                                      const url = Array.isArray(v) ? v[0] : v;
                                      form.setValue(
                                        `variants.${idx}.drawingUrl`,
                                        url ?? "",
                                        {
                                          shouldDirty: true,
                                        }
                                      );
                                    }}
                                    label="Drawing PDF"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={variants[idx]?.isDefault || false}
                              onCheckedChange={() => setDefault(idx)}
                            />
                            <span className="text-sm">Default</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={variants[idx]?.isActive ?? true}
                              onCheckedChange={(v) =>
                                form.setValue(
                                  `variants.${idx}.isActive` as const,
                                  v,
                                  { shouldDirty: true }
                                )
                              }
                            />
                            <span className="text-sm">Active</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default ProductDialog;
