import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Income, VariableExpense } from "@prisma/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUpRight, TrendingDown, Wallet } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { AddIncomeSheet } from "@/components/features/transactions/add-income-sheet"

type DashboardData = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    recentTransactions: (Income & { type: 'income' } | VariableExpense & { type: 'expense' })[];
}

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return <div className="p-8">Přihlašte se prosím.</div>
    }

    // Data fetching (simplified for clarity)
    const incomes = await prisma.income.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
        take: 5
    })
    const expenses = await prisma.variableExpense.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
        take: 5
    })

    const allIncomes = await prisma.income.aggregate({
        where: { userId: session.user.id },
        _sum: { amount: true }
    })
    const allExpenses = await prisma.variableExpense.aggregate({
        where: { userId: session.user.id },
        _sum: { amount: true }
    })

    const totalIncome = Number(allIncomes._sum.amount || 0)
    const totalExpense = Number(allExpenses._sum.amount || 0)
    const balance = totalIncome - totalExpense

    const recentTransactions = [
        ...incomes.map((i) => ({ ...i, type: 'income' as const })),
        ...expenses.map((e) => ({ ...e, type: 'expense' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Můj Přehled</h2>
                    <p className="text-muted-foreground">Vítejte zpět, {session.user.name || 'Uživateli'}</p>
                </div>
                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <AddIncomeSheet />
                </div>
            </div>

            {/* Main Balance Card - Hero Section */}
            <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Wallet className="w-48 h-48" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Aktuální Zůstatek
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`text-6xl font-bold tracking-tight ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                        {balance.toLocaleString('cs-CZ')} Kč
                    </div>
                    <div className="flex gap-8 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Příjmy</p>
                                <p className="font-semibold text-emerald-600">+{totalIncome.toLocaleString('cs-CZ')} Kč</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Výdaje</p>
                                <p className="font-semibold text-red-600">-{totalExpense.toLocaleString('cs-CZ')} Kč</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Transactions List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Poslední pohyby</h3>
                <Card>
                    <CardContent className="p-0">
                        {recentTransactions.length > 0 ? (
                            <div className="divide-y">
                                {recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {tx.type === 'expense' ? tx.category : tx.source}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {tx.description || format(tx.date, 'PPP', { locale: cs })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-lg font-bold ${tx.type === 'expense' ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {tx.type === 'expense' ? '-' : '+'}{Number(tx.amount).toLocaleString('cs-CZ')} Kč
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                Zatím žádné transakce. Přidejte první příjem!
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}