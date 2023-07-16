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
import { redirect, useRouter } from "next/navigation";

// import { SignatureCanvas } from "react-signature-canvas";
import SignaturePad from "react-signature-canvas";
import { useRef, useState } from "react";
import ReactSignatureCanvas from "react-signature-canvas";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Please enter your name to agree to the waiver",
  }),
  waiverAccept: z.literal<boolean>(true),
  signature: z.string().nonempty({
    message: "Please provide a signature",
  }),
});

export default function RegisterForm(props: {
  qrCode: string;
  userId: string;
  emailAddress: string;
}) {
  const { mutate, error } = useZact(validatedAction);
  const router = useRouter();
  const sigRef = useRef({} as SignaturePad);
  const date = new Date().toLocaleString();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      waiverAccept: false,
      signature: "",
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
      waiverAccept: values.waiverAccept,
      waiverSignature: values.signature,
      waiverSignDate: date,
    }).then(() => {
      router.refresh();
    });
    console.log(values);
  }

  // let sigPad: any = {};
  const clear = () => {
    sigRef.current.clear();
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <iframe
          src="/waiver.pdf"
          className="mx-auto w-full md:h-[50vh] lg:w-1/3"
        />
        <div className="mx-auto">
          <Link
            className="font-bold text-4xl hover:underline"
            href="/waiver.pdf"
          >
            Click here to view the waiver
          </Link>
        </div>
        <div className="mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      By signing your name and clicking Accept, you agree to all
                      the terms in the{" "}
                      <Link className="hover:underline" href="/waiver.pdf">
                        waiver and release of liability,
                      </Link>{" "}
                      you are signing this agreement electronically.
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
                name="waiverAccept"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Accept Terms of Waiver on {date}</FormLabel>
                      <FormDescription>
                        View the terms in the{" "}
                        <Link className="hover:underline" href="/waiver.pdf">
                          waiver
                        </Link>
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <div>Sign here:</div>
                    <div className="w-full">
                      <SignaturePad
                        ref={sigRef}
                        backgroundColor="white"
                        onEnd={() => {
                          console.log(
                            sigRef.current
                              .getTrimmedCanvas()
                              .toDataURL("image/png")
                          );
                          field.onChange(
                            sigRef.current
                              .getTrimmedCanvas()
                              .toDataURL("image/png")
                              .toString()
                          );
                        }}
                        penColor="black"
                        canvasProps={{
                          width: 520,
                          height: 200,
                          // className: "w-full md:w-500px md:h-200px",
                        }}
                      />
                      <FormMessage />
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={clear}
                      >
                        Clear Signature
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              <div></div>
              <Button type="submit">Register</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
