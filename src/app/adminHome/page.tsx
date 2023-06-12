import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { db } from "@/db";

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

  return (
    <>
      <div className="flex flex-col">
        <UserButton afterSignOutUrl="/" />
        <div>User Id: {userId}</div>
        <div>You are admin gang {user!.firstName}</div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
