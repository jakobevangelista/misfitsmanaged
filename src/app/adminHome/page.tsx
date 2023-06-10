import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { db } from "@/db";

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Pedro Duarte",
      amount: 100,
      contractStatus: "active",
      email: "m@example.com",
    },
    {
      id: "2341132",
      name: "Hannah Nguyen",
      amount: 234,
      contractStatus: "expired",
      email: "dn@gmail.com",
    },
    // ...
  ];
}

async function getTestData() {
  // Fetch data from your API here.
  const users = await db.query.members.findMany();
  return users;
}

export default async function AdminHome() {
  const { userId } = auth();
  const user = await currentUser();
  const data = await getData();

  const testData = await getTestData();
  console.log(testData);

  return (
    <>
      <div>
        <UserButton afterSignOutUrl="/" />
        <div>User Id: {userId}</div>
        <div>You are admin gang {user!.firstName}</div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
