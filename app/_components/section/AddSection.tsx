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
import { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  addSectionThunk,
  getSecionsLoadingState,
  getSecionsState,
} from "@/store/courseSectionsSlice";
import { useParams } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { BeatLoader } from "react-spinners";
import { getUserData } from "@/store/authSlice";

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Enter a valid name",
  }),
});

export default function AddSection() {
  const sections = useSelector(getSecionsState);
  const isLoading = useSelector(getSecionsLoadingState);
  const user = useSelector(getUserData);
  const dispatch = useDispatch<AppDispatch>();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { id }: { id: string } = useParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsAdding(true);
    dispatch(
      addSectionThunk({
        name: data.name,
        order_index: sections.length,
        course_id: id,
        instructor_id: user.id,
      })
    );
    setIsAdding(false);
    // form.reset();
    // setIsAdding(false);
  }

  function onCancel() {
    form.reset();
    setIsAdding(false);
  }

  useEffect(() => {
    if (!isLoading) {
      form.reset();
      setIsAdding(false);
    }
  }, [isLoading, form]);

  return (
    <div className="mt-3">
      {isAdding ? (
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
                {isLoading ? <BeatLoader color="#fff" size={12} /> : "Create"}
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
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full cursor-pointer flex justify-center items-center gap-2 
                   text-emerald-700 py-4 bg-gray-200 rounded-xl transition duration-300 
                   hover:bg-black hover:text-white"
          disabled={isAdding}
        >
          <IoAddOutline size={23} /> Add section
        </button>
      )}
    </div>
  );
}
