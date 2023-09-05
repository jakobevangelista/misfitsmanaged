"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProfilePicture } from "./setProfilePicture";
import Image from "next/image";

export default function ImageUpload(props: { userId: number }) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Function to handle the file input change
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0];

    if (file) {
      const reader = new FileReader();

      // Callback function when the file is loaded as data URL
      reader.onload = (e) => {
        const dataUrl = e.target!.result as string;
        setImageDataUrl(dataUrl); // Set the data URL in the state
        // setImageDataUrl(compressed); // Set the data URL in the state
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="mx-auto">
      <Label htmlFor="picture">Upload a JPEG or PNG</Label>
      <Input id="picture" type="file" onChange={handleFileInputChange} />

      {/* Display the uploaded image as a data URL */}
      {imageDataUrl && (
        <div>
          <Image src={imageDataUrl} height={500} width={500} alt="Uploaded" />
          <Button
            onClick={() => {
              startTransition(() =>
                setProfilePicture(props.userId, imageDataUrl || "")
              );
              router.push(`/adminHome/${props.userId}`);
            }}
            variant="green"
            className="m-4 mx-auto"
          >
            Click here to set profile pic as uploaded image
          </Button>
          <Button
            onClick={() => {
              setImageDataUrl(null);
            }}
            variant="destructive"
            className="m-4 mx-auto"
          >
            Clear Picture
          </Button>
        </div>
      )}
    </div>
  );
}
