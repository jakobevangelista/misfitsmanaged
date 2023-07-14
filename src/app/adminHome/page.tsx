import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { members, contracts } from "@/db/schema/members";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const revalidate = 15; // revalidate this page every 15 seconds

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  const users: User[] = await db.query.members.findMany({
    columns: {
      id: true,
      realScanId: true,
      name: true,
      contractStatus: true,
      emailAddress: true,
    },
  });

  return users;
}

async function checkContracts() {
  const listOfContracts = await db.query.contracts.findMany({
    where: eq(contracts.status, "active"),
    columns: {
      id: true,
      endDate: true,
    },
  });

  const today = new Date();
  for (let i = 0; i < listOfContracts.length; i++) {
    if (listOfContracts[i].endDate < today) {
      await db
        .update(contracts)
        .set({ status: "inactive" })
        .where(eq(contracts.id, listOfContracts[i].id));
    }
  }

  const listOfUpdatedContracts = await db.query.contracts.findMany({
    columns: {
      ownerId: true,
      endDate: true,
      status: true,
    },
  });
  const listOfMembers = await db.query.members.findMany({
    columns: {
      id: true,
      contractStatus: true,
      emailAddress: true,
    },
  });

  // inefficient as hell
  for (let i = 0; i < listOfMembers.length; i++) {
    const listOfContracts = await db.query.contracts.findMany({
      where: eq(contracts.ownerId, listOfMembers[i].emailAddress),
    });

    if (listOfContracts.length === 0) {
      await db
        .update(members)
        .set({ contractStatus: "none" })
        .where(eq(members.id, listOfMembers[i].id));
    } else {
      for (let j = 0; j < listOfContracts.length; j++) {
        if (listOfContracts[j].status === "active") {
          await db
            .update(members)
            .set({ contractStatus: "active" })
            .where(eq(members.id, listOfMembers[i].id));
          break;
        } else {
          await db
            .update(members)
            .set({ contractStatus: "none" })
            .where(eq(members.id, listOfMembers[i].id));
        }
      }
    }
    // instead of doing this, use sql, query contracts, if contracts null, then set to none, else process
    // for (let j = 0; j < listOfUpdatedContracts.length; j++) {
    //   if (listOfUpdatedContracts[j].ownerId == listOfMembers[i].emailAddress) {
    //     if (listOfUpdatedContracts[j].status === "active") {
    //       await db
    //         .update(members)
    //         .set({ contractStatus: "active" })
    //         .where(eq(members.id, listOfMembers[i].id));
    //       break;
    //     } else {
    //       await db
    //         .update(members)
    //         .set({ contractStatus: "none" })
    //         .where(eq(members.id, listOfMembers[i].id));
    //     }
    //   }
    // }
  }
}

export default async function AdminHome() {
  const { userId } = auth();
  const user = await currentUser();
  const data = await getData();

  const checkAdmin = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
    columns: {
      isAdmin: true,
    },
  });

  if (checkAdmin?.isAdmin === false) {
    redirect("/memberHome");
  }

  checkContracts();

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-end">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="flex flex-row m-auto space-x-4">
          <Button className="mx-auto my-4" asChild>
            <Link href="/memberHome">Go to Member View</Link>
          </Button>

          <Button variant="creme" className="mx-auto my-4" asChild>
            <Link href="/transactions">Go to Transactions</Link>
          </Button>
        </div>
        <div className="mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
