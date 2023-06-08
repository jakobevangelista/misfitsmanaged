import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="flex flex-row justify-center">
        <SignIn afterSignInUrl="/memberHome" />
      </div>
    </>
  );
}
