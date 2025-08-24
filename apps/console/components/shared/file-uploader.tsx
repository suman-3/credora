"use client";
import { useMutation } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";

import dynamic from "next/dynamic";
import { FileApi } from "@/lib/apis";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

interface FileUploaderProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  uploaderType: "single" | "multiple";
  placeholder?: string;
}

interface UploadResponse {
  message: string;
  s3FileUrls: string[];
}

interface DeleteResponse {
  message: string;
}

const FileUploaderComponent = ({
  disabled,
  onChange,
  onRemove,
  value,
  uploaderType,
  placeholder = "Choose PDF file...",
}: FileUploaderProps) => {
  const MAX_FILE_SIZE = 10; // 10MB for PDF files
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper function to extract filename from URL
  const extractFileName = (url: string): string => {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1] ?? '';
      // Remove query parameters and decode URI
      const cleanFileName = decodeURIComponent((fileName ?? '').split('?')[0] ?? '');
      return cleanFileName || 'file.pdf';
    } catch {
      return 'file.pdf';
    }
  };

  // Helper function to truncate filename for display
const truncateFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop() || '';
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    
    if (nameWithoutExt.length <= 5) return fileName;
    
    const truncatedName = nameWithoutExt.substring(0, 5);
    return `${truncatedName}...${extension}`;
};

  // Upload mutation
  const { mutate: uploadFiles, isPending: isUploading } = useMutation({
    mutationFn: async (files: File[]): Promise<UploadResponse> => {
      try {
        const formData = new FormData();
        
        files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("type", "pdf");

        const response = await FileApi.post("/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        });

        const result: UploadResponse = response.data;

        if (!result.s3FileUrls || result.s3FileUrls.length === 0) {
          throw new Error("No file URLs returned from server");
        }

        return result;
      } catch (error: any) {
        if (error.response?.status === 500) {
          throw new Error("Server error occurred. Please try again later.");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      const fileUrls = data.s3FileUrls;
      
      if (fileUrls && fileUrls.length > 0) {
        if (uploaderType === "single") {
          const firstUrl = fileUrls[0];
          if (typeof firstUrl === "string") {
            onChange([firstUrl]);
          }
          
          setTimeout(() => {
            setRefreshKey(prev => prev + 1);
          }, 100);
        } else {
          onChange([...value, ...fileUrls]);
        }
        
        toast.success(data.message || `${fileUrls.length} PDF file(s) uploaded successfully`);
      } else {
        toast.error("No file URLs returned from server");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload files";
      toast.error(errorMessage);
    },
  });

  // Delete mutation
  const { mutate: deleteFile, isPending: isDeleting } = useMutation({
    mutationFn: async (fileUrl: string): Promise<DeleteResponse> => {
      try {
        const response = await FileApi.delete("/delete", {
          data: {
            fileUrl: fileUrl,
          },
          timeout: 15000,
        });
        
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 500) {
          throw new Error("Server error occurred while deleting. Please try again.");
        }
        throw error;
      }
    },
    onSuccess: (data, fileUrl) => {
      // Call onRemove first, then onChange
      onRemove(fileUrl);
      onChange([]);
      setRefreshKey(prev => prev + 1);
      toast.success("PDF file deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete file";
      toast.error(errorMessage);
    },
  });

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const filesToUpload = uploaderType === "single" ? files.slice(0, 1) : files;

    const invalidFiles = filesToUpload.filter(file => file.type !== "application/pdf");
    if (invalidFiles.length > 0) {
      toast.error("Please select only PDF files");
      return;
    }

    const maxSizeBytes = MAX_FILE_SIZE * 1024 * 1024;
    const oversizedFiles = filesToUpload.filter(file => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`File must be less than ${MAX_FILE_SIZE}MB`);
      return;
    }

    uploadFiles(filesToUpload);
    e.target.value = "";
  };

  const handleDelete = () => {
    if (value[0]) {
      deleteFile(value[0]);
    }
  };

  // Return loading state for SSR
  if (!isMounted) {
    return (
      <div className="w-full">
        <div className="relative">
          <Input
            type="text"
            placeholder="Loading..."
            disabled={true}
            className="pr-10"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Supports: PDF files only (Max {MAX_FILE_SIZE}MB)
        </p>
      </div>
    );
  }

  // For single upload mode
  if (uploaderType === "single") {
    const hasFile = value.length > 0 && value[0];
    const fileName = hasFile ? extractFileName(value[0] ?? '') : '';
    const displayName = hasFile ? truncateFileName(fileName) : '';

    return (
      <div className="w-full">
        <div className="relative">
          {/* Hidden file input */}
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={onUpload}
            disabled={disabled || isUploading || isDeleting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            key={refreshKey}
            style={{ pointerEvents: hasFile ? 'none' : 'auto' }} // Disable file input when file exists
          />
          
          {/* Visible input display */}
          <Input
            type="text"
            value={hasFile ? displayName : ""}
            placeholder={hasFile ? displayName : placeholder}
            readOnly
            disabled={disabled || isUploading || isDeleting}
            className={`pr-10 cursor-pointer ${hasFile ? 'text-foreground' : 'text-muted-foreground'}`}
            title={hasFile ? fileName : placeholder}
          />
          
          {/* Delete button */}
          {hasFile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={disabled || isDeleting || isUploading}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 z-20 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              {isDeleting ? (
                <PuffLoader size={12} color="#6b7280" />
              ) : (
                <CircleX className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Loading indicator for upload */}
          {isUploading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20">
              <PuffLoader size={16} color="#6b7280" />
            </div>
          )}
        </div>

        {/* <p className="text-xs text-muted-foreground mt-2">
          Supports: PDF files only (Max {MAX_FILE_SIZE}MB)
        </p> */}
      </div>
    );
  }

  // Multiple upload mode remains the same...
  return (
    <div className="w-full space-y-3">
      {/* File Input */}
      <div className="relative">
        <Input
          type="file"
          accept=".pdf,application/pdf"
          onChange={onUpload}
          disabled={disabled || isUploading || isDeleting}
          multiple={true}
          placeholder={placeholder}
          className="cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
        />
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
            <div className="flex items-center gap-2">
              <PuffLoader size={20} color="#555" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Display uploaded files */}
      {value.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Uploaded Files ({value.length})
          </h4>
          
          <div className="space-y-2">
            {value.map((url, index) => {
              const fileName = extractFileName(url);
              const truncatedName = truncateFileName(fileName);
              
              return (
                <div
                  key={`file-${url}-${index}-${refreshKey}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate" title={fileName}>
                        {truncatedName}
                      </p>
                      <p className="text-xs text-muted-foreground">PDF File</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => deleteFile(url)}
                    disabled={disabled || isDeleting || isUploading}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <CircleX className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Supports: PDF files only (Max {MAX_FILE_SIZE}MB each)</p>
        <p>Multiple files can be selected at once • Maximum 5 files</p>
      </div>
    </div>
  );
};

export const FileUploader = dynamic(
  () => Promise.resolve(FileUploaderComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full">
        <div className="relative">
          <Input
            type="text"
            placeholder="Loading..."
            disabled={true}
            className="pr-10"
          />
        </div>
        {/* <p className="text-xs text-muted-foreground mt-2">
          Supports: PDF files only (Max 10MB)
        </p> */}
      </div>
    ),
  }
);
