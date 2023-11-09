import Link from "next/link";
import { Transaction, columns } from "./columns";
import { DataTable } from "./data-table";
import { MoveLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { members, transactions } from "@/server/db/schema/members";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { string } from "zod";
export const revalidate = 0; // revalidate this page every 15 seconds

async function getData(): Promise<Transaction[]> {
  const listOfTransactions: Transaction[] =
    await db.query.transactions.findMany({
      columns: {
        id: true,
        ownerId: true,
        type: true,
        amount: true,
        paymentMethod: true,
        date: true,
        quantity: true,
      },
    });

  return listOfTransactions;
}

export default async function Page() {
  const { userId } = auth();
  const user = await currentUser();
  const data = await getData();
  // console.log(typeof data[0].date);
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
      <div className="flex flex-col">
        <div className="flex flex-col items-center">Transactions</div>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
