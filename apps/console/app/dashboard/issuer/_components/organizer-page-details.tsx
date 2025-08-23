"use client";

import { FileUploader } from "@/components/shared/file-uploader";
import Logo from "@/components/shared/logo";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import { useAuth } from "@/hooks/auth/use-auth";
import { ApiInstance } from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Textarea } from "@workspace/ui/components/textarea";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const OrganizerPageDetails = () => {
  const { user } = useAuth();
  const router = useRouter();

  // React.useEffect(() => {
  //   if (user?.userType !== "user") {
  //     router.replace("/dashboard");
  //   }
  // }, [user, router]);

  const [formData, setFormData] = useState({
    issuerType: "",
    description: "",
    document: "", // Single file URL as string
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIssuerTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      issuerType: value,
    }));
  };

  // Handle file upload - extract single URL
  const handleFileUpload = (fileUrls: string[]) => {
    // Get the first (and only) file URL since we're using single upload
    const singleFileUrl = fileUrls.length > 0 ? fileUrls[0] : "";
    setFormData((prev) => ({
      ...prev,
      document: singleFileUrl ?? "",
    }));
  };

  // Handle file removal
  const handleFileRemove = (removedUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      document: "",
    }));
  };

  const validateForm = () => {
    if (!formData.issuerType) {
      toast.error("Please select an issuer type");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Please provide a description");
      return false;
    }
    if (!formData.document) {
      toast.error("Please upload a document");
      return false;
    }
    return true;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      description: string;
      document: string;
      type: string;
    }) => {
      try {
        const response = await ApiInstance.post("/organization/applications", {
          description: data.description,
          document: data.document,
          type: data.type,
        });

        return response.data;
      } catch (error: any) {
        if (error.response?.status === 500) {
          throw new Error(
            "Server error occurred while submitting. Please try again."
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      // Optional: Reset form or redirect
      router.replace("/dashboard/profile");
      setFormData({
        issuerType: "",
        description: "",
        document: "",
      });
   
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit application";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Submit data using the mutation
    mutate({
      type: formData.issuerType,
      description: formData.description,
      document: formData.document,
    });
  };

  return (
    <MaxWrapper className="w-full flex items-center justify-center">
      <div className="bg-card m-auto h-fit w-full max-w-lg rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-1 text-xl font-semibold text-center font-clash">
              Become an Issuer
            </h1>
            <p className="text-sm text-center font-clash">
              Complete the form below to become an issuer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Issuer Type - Required */}
            <div className="space-y-3">
              <Label className="text-sm font-medium font-clash">
                Issuer Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.issuerType}
                onValueChange={handleIssuerTypeChange}
                className="flex flex-row space-x-6"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="institution" id="institution" />
                  <Label
                    htmlFor="institution"
                    className="text-[17px] font-clash font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Institution
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="company" />
                  <Label
                    htmlFor="company"
                    className="text-[17px] font-clash font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Company
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Description - Required */}
            <div className="space-y-2">
              <Label htmlFor="description" className="block text-sm font-clash">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="description"
                id="description"
                placeholder="Tell us about your organization..."
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[80px] resize-none"
                required
                disabled={isPending}
              />
            </div>

            {/* Document Upload - Required */}
            <div className="space-y-2">
              <Label htmlFor="document" className="block text-sm font-clash">
                Supporting Document <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Upload your organization's registration certificate, business
                license, or other supporting document (PDF only, max 10MB)
              </p>

              {/* FileUploader Component Integration */}
              <FileUploader
                onChange={handleFileUpload}
                onRemove={handleFileRemove}
                value={formData.document ? [formData.document] : []} // Convert single URL to array
                uploaderType="single"
                placeholder="Choose PDF file..."
                disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </MaxWrapper>
  );
};

export default OrganizerPageDetails;
