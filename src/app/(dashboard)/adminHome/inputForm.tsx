"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  tag: z.string().min(2, {
    message: "Scan card",
  }),
});

export function InputForm(props: { userId: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // mutate({
    //   newTagCode: data.tag,
    //   userId: props.userId,
    // });
    // console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Update Tag</FormLabel>
                <FormControl>
                  <Input placeholder="Click here and scan tag" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
              <Button type="submit">Update Tag</Button>
            </>
          )}
        />
      </form>
    </Form>
  );
}
