import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, SignUpButton, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/memberHome");
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Image
          src="https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Mask_Colour-1_edited.jpg?v=1622047760"
          alt="QR Code to check in"
          width={300}
          height={300}
          className="flex-grow"
        />

        <Image
          src="https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Text-1_2048x.png?v=1621880690 2048w"
          alt="QR Code to check in"
          width={300}
          height={300}
          className="flex-grow hidden md:block"
        />
      </div>
      <Link href="/sign-in" className={buttonVariants({ variant: "creme" })}>
        Sign In
      </Link>

      <Link href="/sign-up" className={buttonVariants({ variant: "red" })}>
        Sign Up
      </Link>
    </div>
  );
}
