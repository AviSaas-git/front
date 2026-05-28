// Types partagés entre tous les formulaires

export type RegisterFormData = {
  nom:      string
  email:    string
  telephone: string
  password: string
  plan:     "FREE" | "PRO" | "ENTERPRISE"
}

export type LoginFormData = {
  email:    string
  password: string
}

export type FermeFormData = {
  nom:         string
  localisation: string
  surfaceM2?:  number
  capaciteMax: number
}

export type BatimentFormData = {
  nom:           string
  capacite:      number
  surfaceM2?:    number
  typeChauffage?: string
  type:          string
  tenantId?: string
}