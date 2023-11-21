"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useFieldArray, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const formSchema = z
  .object({
    memberName: z.string().min(2, {
      message: "Your name must be at least 2 characters long",
    }),
    emailAddress: z.string().email({ message: "Please provide a valid email" }),
    dob: z.date({
      required_error: "A date of birth is required",
    }),

    parentName: z
      .array(
        z.object({
          name: z.string().min(2, {
            message: "Your name must be at least 2 characters long",
          }),
          parentSignature: z.string().min(1, {
            message: "Please provide a signature",
          }),
          DOB: z
            .date({
              required_error: "Please provide your date of birth", // need to validate
            })
            .min(DateTime.local().minus({ years: 18 }).toJSDate()),
        })
      )
      .optional(),
    waiverAccept: z.literal<boolean>(true),
    signature: z.string().min(1, {
      message: "Please provide a signature",
    }),
  })
  .superRefine((data, refinementContext) => {
    if (
      data.dob > DateTime.local().minus({ years: 18 }).toJSDate() &&
      !data.parentName
    ) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parent is required if you are less than 18 years old",
        path: ["dob"],
      });
    }
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
      dob: new Date(),
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
      parentDOB: values.parentName?.at(0)?.DOB,
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

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={2023}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription>
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
                      {/* <FormField
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
                      /> */}
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`parentName.${index}.DOB`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown-buttons"
                                  fromYear={1900}
                                  toYear={2023}
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Your date of birth is used to calculate your age.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
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
                  append({
                    name: "",
                    parentSignature: "",
                    DOB: new Date(),
                  })
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
