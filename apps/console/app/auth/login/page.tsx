"use client";

import Logo from "@/components/shared/logo";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import Link from "next/link";
import React from "react";
import { Loader, Mail } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { useRouter } from "next/navigation";

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
  const [showCheckEmail, setShowCheckEmail] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false); // Add this state

  // Use the auth hook
  const { login } = useAuth();

  const router = useRouter();

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

        // Hide email form and show appropriate message
        setShowEmailForm(false);
        if (!responseData.user.isVerified) {
          setShowCheckEmail(true);
        } else {
          // User is verified, show redirecting message and redirect
          setIsRedirecting(true);
          setTimeout(() => {
            router.replace("/dashboard");
          }, 2000); // Optional delay for UX
        }
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
    <MaxWrapper className="w-full bg-transparent lowercase">
      <div className="bg-dark m-auto h-fit w-full max-w-md overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-10 pb-14">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Logo dark />
            </Link>
          </div>

          <div className="mt-6 space-y-6">
            {/* Show redirecting message only when user is verified and redirecting */}
            {isRedirecting && (
              <div className="mt-6 w-full flex flex-col gap-4 items-center justify-center">
                <h1 className="text-lg font-semibold font-clash">
                  Redirecting to Dashboard <Loader className="size-5 ml-2 shrink-0 animate-spin inline" />
                </h1>
              </div>
            )}

            {/* Show wallet connection step */}
            {!signatureData &&
              !showTrust &&
              !showEmailForm &&
              !showCheckEmail &&
              !isRedirecting && (
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="metamask__Layer_1"
                      x="0"
                      y="0"
                      viewBox="0 0 318.6 318.6"
                      width="24"
                      height="24"
                    >
                      <g>
                        <path
                          fill="#e2761b"
                          stroke="#e2761b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m274.1 35.5-99.5 73.9L193 65.8z"
                        />
                        <path
                          d="m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z"
                          fill="#e4761b"
                          stroke="#e4761b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z"
                          fill="#e4761b"
                          stroke="#e4761b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          fill="#d7c1b3"
                          stroke="#d7c1b3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m211.8 247.4-33.9-16.5 2.7 22.1-.3 9.3zm-105 0 31.5 14.9-.2-9.3 2.5-22.1z"
                        />
                        <path
                          fill="#233447"
                          stroke="#233447"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m138.8 193.5-28.2-8.3 19.9-9.1zm40.9 0 8.3-17.4 20 9.1z"
                        />
                        <path
                          fill="#cd6116"
                          stroke="#cd6116"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m106.8 247.4 4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1 20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"
                        />
                        <path
                          fill="#e4751f"
                          stroke="#e4751f"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m87.8 162.1 23.6 46-.8-22.9zm120.3 23.1-1 22.9 23.7-46zm-64-20.6-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z"
                        />
                        <path
                          d="m179.8 193.5-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z"
                          fill="#f6851b"
                          stroke="#f6851b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          fill="#c0ad9e"
                          stroke="#c0ad9e"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m180.3 262.3.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"
                        />
                        <path
                          fill="#161616"
                          stroke="#161616"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m177.9 230.9-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"
                        />
                        <path
                          fill="#763d16"
                          stroke="#763d16"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"
                        />
                        <path
                          d="m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"
                          fill="#f6851b"
                          stroke="#f6851b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    {connectingWallet ? "Connecting" : "Connect with MetaMask"}
                    {connectingWallet && (
                      <Loader className="size-4 shrink-0 animate-spin" />
                    )}
                  </Button>
                </div>
              )}

            {/* Show trust confirmation */}
            {showTrust && !isRedirecting && (
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

            {/* Show email form */}
            {showEmailForm && signatureData && !isRedirecting && (
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

            {/* Show check email message for unverified users */}
            {showCheckEmail && !isRedirecting && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We've sent you a confirmation email at{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Please check your inbox and follow the instructions to
                    complete your login.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MaxWrapper>
  );
}
