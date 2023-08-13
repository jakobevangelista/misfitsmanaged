"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const [imgSrc, setImgSrc] = useState(null); // initialize it

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current!.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);
  return (
    <>
      <div className="container">
        <Webcam height={600} width={600} />
      </div>
      {imgSrc ? (
        <>
          <Image src={imgSrc} width={600} height={600} alt="webcam" />
          <div>{imgSrc}</div>
        </>
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} />
      )}
      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
      </div>
    </>
  );
}

//   ReactDOM.render(<WebcamCapture />, document.getElementById("root"));

// https://www.npmjs.com/package/react-webcam
