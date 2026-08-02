import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export function WeatherCard() {
  return (
    <Card className="overflow-hidden">
      <div className="relative bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent">
        <CardContent className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cuddalore</p>
              <p className="font-display text-3xl font-bold">28°C</p>
              <p className="text-sm text-muted-foreground">Partly cloudy</p>
            </div>
            <div className="relative">
              <Sun className="h-14 w-14 text-warning" />
              <Cloud className="absolute -right-2 -top-1 h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-muted/50 p-2"><Wind className="mx-auto mb-1 h-4 w-4 text-muted-foreground" /><p className="text-muted-foreground">Wind</p><p className="font-semibold">12 km/h</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><CloudRain className="mx-auto mb-1 h-4 w-4 text-secondary" /><p className="text-muted-foreground">Rain</p><p className="font-semibold">20%</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><Cloud className="mx-auto mb-1 h-4 w-4 text-muted-foreground" /><p className="text-muted-foreground">Humidity</p><p className="font-semibold">68%</p></div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
