import { buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-self-start ml-10 mt-10">
          <Link
            href="/adminHome"
            className={buttonVariants({ variant: "creme" })}
          >
            <MoveLeft /> Go Back To Admin Home
          </Link>
        </div>
        <div className="mx-auto">User Page</div>
      </div>
    </>
  );
}
