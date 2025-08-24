"use client";

import { ApplicationTable } from "./table";
import { columns } from "./table/columns";
import { useQuery } from "@tanstack/react-query";
import { ApiInstance } from "@/lib/apis";
import { IOrganisationApplication } from "@/types/objects";

type ListingPage = {
  page?: number;
  limit?: number;
};

interface ApiResponse {
  applications: IOrganisationApplication[];
  success: true;
}

export default function ListingPage({ page, limit }: ListingPage) {
  const filters = {
    page,
    limit,
  };

  const { data: applications, isLoading } = useQuery<ApiResponse>({
    queryKey: ["get-all-applications-u", filters],
    queryFn: async () => {
      const response = await ApiInstance.get(
        "/organization/applications",
        {
          params: filters,
        }
      );
      const data = response.data;
      return data;
    },
  });

  const total_applications = applications?.applications.length || 0;
  const all_applications: IOrganisationApplication[] =
    applications?.applications || [];

  return (
    <ApplicationTable
      data={all_applications}
      totalItems={total_applications}
      columns={columns}
      loading={isLoading}
    />
  );
}
