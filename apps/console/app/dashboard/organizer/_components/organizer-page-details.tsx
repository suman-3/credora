import Logo from "@/components/shared/logo";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Link from "next/link";
import React from "react";

const OrganizerPageDetails = () => {
  return (
    <MaxWrapper className="w-full flex items-center justify-center">
      <div
        className="bg-card m-auto h-fit w-full max-w-md rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-1 text-xl font-semibold text-center font-clash">
             Become an Issuer
            </h1>
            <p className="text-sm text-center font-clash">
              Complete the form below to become an issuer.
            </p>
          </div>

          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Username
              </Label>
              <Input type="email" required name="email" id="email" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="#"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                className="input sz-md variant-mixed"
              />
            </div>

            <Button className="w-full">Sign In</Button>
          </div>
        </div>
      </div>
    </MaxWrapper>
  );
};

export default OrganizerPageDetails;
