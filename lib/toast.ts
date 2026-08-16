import toast from "react-hot-toast"

// ── Succès ───────────────────────────────────────────────────────────
export const toastSuccess = (msg: string) =>
  toast.success(msg, {
    duration: 4000,
    style: {
      background: "#052e16",
      color: "#86efac",
      border: "1px solid rgba(74,222,128,0.2)",
      borderRadius: "12px",
      fontSize: "13px",
    },
    iconTheme: { primary: "#4ade80", secondary: "#052e16" },
  })

// ── Erreur ───────────────────────────────────────────────────────────
export const toastError = (msg: string) =>
  toast.error(msg, {
    duration: 5000,
    style: {
      background: "#1c0a0a",
      color: "#fca5a5",
      border: "1px solid rgba(248,113,113,0.2)",
      borderRadius: "12px",
      fontSize: "13px",
    },
    iconTheme: { primary: "#f87171", secondary: "#1c0a0a" },
  })

// ── Avertissement ────────────────────────────────────────────────────
export const toastWarning = (msg: string) =>
  toast(msg, {
    duration: 4500,
    icon: "⚠",
    style: {
      background: "#1c1200",
      color: "#fde68a",
      border: "1px solid rgba(251,191,36,0.2)",
      borderRadius: "12px",
      fontSize: "13px",
    },
  })

// ── Chargement ───────────────────────────────────────────────────────
export const toastLoading = (msg: string) =>
  toast.loading(msg, {
    style: {
      background: "#09090b",
      color: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      fontSize: "13px",
    },
  })

export const toastDismiss = (id: string) => toast.dismiss(id)

// ── Traduction des erreurs Spring Boot ───────────────────────────────
export function traduireErreur(err: any): string {
  const msg: string = err?.response?.data?.message ?? ""
  const status: number = err?.response?.status ?? 0

  // Erreurs d'authentification
  if (msg.includes("Bad credentials") || msg.includes("bad credentials"))
    return "Email ou mot de passe incorrect."

  if (msg.includes("Email déjà utilisé") || msg.includes("already exists"))
    return "Ce compte existe déjà. Connectez-vous ou utilisez une autre adresse."

  if (msg.includes("JWT expired") || status === 401)
    return "Votre session a expiré. Reconnectez-vous."

  if (status === 403)
    return "Accès refusé. Vérifiez votre connexion."

  // Élevage
  if (msg.includes("Bande introuvable"))
    return "Bande introuvable ou accès non autorisé."

  if (msg.includes("Espèce introuvable"))
    return "Espèce non reconnue. Vérifiez la sélection."

  if (msg.includes("Bâtiment introuvable"))
    return "Bâtiment introuvable. Ajoutez-en un d'abord."

  if (msg.includes("Ferme introuvable"))
    return "Ferme introuvable."

  if (msg.includes("Animal introuvable"))
    return "Animal introuvable ou accès non autorisé."

  // Capacité
  if (msg.includes("Dépasse la capacité"))
    return "L'effectif dépasse la capacité du bâtiment sélectionné."

  // Mortalité
  if (msg.includes("Dépasse l'effectif"))
    return "Le nombre de morts dépasse l'effectif actuel de la bande."

  // Ponte
  if (msg.includes("Une collecte a déjà été saisie")) {
    const dateMatch = msg.match(/\d{4}-\d{2}-\d{2}/)
    if (dateMatch) {
      const d = new Date(dateMatch[0]).toLocaleDateString("fr-FR")
      return `Collecte du ${d} déjà enregistrée. Une seule collecte par jour.`
    }
    return "Collecte déjà enregistrée pour cette date."
  }

  if (msg.includes("Stock insuffisant")) {
    const calibreMatch = msg.match(/calibre (\w+)/)
    const qteMatch     = msg.match(/disponible : (\d+)/)
    const calibreLabel: Record<string, string> = {
      PETIT: "Petit", MOYEN: "Moyen", GROS: "Gros", SUPER_GROS: "Super-gros",
    }
    const cal = calibreMatch
      ? calibreLabel[calibreMatch[1]] ?? calibreMatch[1]
      : "ce calibre"
    const qte = qteMatch ? qteMatch[1] : "?"
    return `Stock insuffisant — il vous reste ${qte} œufs ${cal} disponibles.`
  }

  // Reproduction
  if (msg.includes("gestation en cours"))
    return "Cet animal a déjà une gestation en cours."

  if (msg.includes("n'est pas une femelle"))
    return "L'animal sélectionné n'est pas une femelle."

  if (msg.includes("n'est pas un mâle"))
    return "L'animal sélectionné comme père n'est pas un mâle."

  if (msg.includes("portée a déjà été enregistrée"))
    return "Une mise bas a déjà été enregistrée pour cette gestation."

  // Numéro
  if (msg.includes("Numéro déjà utilisé"))
    return "Ce numéro d'animal existe déjà dans votre élevage."

  // Formule alimentation
  if (msg.includes("Formule introuvable"))
    return "Formule d'aliment introuvable. Créez-en une d'abord."

  if (msg.includes("Ingrédient introuvable"))
    return "Ingrédient introuvable dans votre catalogue."

  // Réseau
  if (!err?.response)
    return "Impossible de joindre le serveur. Vérifiez votre connexion."

  // Validation
  if (status === 400) {
    const fields = err?.response?.data?.fields
    if (fields) {
      const premier = Object.values(fields)[0] as string
      return premier ?? "Formulaire invalide. Vérifiez les champs."
    }
    return msg || "Données invalides. Vérifiez le formulaire."
  }

  if (status === 500)
    return "Erreur serveur. Réessayez dans quelques secondes."

  return msg || "Une erreur inattendue s'est produite."
}