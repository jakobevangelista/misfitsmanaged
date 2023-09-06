import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import ImageUpload from "./imageUpload";

export default function WebcamCapture({
  params,
}: {
  params: { userId: number };
}) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex ml-10 mt-10 p-4">
          <Link
            href="/adminHome"
            className={buttonVariants({ variant: "creme" })}
          >
            <MoveLeft /> Go Back To User Profile
          </Link>
        </div>
        <div className="scroll-m-20 mx-auto text-4xl font-extrabold tracking-tight lg:text-5xl">
          Upload an Image to Set Profile Picture:
        </div>
        <ImageUpload userId={params.userId} />
      </div>
    </>
  );
}

//   ReactDOM.render(<WebcamCapture />, document.getElementById("root"));

// https://www.npmjs.com/package/react-webcam
