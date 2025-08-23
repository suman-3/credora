"use client";

import Logo from "@/components/shared/logo";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import Link from "next/link";
import React from "react";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";


// Type definitions for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

interface SignatureData {
  walletAddress: string;
  signature: string;
  message: string;
  trust: boolean;
}

export default function AuthPage() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [connectingWallet, setConnectingWallet] = React.useState(false);
  const [signatureData, setSignatureData] =
    React.useState<SignatureData | null>(null);
  const [showTrust, setShowTrust] = React.useState(false);
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  
  // Use the auth hook
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signatureData) {
      toast.error("No signature data available");
      return;
    }

    setSubmitting(true);
    try {
      const loginData = {
        email,
        ...signatureData,
      };

      const loginResponse = await fetch(
        "https://api.credora.tech/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(loginData),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Login failed");
      }

      const responseData = await loginResponse.json();

      // Store user data using the auth store
      if (responseData.success && responseData.user) {
        // Extract token from response or cookies if available
        const token = responseData.token || "session-token"; // Adjust based on your API response
        login(responseData.user, token);

        toast.success("Login successful!");
        
        // Redirect user after successful login
        // window.location.href = "/dashboard"; // or use Next.js router
      } else {
        throw new Error("Invalid response format");
      }

    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Login error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const connectAndSign = async () => {
    setConnectingWallet(true);
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        toast.error("Please install MetaMask");
        return;
      }

      // Connect to MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];

      toast.success(
        `Connected to wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      );

      // Step 1: Get challenge from API
      const challengeResponse = await fetch(
        "https://api.credora.tech/api/auth/challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress }),
        }
      );

      if (!challengeResponse.ok) {
        throw new Error("Failed to get challenge from server");
      }

      const challengeData = await challengeResponse.json();

      // Step 2: Sign the message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [challengeData.message, walletAddress],
      });


      const newSignatureData: SignatureData = {
        walletAddress,
        signature,
        message: challengeData.message,
        trust: false, // Default value
      };

      setSignatureData(newSignatureData);
      setShowTrust(true);

      toast.success("Message signed successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleTrustConfirmation = async (trustValue: boolean) => {
    if (!signatureData) return;

    try {
      const updatedSignatureData = {
        ...signatureData,
        trust: trustValue,
      };

      setSignatureData(updatedSignatureData);
      toast.success(`Trust ${trustValue ? "confirmed" : "declined"}`);
      setShowTrust(false);

      if (trustValue) {
        // Show email form after trust is confirmed
        setShowEmailForm(true);
      } else {
        // Reset everything if trust is declined
        setSignatureData(null);
        setShowEmailForm(false);
      }
    } catch (error) {
      toast.error("Failed to confirm trust");
    }
  };

  return (
    <MaxWrapper className="w-full bg-transparent">
      <div className="bg-dark m-auto h-fit w-full max-w-md overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-10 pb-14">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Logo dark />
            </Link>
          </div>

          <div className="mt-6 space-y-6">
            {!signatureData && !showTrust && !showEmailForm && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Connect Your Wallet
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Connect your MetaMask wallet to continue
                  </p>
                </div>
                <Button
                  size="md"
                  className="w-full cursor-pointer"
                  onClick={connectAndSign}
                  disabled={connectingWallet}
                >
                 
                  {connectingWallet ? "Connecting" : "Connect with MetaMask"}
                  {connectingWallet && (
                    <Loader className="size-4 shrink-0 animate-spin" />
                  )}
                </Button>
              </div>
            )}

            {showTrust && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold mb-2">Confirm Trust</h2>
                  <p className="text-sm text-muted-foreground">
                    Do you trust this application with your wallet connection?
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="md"
                    onClick={() => handleTrustConfirmation(true)}
                    className="flex-1 cursor-pointer"
                  >
                    Yes, I trust
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => handleTrustConfirmation(false)}
                    className="flex-1 cursor-pointer"
                  >
                    No, cancel
                  </Button>
                </div>
              </div>
            )}

            {showEmailForm && signatureData && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Complete Registration
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Please provide your email to complete the login process
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    required
                    name="email"
                    id="email"
                    className="text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                <Button
                  size="md"
                  className="w-full cursor-pointer"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Logging in" : "Complete Login"}
                  {submitting && (
                    <Loader className="size-4 shrink-0 animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </MaxWrapper>
  );
}
