import {
  SignIn,
  SignInButton,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { db } from "../db/index";
import { sql, eq, exists } from "drizzle-orm";
import { members } from "@/db/schema/members";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  let { userId } = auth();
  if (userId === null) {
    userId = "not a user";
  }
  const user = await currentUser();

  const isRegistered = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!isRegistered) {
    redirect("/register");
  }

  return (
    <div className="flex flex-col">
      <SignedOut>
        {/* <SignInButton /> */}
        {/* <div> hello {userId === null ? <div>is null</div> : ""}</div> */}
        {/* <SignUp /> */}
        <div className="bg-cover">
          <style>b</style>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <div>User Id: {!!userId}</div>
        <div>You are member gang {user?.firstName}</div>
        <div>
          hello
          {isRegistered == null ? <div>is null</div> : <div>real user</div>}
        </div>
        <div>
          <Image
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATCSURBVO3BQY4kRxIEQdNA/f/Lun1bPwWQSK/mDGki+CNVS06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFn7wE5DepeQLIE2pugGxScwPkN6l546Rq0UnVopOqRZ8sU7MJyA2QSc2kZgIyqZmA3KiZgDyhZgIyqblRswnIppOqRSdVi06qFn3yZUCeUPMGkE1qJiCTmhsg3wTkCTXfdFK16KRq0UnVok/+Y9TcqLlRMwGp/zupWnRSteikatEnfzk1E5BvAnKj5gbIv9lJ1aKTqkUnVYs++TI1fxIgN2qeUDMBmdRMajap+ZOcVC06qVp0UrXok2VAfhOQSc0EZFIzAbkBMqmZgExqJiCTmgnIpOYGyJ/spGrRSdWik6pFn7yk5k8C5Ak1TwB5A8gTav4mJ1WLTqoWnVQtwh95AcikZhOQSc0EZFLzBJBJzRNAnlAzAXlCzQ2QJ9RsOqladFK16KRq0ScvqbkB8oSaSc0bQJ4AMql5Qs0NkDeA3KiZgPymk6pFJ1WLTqoWffISkCfUTEAmIJvU3AC5AbJJzQTkRs0EZFLzhJpvOqladFK16KRqEf7IIiBPqJmATGqeAHKj5gbIpGYTkEnNDZAbNROQSc0EZFKz6aRq0UnVopOqRZ98mZobIDdAJjUTkCeAvAHkRs1vAjKpmYBMaiYgk5o3TqoWnVQtOqla9MkyNTdAJjVPAJnUTEAmNTdAJjU3aiYgE5AbNROQTUD+SSdVi06qFp1ULfrky4A8AeRGzRNAJjWb1ExAJjU3at4A8oaaTSdVi06qFp1ULcIfWQTkRs0mIDdqJiA3am6ATGpugExqboBMaiYgN2omIDdqNp1ULTqpWnRStQh/5BcBmdTcAJnU3ACZ1ExAJjW/Ccik5gkgm9RsOqladFK16KRqEf7IC0Bu1NwAmdQ8AeRGzQ2QJ9Q8AWRSMwGZ1ExAnlBzA+RGzRsnVYtOqhadVC365JcBeQLIpOZGzQ2QSc0TQCY1E5BJzQTkCTVPAJnUTGomIJtOqhadVC06qVqEP/ICkEnNNwGZ1ExANqmZgNyo+SYgT6iZgExqNp1ULTqpWnRSteiTLwNyo2YC8gSQSc0NkBs1E5AbNROQSc0NkN+k5ptOqhadVC06qVr0yUtqbtQ8oeYJIG+o+U1AbtQ8AWRSMwG5UbPppGrRSdWik6pF+CMvAPlNap4AMqmZgExqboDcqJmATGomIJOaCcikZgJyo+Y3nVQtOqladFK16JNlajYB+SY1N0Bu1DwB5Ak1f5OTqkUnVYtOqhZ98mVAnlDzBpAngDyhZgJyo2YCcgPkm4DcqHnjpGrRSdWik6pFn/zLqflNajapuQEyqZmATGomIJtOqhadVC06qVr0yX+cmgnIpGYC8gSQGzUTkAnIG2omIJOaTSdVi06qFp1ULfrky9T8yYBMaiYgk5on1Lyh5gbIBORGzQRkUvPGSdWik6pFJ1WLPlkG5DcBmdTcALkB8gaQSc0EZFIzqZmATGomNTdAbtRsOqladFK16KRqEf5I1ZKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0f8AtfYmQ0dLqsQAAAAASUVORK5CYII="
            alt="QR Code to check in"
            width={300}
            height={300}
          />
        </div>
      </SignedIn>
    </div>
  );
}
