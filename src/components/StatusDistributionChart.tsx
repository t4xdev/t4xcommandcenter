import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getModuleKPIs, type ModuleName } from "@/data/kpiData";

interface StatusDistributionChartProps {
  module: ModuleName;
}

export function StatusDistributionChart({ module }: StatusDistributionChartProps) {
  const kpis = getModuleKPIs(module);
  const data = kpis.map((k) => ({
    name: k.feature.length > 16 ? k.feature.slice(0, 16) + "…" : k.feature,
    value: k.value,
    status: k.status,
  }));

  const barColor = (status: string) => {
    if (status === "good") return "hsl(152, 60%, 45%)";
    if (status === "warning") return "hsl(38, 92%, 55%)";
    return "hsl(0, 72%, 55%)";
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Feature Health</h3>
      <p className="text-xs text-muted-foreground mb-4">{module} — KPI Scores</p>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} width={110} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 22%, 11%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210, 20%, 92%)",
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
              {data.map((entry, index) => (
                <Cell key={index} fill={barColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
