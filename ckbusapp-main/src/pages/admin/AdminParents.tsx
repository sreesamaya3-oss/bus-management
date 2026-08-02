import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { parentService } from '@/lib/services';
import { ManagementList, RowActions } from '@/components/shared/ManagementList';
import type { Parent } from '@/lib/types';
import { initials } from '@/lib/utils';

export default function AdminParents() {
  const { data: parents } = useQuery({ queryKey: ['parents'], queryFn: parentService.list });
  return (
    <ManagementList title="Parent Management" subtitle="Registered parents and guardians" data={parents ?? []} emptyIcon={<Users className="h-8 w-8" />} searchKeys={['name', 'childName', 'childRegisterNo', 'phone']} onAdd={() => {}} addLabel="Add Parent" rowActions={() => <RowActions />}
      columns={[
        { key: 'name', label: 'Parent', render: (p: Parent) => <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-primary text-xs font-bold text-white">{initials(p.name)}</div><span className="font-semibold">{p.name}</span></div> },
        { key: 'relation', label: 'Relation' },
        { key: 'childName', label: 'Child' },
        { key: 'childRegisterNo', label: 'Child Reg. No', render: (p: Parent) => <span className="font-mono">{p.childRegisterNo}</span> },
        { key: 'phone', label: 'Phone' },
      ]}
    />
  );
}
