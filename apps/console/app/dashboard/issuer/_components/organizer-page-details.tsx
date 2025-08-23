"use client";

import { FileUploader } from "@/components/shared/file-uploader";
import Logo from "@/components/shared/logo";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import { useAuth } from "@/hooks/auth/use-auth";
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

  React.useEffect(() => {
    if (user?.userType !== "user") {
      router.replace("/dashboard");
    }
  }, [user, router]);
  const [formData, setFormData] = useState({
    issuerType: "",
    description: "",
    document: "", // Single file URL as string
  });

  const [fileUrls, setFileUrls] = useState<string[]>([]); // For FileUploader component

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
    setFileUrls(fileUrls);
    // Get the first (and only) file URL since we're using single upload
    const singleFileUrl = fileUrls.length > 0 ? fileUrls[0] : "";
    setFormData((prev) => ({
      ...prev,
      document: singleFileUrl || "",
    }));
  };

  // Handle file removal
  const handleFileRemove = (removedUrl: string) => {
    setFileUrls([]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Form data now contains single document URL as string
    const submitData = {
      issuerType: formData.issuerType,
      description: formData.description,
      document: formData.document, // Single file URL string
    };

    console.log("Form Data:", submitData);
    toast.success("Application submitted successfully!");
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
              />
            </div>

            {/* Document Upload - Required */}
            <div className="space-y-2">
              <Label htmlFor="document" className="block text-sm font-clash">
                Supporting Document <span className="text-red-500">*</span>
              </Label>
              <FileUploader
                value={fileUrls} // Pass array to FileUploader
                onChange={handleFileUpload}
                onRemove={handleFileRemove}
                uploaderType="single"
                placeholder="Upload registration certificate or business license..."
              />
              <p className="text-xs text-muted-foreground">
                Upload your organization's registration certificate, business
                license, or other supporting document (PDF only, max 10MB)
              </p>
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </MaxWrapper>
  );
};

export default OrganizerPageDetails;
