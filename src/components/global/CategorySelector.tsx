import { Category } from "@/generated/prisma";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: Category[];
}

const CategorySelector: FC<CategorySelectorProps> = ({ categories }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name="categoryId"
      render={({ field }) => {
        const selected = categories.find((c) => c.id === field.value);

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selected ? selected.name : "Select category..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  {categories.map((cat) => (
                    <CommandItem
                      key={cat.id}
                      value={cat.name}
                      onSelect={() => field.onChange(cat.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          cat.id === field.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {cat.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

export default CategorySelector;
