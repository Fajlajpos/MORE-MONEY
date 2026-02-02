import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { TransactionForm } from "@/components/features/transactions/transaction-form"
import { prisma } from "@/lib/prismadb"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

export default async function TransactionsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const incomes = await prisma.income.findMany({
        where: { userId: session.user.id }
    })
    const expenses = await prisma.variableExpense.findMany({
        where: { userId: session.user.id }
    })

    const transactions = [
        ...incomes.map(i => ({ ...i, type: 'income' })),
        ...expenses.map(e => ({ ...e, type: 'expense' }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transakce</h2>
                    <p className="text-muted-foreground">Spravujte své příjmy a výdaje na jednom místě.</p>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Přidat transakci
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Nová transakce</SheetTitle>
                            <SheetDescription>
                                Zadejte detaily o příjmu nebo výdaji.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                            <TransactionForm />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historie</CardTitle>
                    <CardDescription>Poslední pohyby na účtu</CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <div className="flex items-center justify-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
                            Zatím žádné transakce. Přidejte první tlačítkem vpravo nahoře!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                                            }`}>
                                            {t.type === 'income' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                t.source || t.customCategoryName || t.category
                                            }</p>
                                            <p className="text-sm text-muted-foreground">{format(new Date(t.date), "PPP", { locale: cs })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-destructive'
                                            }`}>
                                            {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('cs-CZ')} Kč
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
