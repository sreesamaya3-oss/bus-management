import { Link } from 'react-router-dom';
import { Bus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="relative">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-glow"><Bus className="h-8 w-8 text-white" /></div>
        <p className="font-display text-7xl font-extrabold gradient-text">404</p>
        <p className="mt-2 text-lg font-semibold">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="mt-6 inline-block"><Button><ArrowLeft className="h-4 w-4" /> Back to {APP_NAME}</Button></Link>
      </div>
    </div>
  );
}
