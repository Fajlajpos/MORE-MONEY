import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Check, RefreshCw } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { FixedExpenseForm } from "@/components/features/budget/fixed-expense-form"
import { prisma } from "@/lib/prismadb"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function BudgetPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const fixedExpenses = await prisma.fixedExpense.findMany({
        where: {
            userId: session.user.id
        }
    })

    const totalFixed = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0)
    const activeCount = fixedExpenses.filter(e => e.autoPay).length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Rozpočet a Fixní Výdaje</h2>
                    <p className="text-muted-foreground">Spravujte své pravidelné měsíční platby.</p>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="gap-2 btn-gradient">
                            <Plus className="h-4 w-4" />
                            Přidat pravidelnou platbu
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Nová pravidelná platba</SheetTitle>
                            <SheetDescription>
                                Zadejte detaily o fixním výdaji (např. nájem, internet).
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                            <FixedExpenseForm />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Celkové fixní náklady</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalFixed.toLocaleString('cs-CZ')} Kč</div>
                        <p className="text-xs text-muted-foreground">Měsíčně</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Počet plateb</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{fixedExpenses.length}</div>
                        <p className="text-xs text-muted-foreground">Položek celkem</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Automatické platby</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">{activeCount}</div>
                        <p className="text-xs text-muted-foreground">Aktivní autoplatby</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seznam Pravidelných Plateb</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {fixedExpenses.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                Žádné fixní výdaje. Přidejte první!
                            </div>
                        ) : (
                            fixedExpenses.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <RefreshCw className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{item.customCategoryName || item.category}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.frequency === 'monthly' ? 'Měsíčně' : item.frequency}
                                                {item.dueDate ? `, ${item.dueDate}. den` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold">{item.amount.toLocaleString('cs-CZ')} Kč</p>
                                            {item.autoPay && <p className="text-xs text-success flex items-center justify-end gap-1"><Check className="h-3 w-3" /> Auto</p>}
                                        </div>
                                        {/* Future: Add edit/delete functionality */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
