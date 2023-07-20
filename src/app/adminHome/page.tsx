import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { db } from "@/db";
import { eq, lt, sql } from "drizzle-orm";
import { members, contracts } from "@/db/schema/members";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshPage } from "./refresh-page";
export const revalidate = 0; // revalidate this page every 15 seconds

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
  const today = new Date();
  await db
    .update(contracts)
    .set({ status: "inactive" })
    .where(lt(contracts.endDate, today));

  await db.execute(sql`update ${members}
  set ${members.contractStatus} = (
    case
      when (
        select ${contracts.status}
        from ${contracts}
        where ${contracts.ownerId} = ${members.emailAddress} AND ${contracts.status} = 'active'
        limit 1
      ) is not null then 'active'
      else 'none'
    END
  )`);
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
      <RefreshPage />
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
