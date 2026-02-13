import { FileText, BarChart3, ShoppingCart, Wrench, LucideIcon } from "lucide-react";
import { getModuleSummary, type ModuleName } from "@/data/kpiData";

const icons: Record<ModuleName, LucideIcon> = {
  Documents: FileText,
  Reports: BarChart3,
  Procurement: ShoppingCart,
  Maintenance: Wrench,
};

interface ModuleSummaryCardProps {
  module: ModuleName;
  active: boolean;
  onClick: () => void;
}

export function ModuleSummaryCard({ module, active, onClick }: ModuleSummaryCardProps) {
  const summary = getModuleSummary(module);
  const Icon = icons[module];

  return (
    <button
      onClick={onClick}
      className={`glass-card p-5 text-left transition-all duration-300 w-full group ${
        active ? "glow-border ring-1 ring-primary/30" : "hover:border-primary/20"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${active ? "bg-primary/20" : "bg-muted"} transition-colors`}>
          <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"} transition-colors`} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{module}</h3>
          <p className="text-xs text-muted-foreground">{summary.total} features</p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gradient font-mono">{summary.avg}%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">avg performance</p>
        </div>
        <div className="flex gap-1.5">
          <div className="text-center">
            <div className="text-xs font-mono font-semibold text-success">{summary.good}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-success mx-auto mt-0.5" />
          </div>
          <div className="text-center">
            <div className="text-xs font-mono font-semibold text-warning">{summary.warning}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-warning mx-auto mt-0.5" />
          </div>
          <div className="text-center">
            <div className="text-xs font-mono font-semibold text-destructive">{summary.critical}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-destructive mx-auto mt-0.5" />
          </div>
        </div>
      </div>
    </button>
  );
}
