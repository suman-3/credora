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
import { IconEdit, IconDotsVertical, IconTrash, IconLocation } from "@tabler/icons-react";
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
  const queryClient = useQueryClient();
  const router = useRouter();

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
        id: `delete-application-${data.id}`, // Add unique ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-applications"],
      });
      setOpen(false);

      toast.success("Application deleted successfully", {
        id: `delete-application-${data.id}`, // Same ID to replace loading toast
      });
    },
    onError: (error) => {
      toast.error(`Error deleting application`, {
        id: `delete-application-${data.id}`, // Same ID to replace loading toast
      });
    },
  });

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

          </div>
          <div className="flex w-full flex-col gap-4 px-4">
            <h1 className="text-md font-medium flex items-center gap-2">
              Update Application Status
            </h1>
            </div>
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
