"use client";

import { Button } from "@/components/ui/button";
import { postData } from "../../../../utils/helpers";
import router, { useRouter } from "next/navigation";

export default function ManageAccountButton() {
  const router = useRouter();
  const redirectToCustomerPortal = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { url } = await postData({
        url: "/api/create-portal-link",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      router.push(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };
  return (
    <>
      <Button
        variant="creme"
        onClick={redirectToCustomerPortal}
        className="mx-auto mb-8"
      >
        Manage Account
      </Button>
    </>
  );
}
