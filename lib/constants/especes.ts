import type { EspeceConfig } from "@/lib/types/elevage"

export const ESPECES: EspeceConfig[] = [
  {
    id:               "poulet-chair",
    nom:              "Poulet de chair",
    icon:             "🐔",
    typeAnimal:       "VOLAILLE",
    modeGestion:      "LOT",
    cycleMoyenJours:  63,
  },
  {
    id:               "poule-pondeuse",
    nom:              "Poule pondeuse",
    icon:             "🐓",
    typeAnimal:       "VOLAILLE",
    modeGestion:      "LOT",
    cycleMoyenJours:  600,

  },
  {
    id:               "porc-lw",
    nom:              "Porc Large White",
    icon:             "🐷",
    typeAnimal:       "MAMMIFERE",
    modeGestion:      "INDIVIDUEL",
    dureeGestationJours: 114,
  },
  {
    id:               "lapin-nz",
    nom:              "Lapin NZ Blanc",
    icon:             "🐰",
    typeAnimal:       "MAMMIFERE",
    modeGestion:      "INDIVIDUEL",
    dureeGestationJours: 31,
  },
]

// Bâtiments mockés — remplacés par l'API plus tard
export const BATIMENTS_MOCK = [
  { id: "bat-a", nom: "Bâtiment A", capacite: 5500, disponible: true  },
  { id: "bat-b", nom: "Bâtiment B", capacite: 3000, disponible: true  },
  { id: "bat-c", nom: "Porcherie B", capacite: 80,  disponible: true  },
]

// Animaux reproducteurs mockés pour les selects père/mère
export const ANIMAUX_REPRODUCTEURS_MOCK = [
  { id: "anim-1", numero: "VERRAT-2024-012", sexe: "MALE",   espece: "Porc Large White" },
  { id: "anim-2", numero: "TRUIE-2024-022",  sexe: "FEMELLE",espece: "Porc Large White" },
  { id: "anim-3", numero: "VERRAT-2024-008", sexe: "MALE",   espece: "Porc Large White" },
]