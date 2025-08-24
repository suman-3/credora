'use client';


import { DataTable } from '@/components/table/data-table';
import { DataTableToolbar } from '@/components/table/data-table-toolbar';
import { useDataTable } from '@/components/table/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  loading?: boolean;
}
export function ApplicationTable<TData, TValue>({
  data,
  totalItems,
  columns,
  loading
}: ProductTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // product data
    columns, // product columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 500
  });

  return (
    <DataTable table={table} loading={loading} loadingRowCount={6}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
