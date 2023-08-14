import Link from "next/link";
import WebCamComponent from "./webCam";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

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
          Profile Picture:
        </div>
        <WebCamComponent userId={params.userId} />
      </div>
    </>
  );
}

//   ReactDOM.render(<WebcamCapture />, document.getElementById("root"));

// https://www.npmjs.com/package/react-webcam
