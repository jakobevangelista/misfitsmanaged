import { buttonVariants } from "@/components/ui/button";
import { auth, SignIn, SignUp } from "@clerk/nextjs";
import { Command } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    return redirect("/memberHome");
  }
  return (
    <>
      <div className="flex flex-row h-screen w-screen">
        <div className="hidden bg-cover bg-center bg-no-repeat bg-[url('https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Mask_Colour-1_edited.jpg?v=1622047760')] h-full md:flex md:shrink md:w-1/2 m-auto">
          {/* <Image
            src="https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Mask_Colour-1_edited.jpg?v=1622047760"
            alt="QR Code to check in"
            width={300}
            height={300}
            // fill
            className="object-cover"
            style={{
              objectFit: "cover",
            }}
          /> */}
          <div className="flex text-[#EFE1B2] text-3xl md:text-5xl xl:text-7xl text-center font-sans font-black m-auto">
            Welcome to Misfits Managed!
          </div>
        </div>

        <div className="flex flex-col m-auto w-full h-full bg-cover bg-center bg-no-repeat bg-[url('https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Mask_Colour-1_edited.jpg?v=1622047760')] md:w-1/2 md:bg-none">
          <div className="flex text-[#EFE1B2] text-3xl md:hidden text-center font-sans font-black mx-auto mt-auto mb-4">
            Welcome to Misfits Managed!
          </div>
          <div className="flex mx-auto mb-auto md:m-auto">
            <SignUp
              // afterSignInUrl="/memberHome"
              // afterSignUpUrl='/memberHome'
              appearance={{
                elements: {
                  formButtonPrimary: "bg-[#EA0606] hover:bg-[#EA0606]/50",
                  // cl-internal-b3fm6y: "bg-[#EA0606]",
                  b3fm6y: "bg-[#EA0606]",
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
