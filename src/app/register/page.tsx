import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "../../db/index";
import { members } from "../../db/schema/members";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

export default async function Page() {
  let { userId } = auth();
  if (userId === null) {
    userId = "";
  }

  const isRegistered = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (isRegistered) {
    redirect("/");
  }

  async function coolAction(formData: FormData) {
    "use server";
    const customCode = await QRCode.toDataURL(userId!, {
      errorCorrectionLevel: "H",
    });

    const update = await db.insert(members).values({
      name: formData.get("name")?.toString(),
      userId: userId,
      qrCodeUrl: customCode.toString(),
    });

    redirect("/");
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
