"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchPonteDashboard, fetchCollectes, fetchVentes,
  createCollecte, createVente, fetchPrixReference
} from "@/lib/api/ponte"
import { FormField } from "@/components/ui/FormField"
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts"


import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"


const today = new Date().toISOString().split("T")[0]
const CALIBRES = ["PETIT","MOYEN","GROS","SUPER_GROS"]
const CALIBRE_LABELS: Record<string, string> = {
  PETIT: "Petit (<53g)", MOYEN: "Moyen (53-63g)",
  GROS: "Gros (63-73g)", SUPER_GROS: "Super-gros (>73g)"
}
const CALIBRE_COLORS: Record<string, string> = {
  PETIT: "#94a3b8", MOYEN: "#60a5fa", GROS: "#4ade80", SUPER_GROS: "#fbbf24"
}

function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

type Tab = "dashboard" | "collecte" | "vente" | "stock" | "historique"

type Props = { bandeId: string }

export function PontePanel({ bandeId }: Props) {
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>("dashboard")

  const { data: dashboard } = useQuery({
    queryKey: ["ponte-dashboard", bandeId],
    queryFn: () => fetchPonteDashboard(bandeId),
  })
  const { data: collectes = [] } = useQuery({
    queryKey: ["collectes", bandeId],
    queryFn: () => fetchCollectes(bandeId),
    enabled: tab === "historique",
  })
  const { data: ventes = [] } = useQuery({
    queryKey: ["ventes-oeufs", bandeId],
    queryFn: () => fetchVentes(bandeId),
    enabled: tab === "historique",
  })
  const { data: prixRef = {} } = useQuery({
    queryKey: ["prix-reference"],
    queryFn: fetchPrixReference,
    enabled: tab === "vente",
  })

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["ponte-dashboard", bandeId] })
    qc.invalidateQueries({ queryKey: ["collectes", bandeId] })
    qc.invalidateQueries({ queryKey: ["ventes-oeufs", bandeId] })
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "dashboard",  label: "📊 Vue d'ensemble" },
    { key: "collecte",   label: "🥚 Saisir collecte" },
    { key: "vente",      label: "💰 Vendre" },
    { key: "stock",      label: "📦 Stock" },
    { key: "historique", label: "📋 Historique" },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Onglets */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-white/[0.07]">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap
                        border-b-2 transition-colors
                        ${tab === t.key
                          ? "text-amber-400 border-amber-400"
                          : "text-white/40 border-transparent hover:text-white/60"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && dashboard && (
        <PonteDashboardView dashboard={dashboard} />
      )}
      {tab === "collecte" && (
        <CollecteForm bandeId={bandeId} onSuccess={invalidate} />
      )}
      {tab === "vente" && (
        <VenteForm bandeId={bandeId} prixRef={prixRef}
          stock={dashboard?.stockActuel} onSuccess={invalidate} />
      )}
      {tab === "stock" && dashboard?.stockActuel && (
        <StockView stock={dashboard.stockActuel} />
      )}
      {tab === "historique" && (
        <HistoriqueView collectes={collectes} ventes={ventes} />
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────
function PonteDashboardView({ dashboard }: { dashboard: any }) {
  const p = dashboard
  const tauxColor = p.tauxPonteMoyen >= 80 ? "text-green-400"
                  : p.tauxPonteMoyen >= 70 ? "text-amber-400" : "text-rose-400"

  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { l: "Taux de ponte (7j)", v: `${p.tauxPonteMoyen.toFixed(1)}%`, c: tauxColor },
          { l: "Taux de casse",      v: `${p.tauxCasseMoyen.toFixed(1)}%`,
            c: p.tauxCasseMoyen > 3 ? "text-amber-400" : "text-green-400" },
          { l: "Total produits",     v: p.totalOeufsProduitsTotal.toLocaleString(), c: "text-white" },
          { l: "Recettes totales",   v: fcfa(p.recettesTotales), c: "text-green-400" },
        ].map((k) => (
          <div key={k.l} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[10px] text-white/40 mb-1.5">{k.l}</p>
            <p className={`text-xl font-medium ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>

      {/* Ponte du jour */}
      {p.ponteAujourdhui ? (
        <div className="bg-green-400/[0.04] border border-green-400/15 rounded-xl p-4">
          <p className="text-xs text-green-300 font-medium mb-2">
            ✓ Collecte du jour — {p.ponteAujourdhui.totalCommercialisables} œufs commercialisables
          </p>
          <div className="grid grid-cols-4 gap-2">
            {["oeufsPetit","oeufsMovyen","oeufsGros","oeufsSupGros"].map((f, i) => (
              <div key={f} className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
                <p className="text-[10px] text-white/30">
                  {["Petit","Moyen","Gros","S.Gros"][i]}
                </p>
                <p className="text-sm font-medium text-white">
                  {p.ponteAujourdhui[f]}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/30 mt-2">
            {p.ponteAujourdhui.conditionnement.cartonsPossibles} cartons +{" "}
            {p.ponteAujourdhui.conditionnement.alveolesRestantes} alvéoles
          </p>
        </div>
      ) : (
        <div className="bg-amber-400/[0.06] border border-amber-400/15 rounded-xl p-4
                        flex items-center justify-between">
          <p className="text-xs text-amber-300">
            ⚠ Collecte du jour non encore saisie
          </p>
          <span className="text-[10px] text-amber-400/60">
            {new Date().toLocaleDateString("fr-FR")}
          </span>
        </div>
      )}

      {/* Courbe 30j */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white mb-1">Courbe de ponte — 30 jours</h2>
        <p className="text-xs text-white/40 mb-4">Taux de ponte (%)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={p.courbe30j}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" fontSize={10} stroke="rgba(255,255,255,0.3)"
              tickFormatter={(d) => new Date(d).toLocaleDateString("fr-FR",
                { day:"2-digit", month:"2-digit" })} />
            <YAxis domain={[0, 100]} fontSize={10} stroke="rgba(255,255,255,0.3)"
              tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background:"#18181b", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:8, fontSize:11 }}
              formatter={(v: any) => [`${Number(v).toFixed(1)}%`, "Taux de ponte"]} />
            <Line type="monotone" dataKey="tauxPonte" stroke="#4ade80"
              strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Répartition calibres */}
      {Object.keys(p.repartitionCalibresPct).length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">
            Répartition calibres — 30 jours
          </h2>
          <div className="flex flex-col gap-2.5">
            {Object.entries(p.repartitionCalibresPct).map(([cal, pct]: any) => (
              <div key={cal}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-white/70">
                    {CALIBRE_LABELS[cal] ?? cal}
                  </span>
                  <span className="text-xs text-white/50">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width:`${pct}%`, background: CALIBRE_COLORS[cal] ?? "#6b7280" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Formulaire collecte ───────────────────────────────────────────────
function CollecteForm({ bandeId, onSuccess }: { bandeId: string; onSuccess: () => void }) {
  const [form, setForm] = useState({
    date: today, oeufsPetit: "", oeufsMovyen: "", oeufsGros: "",
    oeufsSupGros: "", oeufsCasses: "0", oeufsDeclasses: "0", observations: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState<any>(null)

  function h(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })) }

  const total = ["oeufsPetit","oeufsMovyen","oeufsGros","oeufsSupGros","oeufsCasses","oeufsDeclasses"]
    .reduce((s, k) => s + (Number((form as any)[k]) || 0), 0)
  const commercialisables = ["oeufsPetit","oeufsMovyen","oeufsGros","oeufsSupGros"]
    .reduce((s, k) => s + (Number((form as any)[k]) || 0), 0)
  const totalAlv = Math.floor(commercialisables / 30)
  const cartons  = Math.floor(totalAlv / 12)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("")
    if (total === 0) { setError("Saisissez au moins un œuf"); return }
    setLoading(true)
    try {
      const res = await createCollecte(bandeId, {
        date: form.date,
        oeufsPetit: Number(form.oeufsPetit) || 0,
        oeufsMovyen: Number(form.oeufsMovyen) || 0,
        oeufsGros: Number(form.oeufsGros) || 0,
        oeufsSupGros: Number(form.oeufsSupGros) || 0,
        oeufsCasses: Number(form.oeufsCasses) || 0,
        oeufsDeclasses: Number(form.oeufsDeclasses) || 0,
        observations: form.observations || undefined,
      })

      toastSuccess(
        `Collecte enregistrée — ${res.totalCommercialisables} œufs · ` +
        `${res.conditionnement.cartonsPossibles} cartons · ` +
        `Taux : ${res.tauxPonte.toFixed(1)}%`
      )
      setSuccess(res); onSuccess()
      setForm({ date: today, oeufsPetit: "", oeufsMovyen: "", oeufsGros: "",
                oeufsSupGros: "", oeufsCasses: "0", oeufsDeclasses: "0", observations: "" })
    } catch (err: any) {
  toastError(traduireErreur(err))}
    finally { setLoading(false) }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Collecte du jour</h2>
      <p className="text-xs text-white/40 mb-4">
        Saisissez les œufs ramassés par calibre.
        Le conditionnement est calculé automatiquement.
      </p>

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4 mb-4">
          <p className="text-xs text-green-300 font-medium mb-2">
            ✓ Collecte enregistrée — {success.totalCommercialisables} œufs
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-lg font-medium text-white">{success.conditionnement.totalAlveoles}</p>
              <p className="text-[10px] text-white/40">alvéoles</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-lg font-medium text-white">{success.conditionnement.cartonsPossibles}</p>
              <p className="text-[10px] text-white/40">cartons</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-lg font-medium text-amber-400">
                {success.tauxPonte.toFixed(1)}%
              </p>
              <p className="text-[10px] text-white/40">taux ponte</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField label="Date de collecte" type="date" value={form.date}
          onChange={(e) => h("date", e.target.value)} />

        <p className="text-[10px] text-white/30 font-medium tracking-widest mt-1">
          CALIBRES COMMERCIALISABLES
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["oeufsPetit",  "🥚 Petit (<53g)"],
            ["oeufsMovyen", "🥚 Moyen (53-63g)"],
            ["oeufsGros",   "🥚 Gros (63-73g)"],
            ["oeufsSupGros","🥚 Super-gros (>73g)"],
          ].map(([f, l]) => (
            <FormField key={f} label={l} type="number" placeholder="0"
              value={(form as any)[f]}
              onChange={(e) => h(f, e.target.value)} />
          ))}
        </div>

        <p className="text-[10px] text-white/30 font-medium tracking-widest mt-1">
          NON COMMERCIALISABLES
        </p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="💔 Cassés" type="number" placeholder="0"
            value={form.oeufsCasses}
            onChange={(e) => h("oeufsCasses", e.target.value)} />
          <FormField label="⚠ Déclassés" type="number" hint="fêlés, tachés" placeholder="0"
            value={form.oeufsDeclasses}
            onChange={(e) => h("oeufsDeclasses", e.target.value)} />
        </div>

        {/* Preview conditionnement */}
        {commercialisables > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-lg p-3">
            <p className="text-[10px] text-white/40 mb-2">Conditionnement calculé</p>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-lg font-medium text-white">{commercialisables}</p>
                <p className="text-[10px] text-white/30">œufs</p>
              </div>
              <div className="text-white/20 self-center">→</div>
              <div>
                <p className="text-lg font-medium text-white">{totalAlv}</p>
                <p className="text-[10px] text-white/30">alvéoles</p>
              </div>
              <div className="text-white/20 self-center">→</div>
              <div>
                <p className="text-lg font-medium text-green-400">{cartons}</p>
                <p className="text-[10px] text-white/30">cartons</p>
              </div>
              <div>
                <p className="text-lg font-medium text-white/50">{totalAlv % 12}</p>
                <p className="text-[10px] text-white/30">alv. reste</p>
              </div>
            </div>
          </div>
        )}

        <FormField label="Observations" hint="optionnel" value={form.observations}
          onChange={(e) => h("observations", e.target.value)} />
        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40
                     text-amber-950 font-medium rounded-xl text-sm mt-1">
          {loading ? "Enregistrement…" : "Enregistrer la collecte →"}
        </button>
      </form>
    </div>
  )
}

// ── Formulaire vente ──────────────────────────────────────────────────
function VenteForm({ bandeId, prixRef, stock, onSuccess }: any) {
  const [form, setForm] = useState({
    date: today, client: "", telephone: "", observations: "",
  })
  const [lignes, setLignes] = useState<any[]>([
    { calibre: "GROS", nombreOeufs: "", prixAlveole: "" }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState<any>(null)

  function h(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })) }

  function updateLigne(i: number, field: string, value: string) {
    setLignes((p) => {
      const n = [...p]
      n[i] = { ...n[i], [field]: value }
      if (field === "calibre" && prixRef[value]) {
        n[i].prixAlveole = String(prixRef[value])
      }
      return n
    })
  }

  function addLigne() {
    setLignes((p) => [...p, { calibre: "MOYEN", nombreOeufs: "", prixAlveole: "" }])
  }

  const totalMontant = lignes.reduce((s, l) => {
    const alv = (Number(l.nombreOeufs) || 0) / 30
    return s + alv * (Number(l.prixAlveole) || 0)
  }, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const lignesValides = lignes.filter(l => l.nombreOeufs && l.prixAlveole)
    if (!lignesValides.length) { setError("Ajoutez au moins une ligne"); return }

    setLoading(true)
    try {
      const res = await createVente(bandeId, {
        date: form.date, client: form.client || undefined,
        telephone: form.telephone || undefined,
        observations: form.observations || undefined,
        lignes: lignesValides.map(l => ({
          calibre: l.calibre,
          nombreOeufs: Number(l.nombreOeufs),
          prixAlveole: Number(l.prixAlveole),
        })),
      })
      setSuccess(res); onSuccess()

      toastSuccess(`Vente enregistrée — Total : ${fcfa(res.montantTotal)}`)
      setLignes([{ calibre: "GROS", nombreOeufs: "", prixAlveole: "" }])
      setForm({ date: today, client: "", telephone: "", observations: "" })
    } catch (err: any) {
        toastError(traduireErreur(err))}
    finally { setLoading(false) }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Enregistrer une vente</h2>
      <p className="text-xs text-white/40 mb-4">
        Les prix sont pré-remplis depuis vos prix de référence.
      </p>

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                        px-4 py-3 mb-4 flex justify-between">
          <p className="text-xs text-green-300">✓ Vente enregistrée</p>
          <p className="text-xs text-green-300 font-medium">{fcfa(success.montantTotal)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date" type="date" value={form.date}
            onChange={(e) => h("date", e.target.value)} />
          <FormField label="Client" hint="optionnel" value={form.client}
            onChange={(e) => h("client", e.target.value)} />
        </div>

        {/* Lignes de vente */}
        <div>
          <p className="text-[10px] text-white/30 font-medium tracking-widest mb-2">
            DÉTAIL DE LA VENTE
          </p>
          <div className="flex flex-col gap-2">
            {lignes.map((l, i) => {
              const alv = Math.floor((Number(l.nombreOeufs) || 0) / 30)
              const montant = alv * (Number(l.prixAlveole) || 0)
              const dispo = stock?.parCalibre?.[l.calibre]?.quantite ?? null
              return (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06]
                                         rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormField as="select" label={i === 0 ? "Calibre" : ""}
                        options={CALIBRES.map(c => ({ value: c, label: CALIBRE_LABELS[c] }))}
                        value={l.calibre}
                        onChange={(e) => updateLigne(i, "calibre", e.target.value)} />
                    </div>
                    <div className="w-28">
                      <FormField label={i === 0 ? "Nb œufs" : ""} type="number"
                        placeholder="Ex: 360" value={l.nombreOeufs}
                        onChange={(e) => updateLigne(i, "nombreOeufs", e.target.value)} />
                    </div>
                    <div className="w-28">
                      <FormField label={i === 0 ? "Prix/alv." : ""} type="number"
                        placeholder="FCFA" value={l.prixAlveole}
                        onChange={(e) => updateLigne(i, "prixAlveole", e.target.value)} />
                    </div>
                    {lignes.length > 1 && (
                      <button type="button"
                        onClick={() => setLignes(p => p.filter((_, j) => j !== i))}
                        className="text-white/30 hover:text-red-400 mt-5 text-lg">
                        ×
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/30">
                      {alv} alvéole{alv > 1 ? "s" : ""}
                      {dispo !== null && ` · stock dispo : ${dispo} œufs`}
                    </span>
                    {montant > 0 && (
                      <span className="text-green-400 font-medium">{fcfa(montant)}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <button type="button" onClick={addLigne}
            className="mt-2 w-full py-2 border border-dashed border-white/15
                       text-white/40 hover:text-white/60 rounded-lg text-xs">
            + Autre calibre
          </button>
        </div>

        {totalMontant > 0 && (
          <div className="flex justify-between items-center px-3 py-2
                          bg-green-400/[0.06] border border-green-400/15 rounded-lg">
            <span className="text-xs text-white/60">Total vente</span>
            <span className="text-sm font-medium text-green-400">{fcfa(totalMontant)}</span>
          </div>
        )}

        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                     text-green-950 font-medium rounded-xl text-sm mt-1">
          {loading ? "Enregistrement…" : "Enregistrer la vente →"}
        </button>
      </form>
    </div>
  )
}

// ── Vue stock ─────────────────────────────────────────────────────────
function StockView({ stock }: { stock: any }) {
  return (
    <div className="flex flex-col gap-3">
      {stock.alerteDlc && (
        <div className="bg-amber-400/[0.08] border border-amber-400/20
                        rounded-xl px-4 py-3 text-xs text-amber-300">
          ⚠ Alerte DLC — Certains lots ont plus de 15 jours.
          Vendre en priorité.
        </div>
      )}
      {stock.nombreLotsExpires > 0 && (
        <div className="bg-rose-400/[0.08] border border-rose-400/20
                        rounded-xl px-4 py-3 text-xs text-rose-300">
          ⛔ {stock.nombreLotsExpires} œufs expirés (&gt;21 jours)
          — à retirer du stock.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { l: "Total œufs",    v: stock.totalOeufs.toLocaleString() },
          { l: "Alvéoles",      v: stock.totalAlveoles },
          { l: "Cartons",       v: stock.totalCartons },
        ].map((k) => (
          <div key={k.l} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[10px] text-white/40 mb-1">{k.l}</p>
            <p className="text-xl font-medium text-white">{k.v}</p>
          </div>
        ))}
      </div>

      {Object.entries(stock.parCalibre).map(([cal, detail]: any) => (
        <div key={cal}
          className={`border rounded-xl p-4 ${
            detail.alerteDlc
              ? "bg-amber-400/[0.04] border-amber-400/20"
              : "bg-white/[0.03] border-white/8"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white">
              {CALIBRE_LABELS[cal] ?? cal}
            </p>
            {detail.alerteDlc && (
              <span className="text-[10px] text-amber-400 px-2 py-0.5
                               bg-amber-400/10 rounded-full">⚠ DLC proche</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              ["Œufs", detail.quantite],
              ["Alvéoles", detail.alveoles],
              ["Cartons", detail.cartons],
              ["Âge moy.", `${detail.ageMoyenJours}j`],
            ].map(([l, v]) => (
              <div key={l as string} className="bg-white/5 rounded-lg py-1.5">
                <p className="text-sm font-medium text-white">{v}</p>
                <p className="text-[10px] text-white/30">{l}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(stock.parCalibre).length === 0 && (
        <p className="text-center text-white/30 text-sm py-8">
          Stock vide — enregistrez une collecte pour commencer.
        </p>
      )}
    </div>
  )
}

// ── Historique ────────────────────────────────────────────────────────
function HistoriqueView({ collectes, ventes }: { collectes: any[]; ventes: any[] }) {
  const [onglet, setOnglet] = useState<"collectes"|"ventes">("collectes")

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setOnglet("collectes")}
          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
            onglet === "collectes"
              ? "bg-amber-400/15 text-amber-300"
              : "text-white/40 hover:text-white/60"}`}>
          Collectes ({collectes.length})
        </button>
        <button onClick={() => setOnglet("ventes")}
          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
            onglet === "ventes"
              ? "bg-green-400/15 text-green-300"
              : "text-white/40 hover:text-white/60"}`}>
          Ventes ({ventes.length})
        </button>
      </div>

      {onglet === "collectes" && (
        <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
          {collectes.map((c) => (
            <div key={c.id}
              className="flex items-center justify-between px-3 py-2.5
                         bg-white/[0.02] border border-white/[0.05] rounded-lg">
              <div>
                <p className="text-xs text-white/80">
                  {new Date(c.date).toLocaleDateString("fr-FR")}
                  <span className="text-white/40 ml-2">J+{c.ageEnJours}</span>
                </p>
                <p className="text-[10px] text-white/30">
                  P:{c.oeufsPetit} M:{c.oeufsMovyen} G:{c.oeufsGros} SG:{c.oeufsSupGros}
                  {c.oeufsCasses > 0 && ` · Cassés: ${c.oeufsCasses}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-white/80">
                  {c.totalCommercialisables} œufs
                </p>
                <p className={`text-[10px] ${
                  c.tauxPonte >= 80 ? "text-green-400"
                  : c.tauxPonte >= 70 ? "text-amber-400" : "text-rose-400"}`}>
                  {c.tauxPonte.toFixed(1)}% ponte
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {onglet === "ventes" && (
        <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
          {ventes.map((v) => (
            <div key={v.id}
              className="flex items-center justify-between px-3 py-2.5
                         bg-white/[0.02] border border-white/[0.05] rounded-lg">
              <div>
                <p className="text-xs text-white/80">
                  {new Date(v.date).toLocaleDateString("fr-FR")}
                  {v.client && <span className="text-white/40 ml-2">· {v.client}</span>}
                </p>
                <p className="text-[10px] text-white/30">
                  {v.lignes.map((l: any) =>
                    `${l.nombreAlveoles} alv. ${l.calibre}`).join(" + ")}
                </p>
              </div>
              <p className="text-xs font-medium text-green-400">
                {fcfa(v.montantTotal)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}