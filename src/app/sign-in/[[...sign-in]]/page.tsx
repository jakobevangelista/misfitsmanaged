import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      {/* <div className="flex flex-row w-screen h-screen justify-center">
        <div>kdlsajfks</div>
      </div> */}
      <div className="m-auto">
        <SignIn />
      </div>
    </>
  );
}
