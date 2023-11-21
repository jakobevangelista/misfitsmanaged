"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UploadButton } from "../../../../../../utils/uploadthing";
import { setProfilePicture } from "./setProfilePicture";

export default function Home(props: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          console.log("FileURL: ", res![0]!.url);
          startTransition(() => setProfilePicture(props.userId, res![0]!.url));
          router.push(`/adminHome/${props.userId}`);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
