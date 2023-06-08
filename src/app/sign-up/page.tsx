import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="flex flex-row justify-center">
        <SignUp afterSignUpUrl="/memberHome" />
      </div>
    </>
  );
}
