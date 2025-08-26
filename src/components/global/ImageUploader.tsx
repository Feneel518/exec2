// src/components/upload/image-uploader.tsx
"use client";

import * as React from "react";
import { UploadDropzone, UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoveLeft, MoveRight, Trash2, UploadCloud } from "lucide-react";

type BaseProps = {
  value?: string | string[] | null;
  onChange: (next: string | string[]) => void;
  multiple?: boolean;
  max?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  caption?: string;
};

function InnerUploader<E extends keyof OurFileRouter>({
  endpoint,
  value,
  onChange,
  multiple = false,
  max = 6,
  className,
  disabled,
  label = "Images",
  caption = "JPG/PNG up to 4MB. Drag & drop or click to upload.",
}: BaseProps & { endpoint: E }) {
  const toArray = (v: string | string[] | null | undefined) =>
    !v ? [] : Array.isArray(v) ? v : [v];

  const images = toArray(value);

  const push = (url: string) => {
    if (multiple) onChange([...images, url].slice(0, max));
    else onChange(url);
  };
  const removeAt = (idx: number) => {
    if (multiple) onChange(images.filter((_, i) => i !== idx));
    else onChange("");
  };
  const move = (idx: number, dir: -1 | 1) => {
    if (!multiple) return;
    const j = idx + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{caption}</div>
        </div>
      </div>

      <UploadDropzone<OurFileRouter, "categoryImage" | "productImage">
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          res?.forEach((f) => f?.url && push(f.url));
        }}
        onUploadError={(err) => console.error(err)}
        appearance={{
          container:
            "rounded-md border border-dashed p-4 bg-background/40 hover:bg-background transition-colors",
          label: "text-sm",
        }}
        disabled={disabled || (!multiple && !!images.length)}
      />

      {images.length > 0 && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((src, idx) => (
              <div
                key={src + idx}
                className="group relative rounded-md border overflow-hidden"
              >
                <img
                  alt={`image-${idx + 1}`}
                  src={src}
                  className="h-32 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                  {multiple ? (
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => move(idx, -1)}
                        title="Move left"
                      >
                        <MoveLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => move(idx, +1)}
                        title="Move right"
                      >
                        <MoveRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-white/90 px-1.5 py-0.5 rounded bg-black/30">
                      Preview
                    </span>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7"
                    onClick={() => removeAt(idx)}
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Use for Categories (single) */
export function CategoryImageUploader(props: BaseProps) {
  return <InnerUploader endpoint={"categoryImage"} {...props} />;
}

/** Use for Products (multiple) */
export function ProductImageUploader(props: BaseProps) {
  return <InnerUploader endpoint={"productImage"} {...props} />;
}
