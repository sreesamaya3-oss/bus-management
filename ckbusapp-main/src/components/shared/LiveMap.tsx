import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bus as BusIcon, MapPin, Gauge, Clock, Navigation } from 'lucide-react';
import type { Stop } from '@/lib/types';
import { GPS_SIM_NOTE } from '@/lib/constants';
import { cn, formatTime } from '@/lib/utils';

function normalize(points: { x: number; y: number }[], size: number, pad = 40) {
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const scale = (size - pad * 2) / span;
  return points.map((p) => ({
    x: pad + (p.x - minX) * scale + ((size - pad * 2 - (maxX - minX) * scale) / 2),
    y: pad + (p.y - minY) * scale + ((size - pad * 2 - (maxY - minY) * scale) / 2),
  }));
}

export function LiveMap({ stops, progress, speed = 0, lastUpdated, className }: { stops: Stop[]; progress: number; speed?: number; lastUpdated?: string; className?: string }) {
  const [tick, setTick] = useState(0);
  const [simSpeed, setSimSpeed] = useState(speed);
  useEffect(() => {
    const t = setInterval(() => {
      setTick((x) => x + 1);
      setSimSpeed((s) => {
        const variance = (Math.random() - 0.5) * 8;
        return Math.max(0, Math.round((s || speed || 28) + variance));
      });
    }, 1500);
    return () => clearInterval(t);
  }, [speed]);

  const size = 360;
  const pts = normalize(stops.map((s) => ({ x: s.lng, y: s.lat })), size);
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const totalSegments = Math.max(pts.length - 1, 1);
  const segProgress = (progress / 100) * totalSegments;
  const segIndex = Math.min(Math.floor(segProgress), totalSegments - 1);
  const segFrac = segProgress - segIndex;
  const cur = pts[segIndex] ?? { x: 0, y: 0 };
  const nxt = pts[segIndex + 1] ?? cur;
  const busX = cur.x + (nxt.x - cur.x) * segFrac;
  const busY = cur.y + (nxt.y - cur.y) * segFrac;
  const lastTime = lastUpdated ? formatTime(new Date(lastUpdated)) : formatTime(new Date());

  return (
    <div className={cn('relative w-full overflow-hidden rounded-xl border border-border bg-muted/40', className)}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
        <rect width={size} height={size} fill="url(#grid)" />
        <path d={pathD} fill="none" stroke="hsl(var(--border))" strokeWidth="3" strokeDasharray="4 4" />
        <motion.path d={pathD} fill="none" stroke="url(#routeGrad)" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress / 100 }} transition={{ duration: 1, ease: 'easeOut' }} />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-current text-[9px] font-medium" fill="hsl(var(--foreground))">
              {stops[i].name.length > 16 ? stops[i].name.slice(0, 14) + '…' : stops[i].name}
            </text>
          </g>
        ))}
        <g style={{ transform: `translate(${busX}px, ${busY}px)` }}>
          <circle r="14" fill="hsl(var(--primary) / 0.2)">
            <animate attributeName="r" values="14;22;14" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle r="11" fill="hsl(var(--primary))" />
          <foreignObject x="-7" y="-7" width="14" height="14">
            <div style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <BusIcon style={{ width: 9, height: 9 }} />
            </div>
          </foreignObject>
        </g>
      </svg>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur">
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> Simulated live map</span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 flex flex-col gap-1">
        <div className="rounded-lg bg-card/80 px-2.5 py-1 text-xs backdrop-blur"><span className="flex items-center gap-1"><Gauge className="h-3 w-3 text-secondary" /> {simSpeed} km/h</span></div>
        <div className="rounded-lg bg-card/80 px-2.5 py-1 text-xs backdrop-blur"><span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> {lastTime}</span></div>
      </div>
      <span className="sr-only">Live map tick {tick}</span>
      <div className="border-t border-border/60 bg-muted/30 px-3 py-1.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Navigation className="h-2.5 w-2.5" /> {GPS_SIM_NOTE}</span>
      </div>
    </div>
  );
}
