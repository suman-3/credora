"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  GraduationCap,
  Award,
  BookOpen,
  Wrench,
  FileText,
  X,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FileUploader } from "@/components/shared/file-uploader";
import { useMutation } from "@tanstack/react-query";
import { ApiInstance } from "@/lib/apis";
import { toast } from "sonner";

const credentialSchema = z.object({
  recipientAddress: z.string().min(1, "Recipient address is required"),
  recipientName: z.string(),
  credentialData: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    credentialType: z.enum(
      ["Degree", "Certificate", "Course", "Workshop", "License"],
      {
        required_error: "Please select a credential type",
      }
    ),
    subject: z.string().optional(),
    grade: z.string().optional(),
    gpa: z.number().min(0).max(10).optional(),
    credits: z.number().min(0).optional(),
    skills: z.array(z.string()).optional(),
    imageUrl: z.string(),
  }),
});

type CredentialFormData = z.infer<typeof credentialSchema>;

const Issue = () => {
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CredentialFormData>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      credentialData: {
        skills: [],
      },
    },
  });

  const credentialType = watch("credentialData.credentialType");

    const { mutate, isPending } = useMutation({
    mutationFn: async (
        data: CredentialFormData
    ) => {
      try {
        const response = await ApiInstance.post("/credentials/issue", {
          data
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
      toast.success("Issue submitted successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit application";
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: CredentialFormData) => {
    try {
      let imageUrl = "";
      if (uploadedImageUrls.length > 0) {
        imageUrl = uploadedImageUrls[0] || "";
      }
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        console.log("Uploading file:", selectedFile.name);
        imageUrl = URL.createObjectURL(selectedFile);

      }

      const formattedData = {
        ...data,
        credentialData: {
          ...data.credentialData,
          skills: skills,
          imageUrl: imageUrl,
        }
      };

      mutate(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue("credentialData.skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue("credentialData.skills", updatedSkills);
  };

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "Degree":
        return <GraduationCap className="h-4 w-4" />;
      case "Certificate":
        return <Award className="h-4 w-4" />;
      case "Course":
        return <BookOpen className="h-4 w-4" />;
      case "Workshop":
        return <Wrench className="h-4 w-4" />;
      case "License":
        return <FileText className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const handleFileSelect = (urls: string[]) => {
    setUploadedImageUrls(urls);
    setFileUploading(false);
  };

  const handleFileRemove = () => {
    setUploadedImageUrls([""]);

  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="h-6 w-6" />
              Issue New Credential
            </CardTitle>
            <CardDescription>
              Create and issue a new digital credential
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Recipient Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Recipient Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="recipientAddress"
                      className="text-sm font-medium"
                    >
                      Recipient Address *
                    </Label>
                    <Input
                      id="recipientAddress"
                      placeholder="Enter wallet address or email"
                      {...register("recipientAddress")}
                      className={
                        errors.recipientAddress ? "border-red-500" : ""
                      }
                    />
                    {errors.recipientAddress && (
                      <p className="text-sm text-red-500">
                        {errors.recipientAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="recipientName"
                      className="text-sm font-medium"
                    >
                      Recipient Name
                    </Label>
                    <Input
                      id="recipientName"
                      placeholder="Enter recipient's name"
                      {...register("recipientName")}
                    />
                  </div>
                </div>
              </div>

              {/* Credential Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Credential Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Bachelor of Computer Science"
                      {...register("credentialData.title")}
                      className={
                        errors.credentialData?.title ? "border-red-500" : ""
                      }
                    />
                    {errors.credentialData?.title && (
                      <p className="text-sm text-red-500">
                        {errors.credentialData.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="credentialType"
                      className="text-sm font-medium"
                    >
                      Credential Type *
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("credentialData.credentialType", value as any)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.credentialData?.credentialType
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Degree">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Degree
                          </div>
                        </SelectItem>
                        <SelectItem value="Certificate">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Certificate
                          </div>
                        </SelectItem>
                        <SelectItem value="Course">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Course
                          </div>
                        </SelectItem>
                        <SelectItem value="Workshop">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            Workshop
                          </div>
                        </SelectItem>
                        <SelectItem value="License">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            License
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.credentialData?.credentialType && (
                      <p className="text-sm text-red-500">
                        {errors.credentialData.credentialType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the credential..."
                    rows={3}
                    {...register("credentialData.description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Credential Image
                  </Label>
                  <FileUploader
                    onChange={handleFileSelect}
                    onRemove={handleFileRemove}
                    value={uploadedImageUrls}
                    uploaderType="single"
                    placeholder="Choose image file..."
                    disabled={fileUploading}
                  />
                  <p className="text-sm text-gray-500">
                    Upload an image to represent this credential (optional)
                  </p>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Academic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject/Field
                    </Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Computer Science"
                      {...register("credentialData.subject")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-sm font-medium">
                      Grade
                    </Label>
                    <Input
                      id="grade"
                      placeholder="e.g., A+, First Class"
                      {...register("credentialData.grade")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa" className="text-sm font-medium">
                      GPA (0-10)
                    </Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="3.85"
                      {...register("credentialData.gpa", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.credentialData?.gpa && (
                      <p className="text-sm text-red-500">
                        {errors.credentialData.gpa.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credits" className="text-sm font-medium">
                      Credits
                    </Label>
                    <Input
                      id="credits"
                      type="number"
                      min="0"
                      placeholder="120"
                      {...register("credentialData.credits", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Skills & Competencies
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill (e.g., JavaScript, Project Management)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addSkill}
                      variant="outline"
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                  disabled={isPending}
                >
                  {credentialType && getCredentialIcon(credentialType)}
                  {isPending ? "Processing..." : "Issue Credential"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Issue;
