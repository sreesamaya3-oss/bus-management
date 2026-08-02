import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, CheckCircle2, Users, Loader2, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';

interface ScanResult { id: string; name: string; registerNo: string; time: string; status: 'boarded' | 'duplicate'; }

export default function DriverScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([
    { id: 'stu-01', name: 'S. Kavin', registerNo: 'CKCET21CS045', time: '07:09', status: 'boarded' },
    { id: 'stu-02', name: 'R. Divya', registerNo: 'CKCET22EC012', time: '07:14', status: 'boarded' },
  ]);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResults((r) => [{ id: `stu-${Date.now()}`, name: 'A. Vignesh', registerNo: 'CKCET23ME078', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), status: 'boarded' }, ...r]);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="QR Attendance Scanner" subtitle="Scan student QR codes to mark boarding" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Scanner</CardTitle><CardDescription>Point the scanner at the student QR pass</CardDescription></CardHeader>
          <CardContent>
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border-2 border-border bg-muted/30">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground"><Camera className="h-16 w-16" /></div>
              <div className="absolute inset-8 rounded-xl border-2 border-dashed border-primary/50" />
              {scanning && <motion.div className="absolute inset-x-8 h-1 rounded-full bg-primary shadow-glow" initial={{ top: 32 }} animate={{ top: ['calc(100% - 32px)', 32] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />}
              <div className="absolute left-8 top-8 h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-primary" />
              <div className="absolute right-8 top-8 h-6 w-6 rounded-tr-xl border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-8 left-8 h-6 w-6 rounded-bl-xl border-l-2 border-b-2 border-primary" />
              <div className="absolute bottom-8 right-8 h-6 w-6 rounded-br-xl border-r-2 border-b-2 border-primary" />
            </div>
            <Button onClick={simulateScan} disabled={scanning} size="lg" className="mt-4 w-full">{scanning ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning…</> : <><ScanLine className="h-4 w-4" /> Simulate Scan</>}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Boarded Today</CardTitle><CardDescription>{results.filter((r) => r.status === 'boarded').length} students checked in</CardDescription></CardHeader>
          <CardContent>
            <div className="scrollbar-thin max-h-96 space-y-2 overflow-y-auto">
              <AnimatePresence initial={false}>
                {results.map((r) => (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-success" /><div><p className="text-sm font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.registerNo}</p></div></div>
                    <div className="text-right"><Badge tone="success">Boarded</Badge><p className="mt-1 font-mono text-xs text-muted-foreground">{r.time}</p></div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
