import Link from "next/link"

const footerLinks = {
  produit: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Roadmap", href: "/roadmap" },
  ],

  entreprise: [
    { label: "À propos", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Carrières", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],

  legal: [
    { label: "Confidentialité", href: "/privacy" },
    { label: "Conditions", href: "/terms" },
    { label: "Sécurité", href: "/security" },
  ],
}

export function Footer() {
  return (
    <footer className="px-4 pb-8">
      <div className="max-w-7xl mx-auto border border-white/[0.06] bg-[#0b0b0d] rounded-[32px] overflow-hidden">
        
        {/* CTA TOP */}
        <div className="px-6 sm:px-12 py-16 border-b border-white/[0.06]">
          <div className="max-w-3xl">
            <p className="text-green-400 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              Commencez aujourd&apos;hui
            </p>

            <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-white leading-tight mb-6">
              Faites évoluer votre élevage
              avec des outils modernes.
            </h2>

            <p className="text-white/45 text-lg leading-relaxed mb-8 max-w-2xl">
              Centralisez vos bandes, animaux, stocks,
              reproduction et analyses dans une plateforme
              pensée pour les éleveurs professionnels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="h-12 px-6 rounded-xl bg-green-400 hover:bg-green-300 transition-colors text-green-950 font-medium flex items-center justify-center"
              >
                Démarrer gratuitement
              </Link>

              <Link
                href="/demo"
                className="h-12 px-6 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-white/80 flex items-center justify-center"
              >
                Voir la démo
              </Link>
            </div>
          </div>
        </div>

        {/* LINKS */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 px-6 sm:px-12 py-14">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                <span className="text-green-400 font-bold">
                  A
                </span>
              </div>

              <div>
                <p className="text-white font-medium text-lg">
                  AVI SaaS
                </p>

                <p className="text-white/35 text-sm">
                  Smart Livestock Platform
                </p>
              </div>
            </div>

            <p className="text-white/40 leading-7 max-w-md">
              Plateforme SaaS moderne pour la gestion intelligente
              des élevages avicoles et mammifères en Afrique.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h3 className="text-white font-medium mb-4">
              Produit
            </h3>

            <div className="space-y-3">
              {footerLinks.produit.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-white/40 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="text-white font-medium mb-4">
              Entreprise
            </h3>

            <div className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-white/40 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-medium mb-4">
              Legal
            </h3>

            <div className="space-y-3">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-white/40 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 AVI SaaS. Tous droits réservés.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              Confidentialité
            </Link>

            <Link
              href="/terms"
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}