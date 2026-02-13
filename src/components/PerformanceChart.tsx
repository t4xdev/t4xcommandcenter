import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getMonthlyData, type ModuleName, moduleColors } from "@/data/kpiData";

interface PerformanceChartProps {
  module: ModuleName;
}

export function PerformanceChart({ module }: PerformanceChartProps) {
  const data = getMonthlyData(module);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Performance Trend</h3>
      <p className="text-xs text-muted-foreground mb-4">{module} — Monthly Overview</p>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${module}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={moduleColors[module]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={moduleColors[module]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} domain={[50, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 22%, 11%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210, 20%, 92%)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Area type="monotone" dataKey="performance" stroke={moduleColors[module]} fill={`url(#grad-${module})`} strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="compliance" stroke="hsl(210, 80%, 55%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            <Area type="monotone" dataKey="efficiency" stroke="hsl(152, 60%, 45%)" fill="transparent" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
