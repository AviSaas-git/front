import { DASHBOARD_KPIS, RECENT_BANDES } from "@/lib/constants/landing"
import { FakeChart } from "./FakeChart"

export function DashboardPreview() {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden mx-4 sm:mx-8 mb-20">
      {/* Barre navigateur */}
      <div className="flex items-center gap-2 bg-white/[0.04] border-b border-white/[0.06] px-4 py-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28ca42]" />
        <div className="flex-1 bg-white/5 rounded-md h-5 mx-2 flex items-center px-3">
          <span className="text-[10px] text-white/25">app.avisaas.com/dashboard</span>
        </div>
      </div>

      {/* Corps du dashboard */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden sm:block w-40 border-r border-white/[0.06] p-3 shrink-0">
          <p className="text-[9px] text-white/25 font-medium mb-2 px-2">NAVIGATION</p>
          {["Tableau de bord", "Bandes", "Animaux", "Santé", "Reproduction", "Stocks"].map(
            (item, i) => (
              <div
                key={item}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg mb-0.5 ${
                  i === 0
                    ? "text-green-400 bg-green-400/10"
                    : "text-white/35"
                }`}
              >
                {item}
              </div>
            )
          )}
        </aside>

        {/* Contenu */}
        <div className="flex-1 p-4 min-w-0">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {DASHBOARD_KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3"
              >
                <p className="text-[10px] text-white/35 mb-1">{kpi.label}</p>
                <p className={`text-lg font-medium ${kpi.valueColor ?? "text-white"}`}>
                  {kpi.value}
                </p>
                <p className={`text-[10px] mt-0.5 ${kpi.subColor}`}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Graphique + liste */}
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <FakeChart />
            </div>
            <div className="col-span-2 bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
              <p className="text-[10px] text-white/40 mb-2">Bandes récentes</p>
              {RECENT_BANDES.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0"
                >
                  <span className="text-[11px] text-white/70">{b.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${b.statusClass}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}