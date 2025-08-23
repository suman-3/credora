import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { siteConfig } from "@workspace/config/console/metadata";
import { Separator } from "@workspace/ui/components/separator";
// import Link from "next/link"; // Removed unused import
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import ListingPage from "./_components/listing";

export const metadata = {
  title: siteConfig.dashboard.applications.title,
  description: siteConfig.dashboard.applications.description,
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get("page") || 1;
  const limit = searchParamsCache.get("perPage") || 10;

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Applications"
            description="Manage your applications and their settings."
          />
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <ListingPage page={page} limit={limit} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
