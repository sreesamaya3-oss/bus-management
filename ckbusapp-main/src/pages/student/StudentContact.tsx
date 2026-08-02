import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, MessagesSquare, Phone, MapPin } from 'lucide-react';
import { chatService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/ui/EmptyState';
import { cn, formatTime } from '@/lib/utils';

export default function StudentContact() {
  const qc = useQueryClient();
  const { data: messages } = useQuery({ queryKey: ['chat'], queryFn: chatService.history });
  const send = useMutation({ mutationFn: chatService.send, onSuccess: () => qc.invalidateQueries({ queryKey: ['chat'] }) });
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    send.mutate(text.trim());
    setText('');
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Contact Transport Office" subtitle="Chat directly with the transport office" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex h-[60vh] flex-col p-0">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white"><MessagesSquare className="h-5 w-5" /></div>
              <div><p className="font-semibold">Transport Office</p><p className="text-xs text-success">● Online</p></div>
            </div>
            <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
              {(messages ?? []).map((m) => (
                <div key={m.id} className={cn('flex', m.sender === 'student' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[75%] rounded-2xl px-4 py-2 text-sm', m.sender === 'student' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm')}>
                    <p>{m.text}</p>
                    <p className={cn('mt-1 text-[10px]', m.sender === 'student' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{formatTime(new Date(m.createdAt))}</p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="flex-1" />
              <Button type="submit" size="icon" disabled={send.isPending || !text.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card><CardContent className="space-y-3"><p className="font-semibold">Office Details</p><div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-primary" /> +91 4142 220 100</div><div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> Transport Office, Admin Block, CKCET</div><p className="text-xs text-muted-foreground">Working hours: 07:00 – 18:00, Mon–Sat</p></CardContent></Card>
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30"><CardContent><p className="text-sm font-semibold">Response time</p><p className="mt-1 text-xs text-muted-foreground">Messages are typically answered within 15 minutes during working hours.</p></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
