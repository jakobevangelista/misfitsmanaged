import { Button, buttonVariants } from "@/components/ui/button";
import { MoveLeft, UserCircle } from "lucide-react";
import Link from "next/link";
import QuickCheckout from "./quickCheckout";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { contracts, members, transactions } from "@/db/schema/members";
import { Transaction, columns } from "./columns";
import { Contract, columns as columns2 } from "./columns2";
import { DataTable } from "./data-table";
import { Label } from "@/components/ui/label";
import { DataTable2 } from "./data-table2";

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
  console.log(params.userId);
  const userData = await getUserData(Number(params.userId));
  const userContracts = await getUserContracts(userData!.customerId!);
  const userTransactions = await getUserTransactions(userData!.emailAddress!);
  // console.log(userTransactions);
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
        <h1 className="p-4 scroll-m-20 mx-auto text-4xl font-extrabold tracking-tight lg:text-5xl">
          {userData?.name}
        </h1>
        {/* <QuickCheckout userId={params.userId} /> */}
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
      </div>
    </>
  );
}
