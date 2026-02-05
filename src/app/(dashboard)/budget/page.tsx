import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { AddFixedExpenseDialog } from "@/components/features/expenses/add-fixed-expense-dialog"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

import { FixedExpense } from "@/lib/schema-types"

export default async function BudgetPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return <div className="p-8">Přihlašte se prosím.</div>
    }

    // Načtení fixních výdajů
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fixedExpenses = (await prisma.fixedExpense.findMany({
        where: { userId: session.user.id },
        orderBy: { amount: 'desc' }
    })) as FixedExpense[]

    // Výpočet celkových fixních měsíčních nákladů
    const totalFixedMonthly = fixedExpenses.reduce((sum, item) => {
        if (item.frequency === 'MONTHLY') return sum + item.amount
        if (item.frequency === 'YEARLY') return sum + (item.amount / 12)
        if (item.frequency === 'WEEKLY') return sum + (item.amount * 4) // Přibližně
        return sum
    }, 0)

    // Odhadovaný disponibilní příjem (Pokud bychom měli Income, odečetli bychom to)
    // Prozatím jen zobrazíme sumu nákladů

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Fixní výdaje & Rozpočet</h2>
                    <p className="text-muted-foreground">Spravujte své pravidelné platby a závazky.</p>
                </div>
                <AddFixedExpenseDialog />
            </div>

            {/* Přehledová karta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            Celkové fixní měsíční náklady
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {totalFixedMonthly.toLocaleString('cs-CZ')} Kč
                        </div>
                        <p className="text-sm text-gray-500">
                            Částka, kterou musíte zaplatit každý měsíc, než začnete utrácet.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900 shadow-sm border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <AlertCircle className="h-5 w-5" />
                            Tip pro úsporu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Vaše fixní výdaje tvoří významnou část rozpočtu. Zkuste revidovat předplatná nebo srovnat ceny energií.
                            AI asistent vám může pomoci najít levnější alternativy.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Seznam fixních výdajů */}
            <Card className="border-none shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Seznam pravidelných plateb</CardTitle>
                    <CardDescription>Všechny vaše nastavené pravidelné platby.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {fixedExpenses.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {fixedExpenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                                            {/* Zde by mohla být ikona podle kategorie */}
                                            <Calendar className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                {expense.customCategoryName || expense.category}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{expense.frequency === 'MONTHLY' ? 'Měsíčně' : 'Jinak'}</span>
                                                {expense.autoPay && (
                                                    <span className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs">
                                                        <CheckCircle2 className="h-3 w-3" /> Auto
                                                    </span>
                                                )}
                                                {expense.dueDate && (
                                                    <span>• Splatnost: {expense.dueDate}. den</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        -{expense.amount.toLocaleString('cs-CZ')} Kč
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Zatím žádné fixní výdaje.</p>
                            <p className="text-sm">Přidejte svůj nájem, energie nebo internet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
