import { useState } from 'react';
import { Moon, Sun, Bell, Globe, Volume2, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, Label } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={cn('relative h-6 w-11 rounded-full transition-colors focus-ring', on ? 'bg-primary' : 'bg-muted')} role="switch" aria-checked={on}><span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', on ? 'left-[22px]' : 'left-0.5')} /></button>;
}

export default function SettingsPage() {
  const { theme, toggle } = useThemeStore();
  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" subtitle="Customize your experience" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base">{theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Appearance</CardTitle><CardDescription>Choose your preferred theme</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3"><div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Currently {theme === 'dark' ? 'enabled' : 'disabled'}</p></div><Toggle on={theme === 'dark'} onClick={toggle} /></div>
            <Button variant="outline" size="sm" onClick={toggle}>{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}Switch to {theme === 'dark' ? 'Light' : 'Dark'}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe className="h-4 w-4" /> Language</CardTitle><CardDescription>App display language</CardDescription></CardHeader>
          <CardContent className="space-y-3"><div><Label htmlFor="lang">Language</Label><Select id="lang" defaultValue="en"><option value="en">English</option><option value="ta">Tamil</option><option value="hi">Hindi</option></Select></div><Badge tone="warning">Tamil & Hindi coming soon</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4" /> Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <PrefRow icon={<Bell className="h-4 w-4" />} label="Bus arrival alerts" desc="Notify when bus is near your stop" defaultOn />
            <PrefRow icon={<Volume2 className="h-4 w-4" />} label="Delay notifications" desc="Alert on predicted delays" defaultOn />
            <PrefRow icon={<Smartphone className="h-4 w-4" />} label="Route changes" desc="Announcements about your route" defaultOn />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">About</CardTitle><CardDescription>Application information</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Application" value="CKCET-ITMS" /><Row label="Version" value="1.0.0 (Frontend Preview)" /><Row label="Institution" value="CK College of Engineering and Technology" /><Row label="Location" value="Cuddalore, Tamil Nadu" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PrefRow({ icon, label, desc, defaultOn }: { icon: React.ReactNode; label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
      <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</div><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div></div>
      <Toggle on={on} onClick={() => setOn(!on)} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
