import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Separator } from "@workspace/ui/components/separator";
import React, { Suspense } from "react";
import Issue from "./_components/issue";

const IssuePage = () => {
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
          <Issue/>
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default IssuePage;
