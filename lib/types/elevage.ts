export type ModeGestion = "LOT" | "INDIVIDUEL"

export type EspeceConfig = {
  id:                   string
  nom:                  string
  icon:                 string
  typeAnimal:           string
  modeGestion:          ModeGestion
  cycleMoyenJours?:     number
  dureeGestationJours?: number
}

export type BandeFormData = {
  especeId:        string
  batimentId:      string
  effectifInitial: number
  race?:           string
  dateArrivee:     string
  fournisseur?:    string
}

export type AnimalFormData = {
  especeId:       string
  batimentId:     string
  numero:         string
  nom?:           string
  sexe:           "MALE" | "FEMELLE"
  dateNaissance:  string
  origine:        "ACHAT" | "NAISSANCE_FERME"
  pereId?:        string
  mereId?:        string
}

// Ce que le shell passe à chaque step
export type ElevageStep = "espece" | "formulaire"