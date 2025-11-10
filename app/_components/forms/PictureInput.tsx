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

export default function PictureInput({
  control,
  handlePictureUpload,
  name,
  label,
}: {
  control: Control;
  handlePictureUpload: (file: File) => void;
  name: string;
  label: string;
}) {
  return (
    <>
      <FormField
        control={control}
        name={`${name}Url`}
        render={() => <></>}
      />

      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange(e.target.files?.[0]);
                    handlePictureUpload(file);
                  }
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
