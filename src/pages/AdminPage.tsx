import { useState } from "react";
import { Settings, ToggleLeft, ToggleRight, Edit, Save } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { adminIntents, type AdminIntent } from "@/data/dashboardData";

export default function AdminPage() {
  const [intents, setIntents] = useState<AdminIntent[]>(adminIntents);

  const toggleIntent = (id: string) => {
    setIntents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i))
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="Admin Configuration" subtitle="Manage predefined chat intents and thresholds" />

      <div className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-elevated p-5">
            <p className="text-xs text-muted-foreground mb-1">Total Intents</p>
            <p className="text-2xl font-bold text-foreground font-mono">{intents.length}</p>
          </div>
          <div className="card-elevated p-5">
            <p className="text-xs text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-success font-mono">{intents.filter((i) => i.enabled).length}</p>
          </div>
          <div className="card-elevated p-5">
            <p className="text-xs text-muted-foreground mb-1">Disabled</p>
            <p className="text-2xl font-bold text-destructive font-mono">{intents.filter((i) => !i.enabled).length}</p>
          </div>
        </div>

        {/* Intent Table */}
        <div className="card-elevated overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Predefined Chat Intents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/30">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Question</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Insight ID</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Threshold</th>
                  <th className="text-center px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {intents.map((intent) => (
                  <tr key={intent.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleIntent(intent.id)}
                        className="transition-colors"
                      >
                        {intent.enabled ? (
                          <ToggleRight className="w-6 h-6 text-success" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{intent.question}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent text-accent-foreground">
                        {intent.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{intent.insightId}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{intent.threshold || "—"}</td>
                    <td className="px-5 py-3 text-center">
                      <button className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
