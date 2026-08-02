import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, GraduationCap, Users, Bus, Route as RouteIcon, MapPin, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { studentService, parentService, busService, routeService } from '@/lib/services';
import { parents as parentsData } from '@/lib/dummyData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import { DEPARTMENTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const steps = ['Student Details', 'Parent Link', 'Transport Assignment', 'Review & Confirm'] as const;

export default function AdminAssignment() {
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', registerNo: '', department: DEPARTMENTS[0] as string, year: 1, section: 'A', parentName: '', parentEmail: '', parentPhone: '', relation: 'Mother', busId: '', routeId: '', pickupStop: '', dropStop: '' });
  const createStudent = useMutation({ mutationFn: studentService.create, onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); setStep(0); } });

  const { data: buses } = useQuery({ queryKey: ['buses'], queryFn: busService.list });
  const { data: routes } = useQuery({ queryKey: ['routes'], queryFn: routeService.list });
  const { data: parents } = useQuery({ queryKey: ['parents'], queryFn: parentService.list });
  const availableRoutes = routes?.filter((r) => r.busId === form.busId) ?? [];
  const availableStops = routes?.find((r) => r.id === form.routeId)?.stops ?? [];

  const update = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }));
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const submit = () => {
    const parent = parents?.find((p) => p.name === form.parentName) ?? parents?.[0] ?? parentsData[0];
    createStudent.mutate({ ...form, parent, scheduleId: 'sch-01', role: 'student' });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Student Assignment Workflow" subtitle="Create student profile and assign transport" />
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors', i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>{i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}</div>
            {i < steps.length - 1 && <div className={cn('mx-2 h-0.5 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-border')} />}
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-primary">{steps[step]}</p>
      <Card>
        <CardContent className="pt-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><GraduationCap className="h-4 w-4 text-primary" /> Student Academic Details</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Student name" /></div>
                <div><Label>Register No</Label><Input value={form.registerNo} onChange={(e) => update('registerNo', e.target.value)} placeholder="CKCETYYXX000" /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="student@ckcet.ac.in" /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 ..." /></div>
                <div><Label>Department</Label><Select value={form.department} onChange={(e) => update('department', e.target.value)}>{DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}</Select></div>
                <div><Label>Year</Label><Select value={form.year} onChange={(e) => update('year', Number(e.target.value))}><option value={1}>1st Year</option><option value={2}>2nd Year</option><option value={3}>3rd Year</option><option value={4}>4th Year</option></Select></div>
                <div><Label>Section</Label><Select value={form.section} onChange={(e) => update('section', e.target.value)}><option value="A">A</option><option value="B">B</option><option value="C">C</option></Select></div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-primary" /> Link Parent Account</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Parent Name</Label><Input value={form.parentName} onChange={(e) => update('parentName', e.target.value)} placeholder="Parent name" /></div>
                <div><Label>Relation</Label><Select value={form.relation} onChange={(e) => update('relation', e.target.value)}><option value="Mother">Mother</option><option value="Father">Father</option><option value="Guardian">Guardian</option></Select></div>
                <div><Label>Parent Email</Label><Input value={form.parentEmail} onChange={(e) => update('parentEmail', e.target.value)} placeholder="parent@parent.ckcet.ac.in" /></div>
                <div><Label>Parent Phone</Label><Input value={form.parentPhone} onChange={(e) => update('parentPhone', e.target.value)} placeholder="+91 ..." /></div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">The parent will be linked to this student and receive live tracking, notifications and safety alerts for their child.</div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><Bus className="h-4 w-4 text-primary" /> Transport Assignment</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Assign Bus</Label><Select value={form.busId} onChange={(e) => { update('busId', e.target.value); const r = routes?.find((rt) => rt.busId === e.target.value); if (r) update('routeId', r.id); }}><option value="">Select bus…</option>{buses?.map((b) => <option key={b.id} value={b.id}>{b.id} — {b.routeName}</option>)}</Select></div>
                <div><Label>Assign Route</Label><Select value={form.routeId} onChange={(e) => update('routeId', e.target.value)} disabled={!form.busId}><option value="">Select route…</option>{availableRoutes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></div>
                <div><Label>Official Pickup Stop</Label><Select value={form.pickupStop} onChange={(e) => update('pickupStop', e.target.value)} disabled={!form.routeId}><option value="">Select stop…</option>{availableStops.map((s) => <option key={s.id} value={s.name}>{s.name} — {s.arrivalTime}</option>)}</Select></div>
                <div><Label>Official Drop Stop</Label><Select value={form.dropStop} onChange={(e) => update('dropStop', e.target.value)} disabled={!form.routeId}><option value="">Select stop…</option>{availableStops.map((s) => <option key={s.id} value={s.name}>{s.name} — {s.departureTime}</option>)}</Select></div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">Students can only select from approved stops on their assigned route. Manual location entry is not permitted.</div>
              {form.pickupStop && form.dropStop && (
                <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Pickup: {form.pickupStop} → Drop: {form.dropStop}</div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-primary" /> Review & Confirm</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ReviewItem icon={<GraduationCap className="h-4 w-4" />} label="Student" value={`${form.name} (${form.registerNo})`} />
                <ReviewItem icon={<GraduationCap className="h-4 w-4" />} label="Department" value={`${form.department}, Y${form.year} ${form.section}`} />
                <ReviewItem icon={<Users className="h-4 w-4" />} label="Parent" value={`${form.parentName} (${form.relation})`} />
                <ReviewItem icon={<Bus className="h-4 w-4" />} label="Bus" value={form.busId || 'Not assigned'} />
                <ReviewItem icon={<RouteIcon className="h-4 w-4" />} label="Route" value={routes?.find((r) => r.id === form.routeId)?.name ?? 'Not assigned'} />
                <ReviewItem icon={<MapPin className="h-4 w-4" />} label="Pickup → Drop" value={`${form.pickupStop || '—'} → ${form.dropStop || '—'}`} />
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <p className="font-medium">Relationship Flow:</p>
                <p className="mt-1 text-xs text-muted-foreground">Student → Parent → Route → Bus → Driver → Pickup Stop</p>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={prev} disabled={step === 0}><ArrowLeft className="h-4 w-4" /> Back</Button>
            {step < steps.length - 1 ? <Button onClick={next}>Next <ArrowRight className="h-4 w-4" /></Button> : <Button onClick={submit} disabled={createStudent.isPending}>{createStudent.isPending ? 'Creating…' : 'Create Student'}</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon} {label}</p><p className="mt-0.5 font-semibold">{value}</p></div>;
}
