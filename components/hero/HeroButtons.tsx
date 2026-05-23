import Link from "next/link"

export function HeroButtons() {
  return (
  <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link
        href="/register"
        className="bg-green-400 hover:bg-green-300 text-green-950 font-medium px-7 py-3 rounded-xl text-sm transition-colors"
      >
        S&apos;incrire 
      </Link>
      <Link
        href="/login"
        className="bg-green-400 hover:bg-green-300 text-green-950 font-medium px-7 py-3 rounded-xl text-sm transition-colors"
      >
        Connexion
      </Link>
    </div>
  )
}