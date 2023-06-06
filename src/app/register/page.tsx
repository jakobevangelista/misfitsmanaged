import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "../../db/index";
import { members } from "../../db/schema/members";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { MySqlText } from "drizzle-orm/mysql-core";

export default async function Page() {
  const { userId } = auth();

  const isRegistered = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
  });

  if (isRegistered) {
    redirect("/memberHome");
  }

  async function coolAction(formData: FormData) {
    "use server";

    const customCode: string | null = await QRCode.toDataURL(userId!, {
      errorCorrectionLevel: "H",
    });

    const formString = formData.get("name") as string;

    await db.insert(members).values({
      userId: userId!,
      // userId: "userId",
      //   name: "formData",
      name: formString,
      //   qrCodeUrl: "customCode",
      qrCodeUrl: customCode,
    });

    redirect("/memberHome");
  }
  return (
    <>
      <form
        action={coolAction}
        className="flex flex-col w-full max-w-sm items-center space-x-2"
      >
        <Input type="name" name="name" placeholder="Full Name" />
        <Button type="submit">Register</Button>
      </form>
      <UserButton afterSignOutUrl="/" />
    </>
  );
}
