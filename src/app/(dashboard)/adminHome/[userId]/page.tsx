import { Button, buttonVariants } from "@/components/ui/button";
import { MoveLeft, UserCircle } from "lucide-react";
import Link from "next/link";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { contracts, members, transactions } from "@/server/db/schema/members";
import { columns } from "./columns";
import type { Transaction } from "./columns";
import { columns as columns2 } from "./columns2";
import type { Contract } from "./columns2";
import { DataTable } from "./data-table";
import { Label } from "@/components/ui/label";
import { DataTable2 } from "./data-table2";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { PaperClipIcon } from "@heroicons/react/24/outline";

async function getUserData(userId: number) {
  const user = await db.query.members.findFirst({
    where: eq(members.id, userId),
  });
  return user;
}

async function getUserContracts(customerId: string) {
  const userContracts: Contract[] = await db.query.contracts.findMany({
    where: eq(contracts.ownerId, customerId),
    columns: {
      stripeId: true,
      ownerId: true,
      status: true,
      type: true,
      startDate: true,
      endDate: true,
      remainingDays: true,
    },
  });
  return userContracts;
}

async function getUserTransactions(emailAddress: string) {
  const userTransactions: Transaction[] = await db.query.transactions.findMany({
    where: eq(transactions.ownerId, emailAddress),
    columns: {
      id: true,
      type: true,
      amount: true,
      paymentMethod: true,
      date: true,
    },
  });
  return userTransactions;
}

export default async function Page({ params }: { params: { userId: string } }) {
  const user = await currentUser();
  const userData = await getUserData(Number(params.userId));
  const userContracts = await getUserContracts(userData!.customerId!);
  const userTransactions = await getUserTransactions(userData!.emailAddress!);
  if (!userData) {
    redirect("/adminHome");
  }
  if (user?.emailAddresses[0] === undefined) {
    redirect("/sign-in");
  }

  const checkAdmin = await db.query.members.findFirst({
    where: eq(members.emailAddress, user.emailAddresses[0].emailAddress),

    columns: {
      isAdmin: true,
    },
  });
  if (!checkAdmin) {
    redirect("/memberHome");
  }

  if (checkAdmin?.isAdmin === false) {
    redirect("/memberHome");
  }
  return (
    <>
      <div className="flex flex-col p-4">
        <div className="flex ml-10 mt-10 p-4">
          <Link
            href="/adminHome"
            className={buttonVariants({ variant: "creme" })}
          >
            <MoveLeft /> Go Back To Admin Home
          </Link>
        </div>
        <div className="flex mx-auto m-2">
          {
            userData?.profilePicture ? (
              <Image
                src={userData.profilePicture}
                width={250}
                height={250}
                alt="no profile picture"
                className="rounded-md"
              />
            ) : null
            // <div className="flex flex-col">
            //   <UserSquare2 className="mx-auto" size={48} />
            //   <Label>No Profile Picture</Label>
            // </div>
          }
        </div>
        <h1 className="p-4 scroll-m-20 mx-auto text-4xl font-extrabold tracking-tight lg:text-5xl">
          {userData?.name}
        </h1>

        <div className="flex flex-col lg:flex-row p-4 mx-auto">
          <div className="flex flex-col items-center p-4">
            <Label>Transactions</Label>
            <DataTable columns={columns} data={userTransactions} />
          </div>
          <div className="flex flex-col items-center p-4">
            <Label className="p-4 mb-10">Contracts</Label>
            <DataTable2 columns={columns2} data={userContracts} />
          </div>
        </div>
        <div className="mx-auto m-4">
          <Button asChild>
            <Link href={`/adminHome/${params.userId}/profilePicture`}>
              <UserCircle className="mr-2" />
              Set Profile Picture
            </Link>
          </Button>
        </div>
        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-white">
              Member Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
              Personal details
            </p>
          </div>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">
                  Full name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {userData?.name}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">
                  Email address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {userData?.emailAddress}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">
                  Signature Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {userData?.waiverSignDate}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">
                  Signature
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <Image
                    src={userData.waiverSignature!}
                    width={250}
                    height={250}
                    alt="no signature"
                  />
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">
                  Attachments
                </dt>
                <dd className="mt-2 text-sm text-white sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-white/10 rounded-md border border-white/20"
                  >
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            resume_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            2.4mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            coverletter_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            4.5mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
