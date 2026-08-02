import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, Phone, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function DriverSOS() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activated, setActivated] = useState(false);
  const trigger = () => { setConfirmOpen(false); setActivated(true); setTimeout(() => setActivated(false), 5000); };

  return (
    <div className="space-y-6">
      <SectionHeader title="Emergency SOS" subtitle="Alert the Transport Office and campus security immediately" />
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <motion.button onClick={() => setConfirmOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex h-40 w-40 items-center justify-center rounded-full bg-destructive text-white shadow-glow focus-ring">
            {activated && <><span className="absolute inset-0 animate-pulse-ring rounded-full bg-destructive" /><span className="absolute inset-0 animate-pulse-ring rounded-full bg-destructive" style={{ animationDelay: '0.6s' }} /></>}
            <div className="relative flex flex-col items-center"><Siren className="h-12 w-12" /><span className="mt-2 font-display text-lg font-bold">SOS</span></div>
          </motion.button>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">Press to send an emergency alert with your live location to the Transport Office, campus security, and the registered emergency contacts.</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3"><Phone className="h-6 w-6 text-primary" /><div><p className="text-sm font-semibold">Transport Office</p><p className="text-sm text-muted-foreground">+91 4142 220 100</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-secondary" /><div><p className="text-sm font-semibold">Campus Security</p><p className="text-sm text-muted-foreground">+91 4142 220 911</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-destructive" /><div><p className="text-sm font-semibold">Ambulance</p><p className="text-sm text-muted-foreground">108</p></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Emergency Instructions</CardTitle><CardDescription>Follow these steps during an emergency</CardDescription></CardHeader>
        <CardContent><ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground"><li>Bring the bus to a safe stop and engage the parking brake.</li><li>Ensure all students are safe and accounted for.</li><li>Press the SOS button to alert the Transport Office and security.</li><li>Call the Transport Office if the SOS does not connect.</li><li>Do not move the bus until clearance is received from the office.</li></ol></CardContent>
      </Card>
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Emergency SOS" description="This will instantly alert the Transport Office and security.">
        <p className="text-sm text-muted-foreground">Are you sure you want to trigger an emergency alert?</p>
        <div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirmOpen(false)}><X className="h-4 w-4" /> Cancel</Button><Button variant="destructive" onClick={trigger}><Siren className="h-4 w-4" /> Trigger SOS</Button></div>
      </Modal>
      <AnimatePresence>
        {activated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-destructive px-6 py-4 text-white shadow-xl">
            <p className="flex items-center gap-2 font-semibold"><Siren className="h-5 w-5" /> Emergency alert sent! Help is on the way.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
