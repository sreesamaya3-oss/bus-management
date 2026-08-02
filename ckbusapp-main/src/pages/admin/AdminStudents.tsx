import { useQuery } from '@tanstack/react-query';
import { GraduationCap } from 'lucide-react';
import { studentService } from '@/lib/services';
import { ManagementList, RowActions } from '@/components/shared/ManagementList';
import { Badge } from '@/components/ui/Badge';
import type { Student } from '@/lib/types';
import { initials } from '@/lib/utils';

export default function AdminStudents() {
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: studentService.list });
  return (
    <ManagementList title="Student Management" subtitle="All students using college transport" data={students ?? []} emptyIcon={<GraduationCap className="h-8 w-8" />} searchKeys={['name', 'registerNo', 'department', 'busId']} onAdd={() => {}} addLabel="Add Student" rowActions={() => <RowActions />}
      columns={[
        { key: 'name', label: 'Student', render: (s: Student) => <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">{initials(s.name)}</div><span className="font-semibold">{s.name}</span></div> },
        { key: 'registerNo', label: 'Register No', render: (s: Student) => <span className="font-mono">{s.registerNo}</span> },
        { key: 'department', label: 'Department', render: (s: Student) => s.department.split(' ').slice(0, 2).join(' ') },
        { key: 'year', label: 'Year', render: (s: Student) => `Y${s.year} · ${s.section}` },
        { key: 'busId', label: 'Bus', render: (s: Student) => <Badge tone="primary">{s.busId}</Badge> },
        { key: 'pickupStop', label: 'Pickup' },
      ]}
    />
  );
}
