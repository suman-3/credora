"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import Image from "next/image";

import { format } from "date-fns";
import { IOrganisationApplication } from "@/types/objects";
import { Badge } from "@workspace/ui/components/badge";

export const columns: ColumnDef<IOrganisationApplication>[] = [
    {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ cell }) => <div>{cell.getValue<IOrganisationApplication["id"]>()}</div>,
  },
    {
    id: "type",
    accessorKey: "type",
    header: "Type",
    cell: ({ cell }) => (
      <div>{cell.getValue<IOrganisationApplication["type"]>()?.toUpperCase()}</div>
    ),
  },
  
    {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => {
      const status = cell.getValue<IOrganisationApplication["status"]>();
      const getVariant = (): "destructive" | "default" | "secondary" | "outline" => {
        switch (status) {
          case "approved":
            return "secondary";
          case "pending":
            return "outline";
          case "rejected":
            return "destructive";
          default:
            return "default";
        }
      };

      return (
        <div>
          <Badge variant={getVariant()} className="uppercase">
            {status}
          </Badge>
        </div>
      );
    },
  },
];
