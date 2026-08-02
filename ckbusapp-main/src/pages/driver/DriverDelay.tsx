import { useState } from 'react';
import { Clock, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';

interface Report { id: string; minutes: number; reason: string; note: string; time: string; }

export default function DriverDelay() {
  const [minutes, setMinutes] = useState(10);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [reports, setReports] = useState<Report[]>([{ id: 'r1', minutes: 8, reason: 'Traffic', note: 'Heavy traffic at Manjakuppam junction', time: '07:15' }]);
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setReports((r) => [{ id: `r${Date.now()}`, minutes, reason, note, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }, ...r]);
    setSubmitted(true); setNote(''); setReason('');
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Delay Reporting" subtitle="Report delays to notify the Transport Office and parents" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Report a Delay</CardTitle><CardDescription>Parents and office will be notified instantly</CardDescription></CardHeader>
          <CardContent>
            {submitted && <div className="mb-4 flex items-center gap-2 rounded-lg bg-success/15 p-3 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Delay reported successfully. Notifications sent.</div>}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Delay Duration (minutes)</Label>
                <div className="flex items-center gap-3"><input type="range" min={1} max={60} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="flex-1 accent-primary" /><span className="w-16 rounded-lg bg-muted px-3 py-1.5 text-center font-mono font-bold">{minutes} min</span></div>
              </div>
              <div><Label htmlFor="reason">Reason</Label><Select id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required><option value="">Select…</option><option value="Traffic">Traffic congestion</option><option value="Weather">Bad weather</option><option value="Breakdown">Vehicle breakdown</option><option value="Roadwork">Road work / diversion</option><option value="Other">Other</option></Select></div>
              <div><Label htmlFor="note">Additional Note</Label><Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional details…" /></div>
              <Button type="submit" className="w-full"><Send className="h-4 w-4" /> Submit Delay Report</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4" /> Recent Reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {reports.map((r) => (
              <div key={r.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between"><Badge tone="warning"><AlertTriangle className="h-3 w-3" /> +{r.minutes} min</Badge><span className="font-mono text-xs text-muted-foreground">{r.time}</span></div>
                <p className="mt-2 text-sm font-medium">{r.reason}</p>
                {r.note && <p className="text-xs text-muted-foreground">{r.note}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
