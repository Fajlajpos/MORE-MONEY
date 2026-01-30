import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Check, RefreshCw } from "lucide-react"

// Placeholder for now
export default function BudgetPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Rozpočet a Fixní Výdaje</h2>
                    <p className="text-muted-foreground">Spravujte své pravidelné měsíční platby.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Přidat pravidelnou platbu
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Celkové fixní náklady</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15,400 Kč</div>
                        <p className="text-xs text-muted-foreground">Měsíčně</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Disponibilní příjem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">25,600 Kč</div>
                        <p className="text-xs text-muted-foreground">Po odečtení fixních nákladů</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Automatické platby</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">3 / 8</div>
                        <p className="text-xs text-muted-foreground">Aktivní</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seznam Pravidelných Plateb</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { name: "Nájem", amount: "12,000 Kč", date: "15. dne", auto: true },
                            { name: "Netflix", amount: "199 Kč", date: "20. dne", auto: true },
                            { name: "Internet", amount: "450 Kč", date: "1. dne", auto: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <RefreshCw className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Splatnost: {item.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold">{item.amount}</p>
                                        {item.auto && <p className="text-xs text-success flex items-center justify-end gap-1"><Check className="h-3 w-3" /> Auto</p>}
                                    </div>
                                    <Button variant="ghost" size="sm">Upravit</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
