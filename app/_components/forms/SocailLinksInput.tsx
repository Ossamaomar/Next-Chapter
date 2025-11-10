import React from "react";
import InputField from "./InputField";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Control, UseFieldArrayReturn } from "react-hook-form";

export default function SocailLinksInput({
  control,
  fields,
  append,
  remove,
}: {
  control: Control;
  fields: UseFieldArrayReturn["fields"];
  append: UseFieldArrayReturn["append"];
  remove: UseFieldArrayReturn["remove"];
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Social Links (Optional)</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-end">
          <div className="flex-1">
            <InputField
              control={control}
              name={`links.${index}.url`}
              placeholder="https://example.com"
              type="url"
            />
          </div>
          {index === fields.length - 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => append({ url: "" })}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
