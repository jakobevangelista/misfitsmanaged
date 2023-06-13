"use client";

import { Button } from "@/components/ui/button";
import { postData } from "../../../utils/helpers";
import router, { useRouter } from "next/navigation";

export default function ManageAccountButton() {
  const router = useRouter();
  const redirectToCustomerPortal = async () => {
    try {
      const { url } = await postData({
        url: "/api/create-portal-link",
      });
      router.push(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };
  return (
    <>
      <Button onClick={redirectToCustomerPortal} className="mx-auto">
        Manage Account
      </Button>
    </>
  );
}
