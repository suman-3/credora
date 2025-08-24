"use client";
import { useMutation } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import Image from "next/image";

import dynamic from "next/dynamic";
import { FileApi } from "@/lib/apis";
import { IconPhotoSquareRounded } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

interface ImageUploaderProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  uploaderType: "single" | "multiple";
}

interface UploadResponse {
  message: string;
  s3FileUrls: string[];
}

interface DeleteResponse {
  message: string;
}

const ImageUploaderComponent = ({
  disabled,
  onChange,
  onRemove,
  value,
  uploaderType,
}: ImageUploaderProps) => {
  const MAX_FILE_SIZE = 5; // 5MB
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  // Simple image preview component
  const SimpleImagePreview = ({ url, alt }: { url: string; alt: string }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Reset states when URL changes
    useEffect(() => {
      setImageLoaded(false);
      setImageError(false);
    }, [url]);

    return (
      <>
        <Image
          src={url}
          alt={alt}
          className="object-cover"
          fill
          sizes="208px"
          onLoad={() => {
            setImageLoaded(true);
          }}
          onError={(e) => {
            setImageError(true);
          }}
          unoptimized={true} // Bypass Next.js optimization for better compatibility
        />
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <PuffLoader size={24} color="#555" />
          </div>
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-red-500 mb-2">Failed to load</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setImageError(false);
                  setImageLoaded(false);
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  // Upload mutation
  const { mutate: uploadImages, isPending: isUploading } = useMutation({
    mutationFn: async (files: File[]): Promise<UploadResponse> => {
      try {
        const formData = new FormData();
        
        // Append files with the field name expected by server
        files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("type", "image");

        const response = await FileApi.post("/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
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
      console.log('🔄 Upload success response:', data);
      
      const imageUrls = data.s3FileUrls;
      console.log('📝 Image URLs received:', imageUrls);
      
      if (imageUrls && imageUrls.length > 0) {
        const firstUrl = imageUrls[0];
        console.log('🎯 Using URL:', firstUrl);
        
        if (uploaderType === "single") {
          // Force immediate update
          if (typeof firstUrl === "string") {
            onChange([firstUrl]);
          }
          
          // Force re-render after state update
          setTimeout(() => {
            console.log('🔄 Forcing re-render');
            setRefreshKey(prev => prev + 1);
          }, 100);
        } else {
          // For multiple upload, append to existing values
          onChange([...value, ...imageUrls]);
        }
        
        toast.success(data.message || `${imageUrls.length} image(s) uploaded successfully`);
      } else {
        console.error('❌ No valid URLs in response');
        toast.error("No image URLs returned from server");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload images";
      toast.error(errorMessage);
    },
  });

  // Delete mutation
  const { mutate: deleteImage, isPending: isDeleting } = useMutation({
    mutationFn: async (fileUrl: string): Promise<DeleteResponse> => {
      try {
        const response = await FileApi.delete("/delete", {
          data: {
            fileUrl: fileUrl,
          },
          timeout: 15000, // 15 second timeout
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
      const newValue = value.filter((imageUrl) => imageUrl !== fileUrl);
      onRemove(fileUrl);
      onChange(newValue);
      toast.success("Image deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete image";
      toast.error(errorMessage);
    },
  });

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // For single upload, only take the first file
    const filesToUpload = uploaderType === "single" ? files.slice(0, 1) : files;

    // Validate each file type
    const invalidFiles = filesToUpload.filter(file => !file.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      toast.error("Please select only valid image files");
      return;
    }

    // Validate file sizes
    const maxSizeBytes = MAX_FILE_SIZE * 1024 * 1024;
    const oversizedFiles = filesToUpload.filter(file => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`All files must be less than ${MAX_FILE_SIZE}MB`);
      return;
    }

    // Check total number of files for multiple upload
    if (uploaderType === "multiple" && value.length + filesToUpload.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    uploadImages(filesToUpload);
    e.target.value = "";
  };

  const onDelete = (url: string) => {
    deleteImage(url);
  };

  // Return loading state for SSR
  if (!isMounted) {
    return (
      <div className="w-full">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-2">
            <IconPhotoSquareRounded className="size-6 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center px-2">
              Loading
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Supports: JPG, PNG, GIF, WebP (Max {MAX_FILE_SIZE}MB each)
        </p>
      </div>
    );
  }

  // For single upload mode
  if (uploaderType === "single") {
    return (
      <div className="w-full">
        <div className="mb-4 w-full">
          {value.length > 0 && value[0] ? (
            <div key={`single-${value[0]}-${refreshKey}`} className="relative w-52 h-52 rounded-md overflow-hidden border">
              <SimpleImagePreview url={value[0]} alt="Uploaded image" />
              
              <div className="absolute z-40 top-2 right-2">
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={() => value[0] && onDelete(value[0])}
                  disabled={disabled || isDeleting || isUploading}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <CircleX className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Overlay for replacing image */}
              <div className="absolute inset-0 bg-transparent hover:bg-black/40 transition-all duration-200 flex items-center justify-center z-30">
                <label className="cursor-pointer w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-700 font-medium">
                      Click to replace
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={onUpload}
                    accept="image/*"
                    className="w-0 h-0 opacity-0"
                    disabled={disabled || isUploading || isDeleting}
                  />
                </label>
              </div>
            </div>
          ) : (
            // Upload area when no image
            <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3 transition-colors">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <PuffLoader size={30} color="#555" />
                  <p className="text-xs text-muted-foreground">
                    Uploading image
                  </p>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
                  <IconPhotoSquareRounded className="size-6 shrink-0 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center px-2">
                    Upload Image
                  </p>
                  <input
                    type="file"
                    onChange={onUpload}
                    accept="image/*"
                    className="w-0 h-0 opacity-0"
                    disabled={disabled || isUploading || isDeleting}
                  />
                </label>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Supports: JPG, PNG, GIF, WebP (Max {MAX_FILE_SIZE}MB)
        </p>
      </div>
    );
  }

  // For multiple upload mode
  return (
    <div className="w-full">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {/* Display existing images */}
        {value.map((url, index) => (
          <div
            className="relative w-52 h-52 rounded-md overflow-hidden border"
            key={`multiple-${url}-${index}-${refreshKey}`}
          >
            <SimpleImagePreview url={url} alt={`Uploaded image ${index + 1}`} />
            
            <div className="absolute z-40 top-2 right-2">
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => onDelete(url)}
                disabled={disabled || isDeleting || isUploading}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <CircleX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Upload Area - only show if less than 10 images */}
        {value.length < 10 && (
          <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3 transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <PuffLoader size={30} color="#555" />
                <p className="text-xs text-muted-foreground">
                  Uploading images
                </p>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
                <IconPhotoSquareRounded className="size-6 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center px-2">
                  Upload Images
                </p>
                <p className="text-xs text-muted-foreground text-center px-2">
                  (Multiple selection supported)
                </p>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className="w-0 h-0 opacity-0"
                  disabled={disabled || isUploading || isDeleting}
                  multiple
                />
              </label>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Supports: JPG, PNG, GIF, WebP (Max {MAX_FILE_SIZE}MB each) • Multiple files can be selected at once • Maximum 10 images
      </p>
    </div>
  );
};

// Export as dynamic component to prevent SSR issues
export const ImageUploader = dynamic(
  () => Promise.resolve(ImageUploaderComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-2">
            <IconPhotoSquareRounded className="size-6 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center px-2">
              Loading
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Supports: JPG, PNG, GIF, WebP (Max 5MB each)
        </p>
      </div>
    ),
  }
);
