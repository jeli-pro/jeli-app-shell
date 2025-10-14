import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  chartData?: number[];
}

export function StatCard({ title, value, change, trend, icon, chartData }: StatCardProps) {
  const chartRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    // Only run animation if chartData is present
    if (chartRef.current && chartData) {
      const line = chartRef.current.querySelector('.chart-line');
      const area = chartRef.current.querySelector('.chart-area');
      if (line instanceof SVGPathElement && area) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' });
        gsap.fromTo(area, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 });
      }
    }
  }, [chartData]);

  // --- Chart rendering logic (only if chartData is provided) ---
  const renderChart = () => {
    if (!chartData || chartData.length < 2) return null;

    // SVG dimensions
    const width = 150;
    const height = 60;

    // Normalize data
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min === 0 ? 1 : max - min;

    const points = chartData
      .map((val, i) => {
        const x = (i / (chartData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 10) + 5; // Add vertical padding
        return `${x},${y}`;
      });

    const linePath = "M" + points.join(" L");
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return (
      <div className="mt-4 -mb-2 -mx-2">
        <svg ref={chartRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="text-primary" stopColor="currentColor" stopOpacity={0.3} />
              <stop offset="100%" className="text-primary" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            className="chart-area"
            d={areaPath}
            fill="url(#chartGradient)"
          />
          <path
            className="chart-line"
            d={linePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };
  // --- End of chart rendering logic ---

  return (
    <Card className={cn(
        "p-6 border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between",
        !chartData && "h-full" // Ensure cards without charts have consistent height if needed
    )}>
      <div>
        <div className="flex items-center justify-between">
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div className={cn(
            "text-sm font-medium",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {change}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>
      </div>
      {renderChart()}
    </Card>
  );
}