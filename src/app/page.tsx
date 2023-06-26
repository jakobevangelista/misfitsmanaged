import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, SignUpButton, auth, SignIn } from "@clerk/nextjs";
import { Command } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sign } from "crypto";

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/memberHome");
  }
  return (
    <div className="flex flex-col h-screen">
      <Image
        src="https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Mask_Colour-1_edited.jpg?v=1622047760"
        alt="QR Code to check in"
        // width={300}
        fill
        // height={300}
        className="flex grow h-1/2"
        style={{
          objectFit: "cover",
        }}
      />
      <div className="flex flex-row">
        {/* <Image
          src="https://cdn.shopify.com/s/files/1/0570/7631/8390/files/CS_Text-1_2048x.png?v=1621880690 2048w"
          alt="QR Code to check in"
          width={300}
          height={300}
          className="flex-grow h-1/2 hidden md:block"
        /> */}
      </div>
      <div className="flex flex-col m-auto">
        <SignIn />

        <Link href="/sign-in" className={buttonVariants({ variant: "creme" })}>
          Sign In
        </Link>

        <Link href="/sign-up" className={buttonVariants({ variant: "red" })}>
          Sign Up
        </Link>
      </div>
    </div>
    // <>
    //   <div className="md:hidden">
    //     <Image
    //       src="/examples/authentication-light.png"
    //       width={1280}
    //       height={843}
    //       alt="Authentication"
    //       className="block dark:hidden"
    //     />
    //     <Image
    //       src="/pubcli/croppedMisfitsLogo.png"
    //       width={1280}
    //       height={843}
    //       alt="Authentication"
    //       className="hidden dark:block"
    //     />
    //   </div>
    //   <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    //     <Link
    //       href="/examples/authentication"
    //       className={cn(
    //         buttonVariants({ variant: "ghost" }),
    //         "absolute right-4 top-4 md:right-8 md:top-8"
    //       )}
    //     >
    //       Login
    //     </Link>
    //     <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
    //       <div className="absolute inset-0 bg-zinc-900" />
    //       <div className="relative z-20 flex items-center text-lg font-medium">
    //         <Command className="mr-2 h-6 w-6" /> Acme Inc
    //       </div>
    //       <div className="relative z-20 mt-auto">
    //         <blockquote className="space-y-2">
    //           <p className="text-lg">
    //             &ldquo;This library has saved me countless hours of work and
    //             helped me deliver stunning designs to my clients faster than
    //             ever before.&rdquo;
    //           </p>
    //           <footer className="text-sm">Sofia Davis</footer>
    //         </blockquote>
    //       </div>
    //     </div>
    //     <div className="lg:p-8">
    //       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    //         <SignIn afterSignInUrl="/memberHome" />
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
}
