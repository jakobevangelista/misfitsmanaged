"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { setProfilePicture } from "./setProfilePicture";
import { Button } from "@/components/ui/button";

// const videoConstraints = {
//   width: 720,
//   height: 360,
//   facingMode: "user",
// };

export default function WebCamComponent(props: { userId: number }) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null); // initialize it
  const [isPending, startTransition] = useTransition();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current!.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);
  return (
    <>
      <div className="container">
        <Webcam height={600} width={600} ref={webcamRef} />
      </div>
      {imgSrc ? (
        <>
          <Image src={imgSrc} width={600} height={600} alt="webcam" />
          <div>{imgSrc}</div>
        </>
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} />
      )}
      {/* <Image src={imgSrc} width={600} height={600} alt="webcam" /> */}

      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
      </div>
      <Button
        onClick={() => {
          startTransition(() => setProfilePicture(props.userId, imgSrc || ""));
        }}
      >
        Click here to set profile pic
      </Button>
    </>
  );
}

//   ReactDOM.render(<WebcamCapture />, document.getElementById("root"));

// https://www.npmjs.com/package/react-webcam
