import {
  Activity,
  Cpu,
  Dna,
  HeartPulse,
  Package,
  BarChart3,
} from "lucide-react"

export const HERO_STATS = [
  { value: "2 400+", label: "éleveurs actifs" },
  { value: "1.2M",   label: "animaux suivis" },
  { value: "98.7%",  label: "uptime garanti" },
  { value: "-23%",   label: "mortalité moyenne" },
] as const

export const FEATURES = [
  {
    icon: Activity,
    color: "text-green-400",
    bg: "bg-green-400/10",
    title: "Gestion des bandes",
    desc: "Suivi temps réel de l'effectif, mortalité, poids et indice de consommation sur chaque bande.",
  },
  {
    icon: Dna,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    title: "Reproduction & généalogie",
    desc: "Gestion des saillies, gestations, portées et arbre généalogique pour éviter la consanguinité.",
  },
  {
    icon: HeartPulse,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    title: "Suivi sanitaire",
    desc: "Traitements, vaccinations, alertes automatiques et historique vétérinaire par animal.",
  },
  {
    icon: Package,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Gestion des stocks",
    desc: "Aliments, médicaments, seuils d'alerte automatiques et commandes fournisseurs intégrées.",
  },
  {
    icon: BarChart3,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    title: "Analytics & rapports",
    desc: "Tableaux de bord KPIs, rapports PDF automatiques et export Excel par bande ou période.",
  },
  {
    icon: Cpu,
    color: "text-green-400",
    bg: "bg-green-400/10",
    title: "IA agricole",
    desc: "Prédiction de mortalité, recommandations d'alimentation et détection d'anomalies sanitaires.",
    badge: "Bêta",
  },
] as const

export const PRICING_PLANS = [
  {
    name:  "Free",
    price: "0",
    unit:  "FCFA/mois",
    desc:  "Pour découvrir la plateforme",
    featured: false,
    cta:   "Commencer",
    features: [
      { included: true,  text: "1 ferme, 1 bâtiment" },
      { included: true,  text: "Jusqu'à 500 animaux" },
      { included: true,  text: "Tableaux de bord basiques" },
      { included: false, text: "Rapports PDF" },
      { included: false, text: "IA agricole" },
    ],
  },
  {
    name:  "Pro",
    price: "15 000",
    unit:  "FCFA/mois",
    desc:  "Pour les élevages en croissance",
    featured: true,
    cta:   "Démarrer Pro",
    features: [
      { included: true,  text: "Fermes & bâtiments illimités" },
      { included: true,  text: "Jusqu'à 20 000 animaux" },
      { included: true,  text: "Reproduction & généalogie" },
      { included: true,  text: "Rapports PDF & Excel" },
      { included: false, text: "IA agricole" },
    ],
  },
  {
    name:  "Enterprise",
    price: "Sur",
    unit:  "devis",
    desc:  "Pour les grandes exploitations",
    featured: false,
    cta:   "Contacter les ventes",
    features: [
      { included: true, text: "Tout ce qui est dans Pro" },
      { included: true, text: "Animaux illimités" },
      { included: true, text: "IA agricole incluse" },
      { included: true, text: "SLA 99.9% garanti" },
      { included: true, text: "Support téléphonique 24/7" },
    ],
  },
] as const

export const CHART_DATA = [20, 28, 38, 45, 54, 62, 72, 80, 88, 100]

export const DASHBOARD_KPIS = [
  { label: "Bandes actives", value: "4",     sub: "+1 ce mois",  subColor: "text-green-400" , valueColor: " ",},
  { label: "Oiseaux",        value: "18.4k", sub: "en production", subColor: "text-zinc-500" , valueColor: " ",},
  { label: "Mortalité",      value: "1.2%",  sub: "seuil: 3%",   subColor: "text-zinc-500", valueColor: "text-green-400" },
  { label: "Alertes",        value: "2",     sub: "stock bas",   subColor: "text-amber-400", valueColor: "text-amber-400" },
] as const

export const RECENT_BANDES = [
  { name: "BAND-012", status: "Active",   statusClass: "bg-green-400/15 text-green-400" },
  { name: "TRUIE-047",status: "Gestante", statusClass: "bg-amber-400/15 text-amber-400" },
  { name: "BAND-011", status: "Clôture",  statusClass: "bg-white/10 text-white/50" },
] as const

export const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Tarifs",          href: "#pricing" },
  { label: "Documentation",   href: "/docs" },
  { label: "Blog",            href: "/blog" },
] as const