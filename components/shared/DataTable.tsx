'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectChange?: (ids: Set<string>) => void;
  getRowId: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  selectable = false,
  selectedIds = new Set(),
  onSelectChange,
  getRowId,
  onRowClick,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectChange) return;
    if (checked) {
      onSelectChange(new Set(data.map(getRowId)));
    } else {
      onSelectChange(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!onSelectChange) return;
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectChange(newSelected);
  };

  const allSelected = data.length > 0 && data.every((item) => selectedIds.has(getRowId(item)));
  const someSelected = data.some((item) => selectedIds.has(getRowId(item)));

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {selectable && (
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && <TableHead className="w-12" />}
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={cn(someSelected && !allSelected && 'opacity-50')}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const id = getRowId(item);
            const isSelected = selectedIds.has(id);

            return (
              <TableRow
                key={id}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  isSelected && 'bg-muted/50'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(id, checked as boolean)}
                      aria-label={`Select row ${id}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
