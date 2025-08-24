"use client";
import Logo from "@/components/shared/logo";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import { useAuth } from "@/hooks/auth/use-auth";
import { ApiInstance, PublicInstance } from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const VerifyPage = () => {
  const searchparams = useSearchParams();
  const { setUser, user, login } = useAuth();
  const router = useRouter();

  const token = searchparams.get("token");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (token: string) => {
      const res = await PublicInstance.get(`/auth/verify?token=${token}`);
      if (res.status < 200 || res.status >= 300) {
        throw new Error("Failed to verify account");
      }
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Account verified successfully");
      if (user) {
        login(data.user, data.token);
      } else {
        setUser(data.user);
      }
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("Failed to verify account");
    },
  });

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [token]);

  return (
    <MaxWrapper className="w-full bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-md rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-8">
          <div>
            <Link href="/" aria-label="go home">
              <Logo dark />
            </Link>
          </div>

          {isPending ? (
            <div className="space-y-4 mt-8 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Loader className="animate-spin size-6" />
                <h1 className="text-lg font-semibold font-clash text-dark lowercase">
                  Verifying Your Identity
                </h1>
              </div>
            </div>
          ) : error ? (
            <div className="mt-8 w-full flex items-center justify-center flex-col gap-2">
              <h1 className="text-lg font-semibold font-clash text-red-600 lowercase">
                Verification Failed
              </h1>
              <p className="text-sm text-muted-foreground font-clash text-center lowercase">
                There was an error verifying your identity. Please try again or
                contact support.
              </p>
              <Link className="w-full" href="/auth/login">
                <Button
                  className="w-full mt-2 cursor-pointer font-clash lowercase"
                  variant="destructive"
                >
                  Go To Login
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 w-full flex items-center justify-center flex-col gap-2">
              <h1 className="text-lg font-semibold font-clash text-dark lowercase">
                Your Identity Has Been Verified
              </h1>
              <p className="text-sm text-muted-foreground font-clash lowercase">
                You can now close this window.
              </p>
              <Link className="w-full" href="/dashboard">
                <Button className="w-full mt-2 cursor-pointer lowercase font-clash">
                  Go To Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MaxWrapper>
  );
};

export default VerifyPage;
