import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function AdminHome() {
  const { userId } = auth();
  const user = await currentUser();

  return (
    <>
      <div>
        <UserButton afterSignOutUrl="/" />
        <div>User Id: {userId}</div>
        <div>You are admin gang {user?.firstName}</div>
      </div>
    </>
  );
}
