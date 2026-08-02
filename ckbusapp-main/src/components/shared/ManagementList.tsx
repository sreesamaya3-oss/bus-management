import { useState, type ReactNode } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

export interface Column<T> { key: keyof T | string; label: string; render?: (row: T) => ReactNode; className?: string; }

interface ManagementListProps<T extends { id: string }> {
  title: string; subtitle?: string; data: T[]; columns: Column<T>[];
  searchKeys: (keyof T)[]; onAdd?: () => void; addLabel?: string;
  emptyIcon?: ReactNode; rowActions?: (row: T) => ReactNode;
}

export function ManagementList<T extends { id: string }>({ title, subtitle, data, columns, searchKeys, onAdd, addLabel = 'Add New', emptyIcon, rowActions }: ManagementListProps<T>) {
  const [query, setQuery] = useState('');
  const filtered = data.filter((row) => searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="space-y-6">
      <SectionHeader title={title} subtitle={subtitle} action={onAdd && <Button onClick={onAdd}><Plus className="h-4 w-4" /> {addLabel}</Button>} />
      <Card><CardContent className="p-3"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="pl-9" /></div></CardContent></Card>
      <Card>
        <CardContent className="p-0">
          {filtered.length ? (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  {columns.map((c) => <th key={String(c.key)} className={cn('px-4 py-3 font-medium', c.className)}>{c.label}</th>)}
                  {rowActions && <th className="px-4 py-3 text-right font-medium">Actions</th>}
                </tr></thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-border/60 transition-colors hover:bg-muted/40">
                      {columns.map((c) => <td key={String(c.key)} className={cn('px-4 py-3', c.className)}>{c.render ? c.render(row) : String(row[c.key as keyof T] ?? '—')}</td>)}
                      {rowActions && <td className="px-4 py-3 text-right">{rowActions(row)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState icon={emptyIcon ?? <Search className="h-8 w-8" />} title="No records found" description={query ? 'Try a different search.' : 'Nothing to show yet.'} />}
        </CardContent>
      </Card>
    </div>
  );
}

export function RowActions() {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}
