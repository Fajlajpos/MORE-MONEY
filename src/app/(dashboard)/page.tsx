import { auth } from "@/auth"

export default async function DashboardPage() {
    const session = await auth()

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-3xl font-bold">Dashboard Funguje! ✅</h1>
            <p>Vítejte, {session?.user?.email || "Neznámý uživatel"}</p>
            <p className="text-muted-foreground">Pokud vidíte tuto obrazovku, problém byl v načítání grafů.</p>
            <div className="p-4 border rounded bg-muted/20">
                <p>Role: {session?.user?.role || "Žádná"}</p>
                <p>ID: {session?.user?.id || "Žádné"}</p>
            </div>
        </div>
    )
}
