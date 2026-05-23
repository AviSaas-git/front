export type ModeGestion = "LOT" | "INDIVIDUEL"

export type StatutElevage =
  | "ACTIVE"
  | "GESTANTE"
  | "ALLAITANTE"
  | "CLOTURE_PROCHE"
  | "CLOTUREE"

export type KpiItem = {
  label:       string
  value:       string
  sub:         string
  subColor:    string
  valueColor?: string
}

export type ElevageRow = {
  id:          string
  reference:   string
  espece:      string
  mode:        ModeGestion
  statut:      StatutElevage
  infoKey:     string
  progression: number          // 0 → 100
}

export type AlertItem = {
  id:      string
  message: string
}

export type NavItem = {
  label: string
  href:  string
  icon:  string
  section?: string
}