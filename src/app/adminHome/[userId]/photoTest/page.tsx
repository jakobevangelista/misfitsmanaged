import WebCamComponent from "./webCam";

export default function WebcamCapture({
  params,
}: {
  params: { userId: number };
}) {
  return (
    <>
      <WebCamComponent userId={params.userId} />
    </>
  );
}

//   ReactDOM.render(<WebcamCapture />, document.getElementById("root"));

// https://www.npmjs.com/package/react-webcam
