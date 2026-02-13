import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ModuleSummaryCard } from "@/components/ModuleSummaryCard";
import { KpiCard } from "@/components/KpiCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { StatusDistributionChart } from "@/components/StatusDistributionChart";
import { KpiTable } from "@/components/KpiTable";
import { modules, getModuleKPIs, type ModuleName } from "@/data/kpiData";

const Index = () => {
  const [activeModule, setActiveModule] = useState<ModuleName>("Documents");
  const kpis = getModuleKPIs(activeModule);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Module Selector */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod) => (
              <ModuleSummaryCard
                key={mod}
                module={mod}
                active={activeModule === mod}
                onClick={() => setActiveModule(mod)}
              />
            ))}
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PerformanceChart module={activeModule} />
          <StatusDistributionChart module={activeModule} />
        </section>

        {/* KPI Cards Grid */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-4">
            {activeModule} — Feature KPIs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </section>

        {/* Detailed Table */}
        <section>
          <KpiTable module={activeModule} />
        </section>
      </main>
    </div>
  );
};

export default Index;
