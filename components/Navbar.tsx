import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <div>
          <Link href="/" className="text-2xl font-bold text-slate-900">
            AVI
          </Link>
        </div>

        {/* Navigation */}
        <div className="hidden gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Fonctionnalités
          </Link>

          <Link
            href="#dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Dashboard
          </Link>

          <Link
            href="#pricing"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Tarifs
          </Link>

          <Link
            href="#contact"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Contact
          </Link>
        </div>

        {/* Boutons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost">Connexion</Button>

          <Button className="bg-green-600 hover:bg-green-700">
            Commencer
          </Button>
        </div>
      </nav>
    </header>
  );
}