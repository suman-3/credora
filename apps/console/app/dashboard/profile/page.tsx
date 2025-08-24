import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

import { searchParamsCache } from "@/lib/searchparams";
import { IconUserShield } from "@tabler/icons-react";
import { siteConfig } from "@workspace/config/console/metadata";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import ProfileDetails from "./_components/profile-details";


export const metadata = {
  title: siteConfig.dashboard.profile.title,
  description: siteConfig.dashboard.profile.description,
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Profile"
            description="Manage your profile information."
          />
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <ProfileDetails />
        </Suspense>
      </div>
    </PageContainer>
  );
}
