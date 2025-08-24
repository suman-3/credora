"use client";
import { AlertModal } from "@/components/modal/alert-modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { ApiInstance } from "@/lib/apis";
import { IOrganisationApplication } from "@/types/objects";
import {
  IconEdit,
  IconDotsVertical,
  IconTrash,
  IconLocation,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import SheetItem from "@/components/sheet-item";

interface CellActionProps {
  data: IOrganisationApplication;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: async (data: IOrganisationApplication) => {
      const res = await ApiInstance.put(
        `/organization/admin/applications/${data.id}/review`,
        {
          status: "approved",
        }
      );
      if (res.status !== 200) throw new Error("Failed to approve application");
      const json = res.data;
      return json;
    },
    onMutate: () => {
      toast.loading("Approving application", {
        id: `approve-application-${data.id}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-applications"],
      });
      setOpen(false);

      toast.success("Application approved successfully", {
        id: `approve-application-${data.id}`,
      });
    },
    onError: (error) => {
      toast.error(`Error approving application`, {
        id: `approve-application-${data.id}`,
      });
    },
  });

  const { mutate: delApplication, isPending } = useMutation({
    mutationFn: async (data: IOrganisationApplication) => {
      const res = await ApiInstance.delete(
        `/organization/applications/${data.id}`
      );
      if (res.status !== 200) throw new Error("Failed to delete application");
      const json = res.data;
      return json;
    },
    onMutate: () => {
      toast.loading("Deleting application", {
        id: `delete-application-${data.id}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-applications"],
      });
      setOpen(false);

      toast.success("Application deleted successfully", {
        id: `delete-application-${data.id}`,
      });
    },
    onError: (error) => {
      toast.error(`Error deleting application`, {
        id: `delete-application-${data.id}`,
      });
    },
  });

  // Helper function to extract filename from URL or generate one
  const getFileName = (url: string, fallbackName: string = "document") => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split("/");
      const lastSegment = segments[segments.length - 1];

      // If the last segment contains a meaningful name, use it
      if (lastSegment && lastSegment.length > 10) {
        return lastSegment;
      }

      return `${fallbackName}-${data.id}`;
    } catch {
      return `${fallbackName}-${data.id}`;
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      toast.loading("Generating download link...", {
        id: `download-${data.id}`,
      });

      // Make API call to get download URL
      const response = await ApiInstance.post(`/file/download/`, {
        fileUrl: data.document,
      });

      // Check if we got a valid response
      if (response.data?.downloadUrl) {
        const downloadUrl = response.data.downloadUrl;
        const fileName = getFileName(downloadUrl, "document");

        // Method 1: Using fetch and blob (recommended for better control)
        try {
          const fileResponse = await fetch(downloadUrl);

          if (!fileResponse.ok) {
            throw new Error("Failed to fetch file");
          }

          const blob = await fileResponse.blob();

          // Create download link
          const link = document.createElement("a");
          const objectUrl = URL.createObjectURL(blob);

          link.href = objectUrl;
          link.download = fileName;
          link.style.display = "none";

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up object URL
          URL.revokeObjectURL(objectUrl);

          toast.success("File downloaded successfully!", {
            id: `download-${data.id}`,
          });
        } catch (fetchError) {
          // Fallback: Direct link method
          console.warn(
            "Fetch method failed, using direct link method:",
            fetchError
          );

          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = fileName;
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast.success("Download initiated!", {
            id: `download-${data.id}`,
          });
        }
      } else {
        throw new Error("No download URL received from server");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document. Please try again.", {
        id: `download-${data.id}`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const onConfirm = async () => {
    delApplication(data);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader className="border border-b">
            <SheetTitle>Selling Query Details</SheetTitle>
          </SheetHeader>
          <div className="flex w-full flex-col gap-2 px-4 border-b pb-2">
            <SheetItem strong="ID" text={data.id} />
            <SheetItem strong="Type" text={data.status} />
            <SheetItem strong="Description" text={data.description} />
            <Button
              className="mt-4"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download Document"}
            </Button>
          </div>
         {data.status !== "approved" && (
           <Button onClick={() => update(data)} disabled={updating}>
             {updating ? "Approving" : "Approve Application"}
           </Button>
         )}
        </SheetContent>
      </Sheet>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setSheetOpen(true)}>
            <IconLocation className="mr-2 h-4 w-4" /> Operation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
