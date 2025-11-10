"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  getSecionsLoadingState,
  modifySection,
} from "@/store/courseSectionsSlice";
// import { useParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { editSection } from "@/app/_services/sections";

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Enter a valid name",
  }),
});

export default function EditForm({
  initialTitle,
  sectionId,
}: {
  initialTitle: string;
  sectionId: string;
}) {
  const isLoading = useSelector(getSecionsLoadingState);
  const dispatch = useDispatch();
  // const { id: courseId }: { id: string } = useParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialTitle,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log({ ...data, order_index: sections.length });
    const res = await editSection(sectionId, data.name);
    console.log(res)
    if (res) {
      dispatch(modifySection({ id: sectionId, name: res.name }));
    }

    // form.reset();
    // setIsAdding(false);
  }

  function onCancel() {
    form.reset();
    // setIsAdding(false);
  }

  useEffect(() => {
    if (!isLoading) {
      form.reset();
      //   setIsAdding(false);
    }
    console.log(isLoading);
  }, [isLoading, form]);

  return (
    <div className="p-2 mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="section name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-3 flex justify-start gap-2">
            <Button
              className="bg-amber-600 font-medium text-sm px-2 py-2 rounded-lg text-white"
              type="submit"
            >
              {isLoading ? <BeatLoader color="#fff" size={12} /> : "Edit"}
            </Button>
            <Button
              className="bg-gray-300 font-medium text-sm px-2 py-2 rounded-lg text-black transition duration-300 hover:text-white"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
