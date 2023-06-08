"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

import { validatedAction } from "./action";
import { useZact } from "zact/client";
import { redirect } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Please enter your name to agree to the waiver",
  }),
  waiver: z.literal<boolean>(true),
});

export default function RegisterForm(props: {
  qrCode: string;
  userId: string;
  emailAddress: string;
}) {
  const { mutate, error } = useZact(validatedAction);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      waiver: false,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate({
      qrCode: props.qrCode,
      userId: props.userId,
      emailAddress: props.emailAddress,
      username: values.username,
      waiver: values.waiver,
    }).then(() => {
      redirect("/memberHome");
    });
    console.log(values);
  }
  return (
    <>
      <Link
        className="font-bold text-4xl hover:underline"
        href="/hccUnofficialTranscript"
      >
        Click here to view the waiver
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  By Signing your name and clicking Accept you agree to all the
                  terms in the{" "}
                  <Link
                    className="hover:underline"
                    href="/hccUnofficialTranscript"
                  >
                    waiver
                  </Link>{" "}
                  above
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name Here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waiver"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Accept Terms of Waiver</FormLabel>
                  <FormDescription>
                    View the terms in the{" "}
                    <Link
                      className="hover:underline"
                      href="/hccUnofficialTranscript"
                    >
                      waiver
                    </Link>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Register</Button>
        </form>
      </Form>
    </>
  );
}
