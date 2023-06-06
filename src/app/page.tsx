import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Image
          src="https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Mask_Colour-1_edited.jpg?v=1622047760"
          alt="QR Code to check in"
          width={300}
          height={300}
          className="m-auto"
        />
        <Image
          src="https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Text-1_2048x.png?v=1621880690 2048w"
          alt="QR Code to check in"
          width={300}
          height={300}
          className="m-auto"
        />
      </div>
      <SignInButton afterSignInUrl="/memberHome">
        <Button className="bg-[#EFE1B2] mb-10 mx-10">Sign in</Button>
      </SignInButton>

      <SignUpButton afterSignUpUrl="/memberHome">
        <Button className="bg-[#EA0607] mb-10 mx-10">Sign Up</Button>
      </SignUpButton>
    </div>
  );
}
