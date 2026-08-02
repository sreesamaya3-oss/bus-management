import { useQuery } from '@tanstack/react-query';
import { MessageSquareWarning } from 'lucide-react';
import { complaintService } from '@/lib/services';
import { ManagementList } from '@/components/shared/ManagementList';
import { Badge } from '@/components/ui/Badge';
import type { Complaint } from '@/lib/types';

export default function AdminComplaints() {
  const { data: complaints } = useQuery({ queryKey: ['all-complaints'], queryFn: complaintService.all });
  const statusTone = (s: string) => s === 'resolved' || s === 'closed' ? 'success' : s === 'in-progress' ? 'secondary' : 'warning';
  const priorityTone = (p: string) => p === 'high' ? 'destructive' : p === 'medium' ? 'warning' : 'default';
  return (
    <ManagementList title="Complaint Management" subtitle="Review and resolve student complaints" data={complaints ?? []} emptyIcon={<MessageSquareWarning className="h-8 w-8" />} searchKeys={['studentName', 'subject', 'category', 'status']}
      columns={[
        { key: 'subject', label: 'Subject', render: (c: Complaint) => <span className="font-semibold">{c.subject}</span> },
        { key: 'studentName', label: 'Student' },
        { key: 'category', label: 'Category', render: (c: Complaint) => <Badge tone="outline">{c.category}</Badge> },
        { key: 'priority', label: 'Priority', render: (c: Complaint) => <Badge tone={priorityTone(c.priority)} className="capitalize">{c.priority}</Badge> },
        { key: 'createdAt', label: 'Filed' },
        { key: 'status', label: 'Status', render: (c: Complaint) => <Badge tone={statusTone(c.status)} className="capitalize">{c.status.replace('-', ' ')}</Badge> },
      ]}
    />
  );
}
