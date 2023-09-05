"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { setProfilePicture } from "./setProfilePicture";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// const videoConstraints = {
//   width: 720,
//   height: 360,
//   facingMode: "user",
// };

export default function WebCamComponent(props: { userId: number }) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null); // initialize it
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current!.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);
  return (
    <>
      <div className="flex flex-col mx-80">
        {imgSrc ? (
          <>
            <Image
              className="mx-auto m-4"
              src={imgSrc}
              width={600}
              height={600}
              alt="webcam"
            />
            <Button
              onClick={() => {
                setImgSrc(null);
              }}
              variant="destructive"
              className="m-4 mx-auto"
            >
              Clear Picture
            </Button>
            <Button
              onClick={() => {
                startTransition(() =>
                  setProfilePicture(props.userId, imgSrc || "")
                );
                router.push(`/adminHome/${props.userId}`);
              }}
              variant="green"
              className="m-4 mx-auto"
            >
              Click here to set profile pic
            </Button>
          </>
        ) : (
          <>
            <Webcam
              className="mx-auto m-4"
              // height={720}
              // width={1280}
              ref={webcamRef}
            />
            <Button className="m-4 mx-auto" onClick={capture}>
              Capture photo
            </Button>
          </>
        )}
      </div>
    </>
  );
}

//   ReactDOM.render(<WebcamCapture />, document.getElementById("root"));

// https://www.npmjs.com/package/react-webcam
