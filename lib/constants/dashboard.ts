import type { KpiItem, ElevageRow, AlertItem } from "@/lib/types/dashboard"
import type { ForwardRefExoticComponent, RefAttributes } from "react"
import {
  IconLayoutDashboard,
  IconFeather,
  IconPaw,
  IconHeartRateMonitor,
  IconDna,
  IconPackage,
  IconReportAnalytics,
  IconWheat,
  IconBuildingPlus,
  IconHomePlus,
  IconSettings,
  type IconProps,
} from "@tabler/icons-react"

// ─────────────────────────────────────────────────────────────────────────────
// Types de navigation
// ─────────────────────────────────────────────────────────────────────────────

export type TablerIcon = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>

export interface NavChild {
  label: string
  href: string
  icon: TablerIcon
  badge?: string | number
}

export interface NavItem {
  label: string
  href: string
  icon: TablerIcon
  section?: string
  badge?: string | number
  children?: NavChild[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Données du dashboard
// ─────────────────────────────────────────────────────────────────────────────

export const KPIS: KpiItem[] = [
  {
    label:    "Bandes actives",
    value:    "3",
    sub:      "↑ +1 ce mois",
    subColor: "text-green-400",
  },
  {
    label:    "Porcs suivis",
    value:    "47",
    sub:      "12 reproductrices",
    subColor: "text-white/30",
  },
  {
    label:      "Mortalité moy.",
    value:      "1.2%",
    sub:        "seuil alerte : 3%",
    subColor:   "text-white/30",
    valueColor: "text-green-400",
  },
  {
    label:      "Mises bas prévues",
    value:      "3",
    sub:        "dans 7 jours",
    subColor:   "text-amber-400",
    valueColor: "text-amber-400",
  },
]

export const ELEVAGES: ElevageRow[] = [
  {
    id:          "1",
    reference:   "BAND-2025-012",
    espece:      "Poulet Cobb 500",
    mode:        "LOT",
    statut:      "ACTIVE",
    infoKey:     "5 200 · J+38",
    progression: 60,
  },
  {
    id:          "2",
    reference:   "TRUIE-2025-047",
    espece:      "Porc Large White",
    mode:        "INDIVIDUEL",
    statut:      "GESTANTE",
    infoKey:     "MB : 07/07 · J+82",
    progression: 72,
  },
  {
    id:          "3",
    reference:   "BAND-2025-011",
    espece:      "Poulet Cobb 500",
    mode:        "LOT",
    statut:      "CLOTURE_PROCHE",
    infoKey:     "4 800 · J+55",
    progression: 87,
  },
  {
    id:          "4",
    reference:   "LAPIN-2025-012",
    espece:      "Lapin NZ Blanc",
    mode:        "INDIVIDUEL",
    statut:      "ALLAITANTE",
    infoKey:     "8 lapereaux · J+12",
    progression: 40,
  },
]

export const ALERTS: AlertItem[] = [
  { id: "1", message: "Stock aliment bas — Aliment Démarrage < seuil" },
  { id: "2", message: "Pesée hebdomadaire due — BAND-2025-012" },
]

// ─────────────────────────────────────────────────────────────────────────────
// Navigation principale (Sidebar)
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  // ── PRINCIPAL ──────────────────────────────────────────────────────────
  { section: "PRINCIPAL",  label: "Tableau de bord",     href: "/dashboard",         icon: IconLayoutDashboard },
  {                        label: "Bandes",              href: "/bandes",            icon: IconFeather },
  {                        label: "Bâtiments",           href: "/batiments",         icon: IconHomePlus },
  {                        label: "Animaux",             href: "/animaux",           icon: IconPaw },
  {                        label: "Santé",               href: "/sante",             icon: IconHeartRateMonitor },
  {                        label: "Reproduction",        href: "/reproduction",      icon: IconDna },

  // ── GÉRER ──────────────────────────────────────────────────────────────
  { section: "GÉRER",      label: "Stocks",              href: "/stock",             icon: IconPackage },
  {                        label: "Alimentation",        href: "/alimentation",      icon: IconWheat },
  {                        label: "Rapports",            href: "/apports",           icon: IconReportAnalytics },

  // ── CONFIGURER ─────────────────────────────────────────────────────────
  { section: "CONFIGURER", label: "Ajouter une ferme",   href: "/fermes/nouveau",    icon: IconBuildingPlus },
  {                        label: "Ajouter un bâtiment", href: "/batiments/nouveau", icon: IconHomePlus },
  {                        label: "Paramètres",          href: "/parametres",        icon: IconSettings },
]

// ─────────────────────────────────────────────────────────────────────────────
// Styles centralisés
// ─────────────────────────────────────────────────────────────────────────────

export const STATUT_STYLES: Record<string, { label: string; className: string }> = {
  ACTIVE:         { label: "Active",         className: "bg-green-400/10  text-green-300" },
  GESTANTE:       { label: "Gestante",       className: "bg-amber-400/10  text-amber-300" },
  ALLAITANTE:     { label: "Allaitante",     className: "bg-green-400/10  text-green-300" },
  CLOTURE_PROCHE: { label: "Clôture proche", className: "bg-white/8       text-white/40"  },
  CLOTUREE:       { label: "Clôturée",       className: "bg-white/5       text-white/30"  },
}

export const MODE_STYLES: Record<string, { className: string }> = {
  LOT:        { className: "bg-blue-400/10    text-blue-300"   },
  INDIVIDUEL: { className: "bg-violet-400/10  text-violet-300" },
}

export const PROG_COLOR: Record<string, string> = {
  ACTIVE:         "bg-green-400",
  ALLAITANTE:     "bg-green-400",
  GESTANTE:       "bg-amber-400",
  CLOTURE_PROCHE: "bg-white/30",
  CLOTUREE:       "bg-white/10",
}