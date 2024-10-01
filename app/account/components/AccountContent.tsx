"use client";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helper";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);
  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error: apiError } = await postData({
        url: "/api/create-portal-link",
      });

      if (apiError) {
        throw new Error(apiError);
      }

      if (url) {
        window.location.assign(url);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-7 px-6 ">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p>No active plan.</p>
          <Button onClick={subscribeModal.onOpen} className="w-[300px]">
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>
            You are currently on the
            <b>{subscription?.prices?.products?.name}</b> plan
          </p>
          <Button
            disabled={loading || isLoading}
            className="w-[300px]"
            onClick={redirectToCustomerPortal}
          >
            Open customer portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
