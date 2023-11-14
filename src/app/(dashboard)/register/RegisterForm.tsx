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
import { useForm, useFieldArray } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

import { useRouter } from "next/navigation";

// import { SignatureCanvas } from "react-signature-canvas";
import SignaturePad from "react-signature-canvas";
import { useRef, useState } from "react";
import { api } from "@/trpc/react";

const formSchema = z.object({
  memberName: z.string().min(2, {
    message: "Your name must be at least 2 characters long",
  }),
  emailAddress: z.string().email({ message: "Please provide a valid email" }),
  parentName: z
    .array(
      z.object({
        name: z.string().min(2, {
          message: "Your name must be at least 2 characters long",
        }),
        parentSignature: z.string().min(1, {
          message: "Please provide a signature",
        }),
        DOB: z.string().min(1, {
          message: "Please provide a date of birth of your child", // need to validate
        }),
        // DOB: z.preprocess((arg) => {
        //   if (typeof arg == "string" || arg instanceof Date)
        //     return new Date(arg);
        // }, z.coerce.date().optional()),
        // DOB: z.coerce.date().optional(),
      })
    )
    .optional(),
  waiverAccept: z.literal<boolean>(true),
  signature: z.string().nonempty({
    message: "Please provide a signature",
  }),
});

export default function RegisterForm(props: { userId: string }) {
  const registerMember = api.member.register.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const router = useRouter();
  const sigRef = useRef({} as SignaturePad);
  const sigRef2 = useRef({} as SignaturePad);
  const date = new Date().toLocaleString();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberName: "",
      waiverAccept: false,
      signature: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "parentName",
    control: form.control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    registerMember.mutate({
      userId: props.userId,
      emailAddress: values.emailAddress,
      username: values.memberName,
      waiverAccept: values.waiverAccept,
      waiverSignature: values.signature,
      waiverSignDate: date,
      parentName: values.parentName?.at(0)?.name,
      parentSignature: values.parentName?.at(0)?.parentSignature,
      minorDOB: values.parentName?.at(0)?.DOB,
    });
  }

  const clear = () => {
    sigRef.current.clear();
  };

  const clear2 = () => {
    sigRef2.current.clear();
  };

  return (
    <>
      <div className="flex flex-col justify-center w-full">
        <div className="mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="memberName"
                render={({ field }) => (
                  <FormItem>
                    <iframe
                      src="/corruptedStrengthWaiver.pdf"
                      className="mx-auto w-full md:h-[50vh] lg:w-1/2"
                    />

                    <Link
                      className="font-bold text-4xl hover:underline"
                      href="/corruptedStrengthWaiver.pdf"
                    >
                      Click here to view the waiver
                    </Link>
                    <FormLabel>
                      By signing your name and clicking Accept, you agree to all
                      the terms in the{" "}
                      <Link className="hover:underline" href="/waiver.pdf">
                        waiver and release of liability,
                      </Link>{" "}
                      you are signing this agreement electronically.
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member name here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter member email address here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length >= 1
                ? fields?.map((field, index) => (
                    <>
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`parentName.${index}.name`}
                        render={({ field }) => (
                          <>
                            <iframe
                              src="/corruptedStrengthMinorWaiver.pdf"
                              className="mx-auto w-full md:h-[50vh] lg:w-1/3"
                            />
                            <Link
                              className="font-bold text-4xl hover:underline"
                              href="/corruptedStrengthWaiver.pdf"
                            >
                              Click here to view the waiver
                            </Link>
                            <FormItem>
                              <FormLabel>Parent Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter Parent name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </>
                        )}
                      />
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`parentName.${index}.DOB`}
                        render={({ field }) => (
                          <>
                            <FormItem>
                              <FormLabel>
                                Minor DOB: Enter date of birth of your child
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="MM/DD/YYYY"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </>
                        )}
                      />
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`parentName.${index}.parentSignature`}
                        render={({ field }) => (
                          <>
                            <FormItem>
                              <div>Parent sign here:</div>
                              <div className="w-full mx-auto md:w-500px md:h-200px border-gray-300">
                                <SignaturePad
                                  ref={sigRef2}
                                  backgroundColor="white"
                                  onEnd={() => {
                                    // console.log(
                                    //   sigRef.current
                                    //     .getTrimmedCanvas()
                                    //     .toDataURL("image/png")
                                    // );
                                    field.onChange(
                                      sigRef2.current
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
                                  onClick={clear2}
                                >
                                  Clear Parent Signature
                                </Button>
                              </div>
                            </FormItem>
                          </>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        DELETE PARENT
                      </Button>
                    </>
                  ))
                : null}
              <Button
                type="button"
                variant="creme"
                size="sm"
                className="mt-2"
                onClick={() =>
                  append({ name: "", parentSignature: "", DOB: "" })
                }
              >
                IF YOU ARE A MINOR YOU NEED TO ADD A PARENT, CLICK THIS BUTTON:
                Add Parent
              </Button>
              <FormField
                control={form.control}
                name="waiverAccept"
                render={({ field }) => (
                  <>
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
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <div>Member sign here:</div>
                    <div className="w-full mx-auto md:w-500px md:h-200px border-gray-300">
                      <SignaturePad
                        ref={sigRef}
                        backgroundColor="white"
                        onEnd={() => {
                          // console.log(
                          //   sigRef.current
                          //     .getTrimmedCanvas()
                          //     .toDataURL("image/png")
                          // );
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
