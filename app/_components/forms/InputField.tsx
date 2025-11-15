import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { Control } from "react-hook-form";

export default function InputField({
  name,
  label,
  type,
  placeholder,
  control,
  defaultValue,
  disabled = false,
}: {
  name: string;
  label?: string;
  type: string;
  placeholder: string;
  control: Control;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {disabled ? (
              <Input
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                value={defaultValue}
                {...field}
              />
            ) : (
              <Input
                placeholder={placeholder}
                type={type}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
