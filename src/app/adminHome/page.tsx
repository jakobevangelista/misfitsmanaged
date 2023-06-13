import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { members } from "@/db/schema/members";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  const users: User[] = await db.query.members.findMany({
    columns: {
      id: true,
      userId: true,
      name: true,
      contractStatus: true,
      emailAddress: true,
    },
  });

  return users;
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

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-end">
          <UserButton afterSignOutUrl="/" />
        </div>
        <Button className="mx-auto">
          <Link href="/memberHome">Go to Member View</Link>
        </Button>
        <div>User Id: {userId}</div>
        <div>You are admin gang {user!.firstName}</div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
