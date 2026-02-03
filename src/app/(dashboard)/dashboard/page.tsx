import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUpRight, TrendingDown, Wallet, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { AddIncomeSheet } from "@/components/features/transactions/add-income-sheet"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return <div className="p-8">Přihlašte se prosím.</div>
    }

    // Data fetching
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

    // Combine and sort transactions
    // Combine and sort transactions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const incomeTransactions = incomes.map((i: any) => ({ ...i, type: 'income' as const }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expenseTransactions = expenses.map((e: any) => ({ ...e, type: 'expense' as const }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentTransactions: any[] = [
        ...incomeTransactions,
        ...expenseTransactions
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5) // Just show top 5 on dashboard

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Můj Přehled</h2>
                    <p className="text-muted-foreground">Vítejte zpět, <span className="text-primary font-semibold">{session.user.name || 'Uživateli'}</span></p>
                </div>
                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <AddIncomeSheet />
                </div>
            </div>

            {/* Main Balance Card - Hero Section */}
            <Card className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white border-none shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Wallet className="w-48 h-48" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-100 uppercase tracking-wider flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Aktuální Zůstatek
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-6xl font-bold tracking-tight text-white mb-8">
                        {balance.toLocaleString('cs-CZ')} Kč
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-white/10 transition-transform hover:scale-105">
                            <div className="p-3 bg-white/20 rounded-full">
                                <ArrowUpRight className="h-5 w-5 text-emerald-300" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-100 mb-1">Příjmy</p>
                                <p className="font-bold text-lg">+{totalIncome.toLocaleString('cs-CZ')} Kč</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-white/10 transition-transform hover:scale-105">
                            <div className="p-3 bg-white/20 rounded-full">
                                <TrendingDown className="h-5 w-5 text-rose-300" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-100 mb-1">Výdaje</p>
                                <p className="font-bold text-lg">-{totalExpense.toLocaleString('cs-CZ')} Kč</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Transactions List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Poslední pohyby</h3>
                    <Button variant="ghost" size="sm" asChild className="hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group">
                        <Link href="/transactions" className="gap-1">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold group-hover:from-indigo-500 group-hover:to-purple-500">Zobrazit vše</span>
                            <ArrowRight className="h-4 w-4 text-purple-500" />
                        </Link>
                    </Button>
                </div>

                <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                        {recentTransactions.length > 0 ? (
                            <div className="divide-y divide-border/50">
                                {recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-muted/40 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl transition-colors ${tx.type === 'income'
                                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                                                }`}>
                                                {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {tx.type === 'expense' ? tx.category : tx.source}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {tx.description || format(new Date(tx.date), 'dd. MMMM yyyy', { locale: cs })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-lg font-bold ${tx.type === 'expense'
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                            {tx.type === 'expense' ? '-' : '+'}{Number(tx.amount).toLocaleString('cs-CZ')} Kč
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Wallet className="h-8 w-8 opacity-50" />
                                </div>
                                <p className="text-lg font-medium">Zatím žádné transakce</p>
                                <p className="text-sm">Přidejte svůj první příjem tlačítkem nahoře!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}