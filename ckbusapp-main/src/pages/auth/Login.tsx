import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, ArrowLeft, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { ROLE_LABELS, APP_NAME, INSTITUTION_NAME } from '@/lib/constants';
import { authService } from '@/lib/services';
import type { UserRole } from '@/lib/types';

const demoCreds: Record<UserRole, { email: string; password: string }> = {
  student: { email: 'kavin.s@ckcet.ac.in', password: 'demo1234' },
  parent: { email: 'lakshmi.s@parent.ckcet.ac.in', password: 'demo1234' },
  driver: { email: 'senthil@ckcet.ac.in', password: 'demo1234' },
  admin: { email: 'anand.v@ckcet.ac.in', password: 'demo1234' },
};

export default function Login() {
  const { role = 'student' } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState(demoCreds[role].email);
  const [password, setPassword] = useState(demoCreds[role].password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await authService.login(role, email);
      setUser(user);
      navigate(`/${role}`);
    } catch {
      setError('Invalid credentials. Try the demo account below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <button onClick={() => navigate('/')} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to role selection</button>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-glow"><Bus className="h-6 w-6 text-white" /></div>
            <div><p className="font-display text-lg font-bold">{APP_NAME}</p><p className="text-xs text-muted-foreground">{INSTITUTION_NAME}</p></div>
          </div>
          <Card className="glass-strong">
            <CardContent>
              <h1 className="font-display text-2xl font-bold">{ROLE_LABELS[role]} Login</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to access your {role} portal.</p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required /></div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative"><Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required /></div>
                </div>
                {error && <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" /> {error}</div>}
                <Button type="submit" size="lg" className="w-full" disabled={loading}><LogIn className="h-4 w-4" />{loading ? 'Signing in…' : 'Sign In'}</Button>
              </form>
              <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Demo credentials</p>
                <p className="mt-1">Email: {demoCreds[role].email}</p>
                <p>Password: {demoCreds[role].password}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
