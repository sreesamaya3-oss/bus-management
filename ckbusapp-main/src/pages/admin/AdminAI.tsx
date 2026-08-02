import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, MessageSquareText, Send } from 'lucide-react';
import { analyticsService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { AISummaryCard } from '@/components/shared/AISummaryCard';
import { SectionHeader } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const sevMap = {
  high: { icon: AlertTriangle, tone: 'border-destructive/40 bg-destructive/5' },
  medium: { icon: TrendingUp, tone: 'border-warning/40 bg-warning/5' },
  low: { icon: Lightbulb, tone: 'border-success/40 bg-success/5' },
};

export default function AdminAI() {
  const { data: insights } = useQuery({ queryKey: ['ai-insights'], queryFn: analyticsService.aiInsights });
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your AI transport assistant. Ask me about routes, attendance trends, or delays.' },
  ]);
  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setConversation((c) => [...c, { role: 'user', text: prompt }, { role: 'ai', text: 'Based on current data, Route B has the highest delay rate (22%) and Saturday attendance is down 38%. I recommend reviewing the weekend schedule and shifting Route B pickup 8 minutes earlier.' }]);
    setPrompt('');
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Insights" subtitle="AI-powered recommendations and predictions" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"><CardContent><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><p className="font-semibold">Delay Prediction Accuracy</p></div><p className="mt-2 font-display text-3xl font-bold">92%</p><p className="text-xs text-muted-foreground">Model confidence this week</p></CardContent></Card>
        <Card><CardContent><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-secondary" /><p className="font-semibold">Predicted On-time</p></div><p className="mt-2 font-display text-3xl font-bold">84%</p><p className="text-xs text-muted-foreground">For tomorrow trips</p></CardContent></Card>
        <Card><CardContent><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /><p className="font-semibold">Risk Alerts</p></div><p className="mt-2 font-display text-3xl font-bold">3</p><p className="text-xs text-muted-foreground">Routes needing attention</p></CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHeader title="Weekly Insights" />
          {insights?.map((i) => {
            const { icon: Icon, tone } = sevMap[i.severity];
            return (
              <Card key={i.id} className={cn(tone)}>
                <CardContent className="flex items-start gap-3">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', i.severity === 'high' ? 'bg-destructive/15 text-destructive' : i.severity === 'medium' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success')}><Icon className="h-5 w-5" /></div>
                  <div className="flex-1"><div className="flex items-center justify-between"><p className="font-semibold">{i.title}</p><Badge tone={i.severity === 'high' ? 'destructive' : i.severity === 'medium' ? 'warning' : 'success'} className="capitalize">{i.severity}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{i.insight}</p></div>
                </CardContent>
              </Card>
            );
          })}
          <AISummaryCard severity="low" message="Overall fleet health is good. 1 route needs schedule optimization and weekend demand should be reassessed." />
        </div>
        <Card className="flex h-[480px] flex-col">
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquareText className="h-4 w-4" /> AI Travel Assistant</CardTitle><CardDescription>Ask about routes, delays, attendance</CardDescription></CardHeader>
          <CardContent className="flex flex-1 flex-col p-0">
            <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
              {conversation.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[80%] rounded-2xl px-3 py-2 text-sm', m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>{m.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={ask} className="flex items-center gap-2 border-t border-border p-3"><Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask the AI assistant…" rows={1} className="flex-1 resize-none" /><Button type="submit" size="icon"><Send className="h-4 w-4" /></Button></form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
