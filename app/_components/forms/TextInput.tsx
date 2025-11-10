"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

export default function TextInput({
  name,
  label,
  placeholder,
  control,
}: {
  name: string;
  label: string;
  placeholder: string;
  control: Control;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder}  {...field} />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
}
