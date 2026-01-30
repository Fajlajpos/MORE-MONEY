import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-muted/20">
      <h1 className="text-4xl font-bold tracking-tight text-primary">MORE MONEY 💸</h1>
      <p className="text-xl text-muted-foreground">Vítejte v Demo verzi vaší finanční aplikace.</p>

      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Přihlásit se</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" size="lg">Registrace</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="lg">Přejít na Dashboard</Button>
        </Link>
        <Link href="/api/auth/signout">
          <Button variant="destructive" size="lg">Odhlásit (Reset)</Button>
        </Link>
      </div>

      <div className="mt-8 p-4 border rounded bg-white max-w-md text-sm text-center text-muted-foreground">
        <p><strong>Status:</strong> Mock Mode (Bez databáze)</p>
        <p>Pro přihlášení použijte admin účet nebo se zaregistrujte.</p>
      </div>
    </div>
  )
}
