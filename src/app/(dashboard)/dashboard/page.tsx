import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Income, VariableExpense } from "@prisma/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, DollarSign, Activity, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { DashboardChart } from "../components/dashboard-chart"

type DashboardData = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    recentTransactions: (Income & { type: 'income' } | VariableExpense & { type: 'expense' })[];
    incomes: Income[];
    expenses: VariableExpense[];
}

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold">Přihlašte se prosím pro zobrazení dat.</h2>
            </div>
        )
    }

    let data: DashboardData | undefined;
    let error: Error | undefined;

    try {
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

        const recentTransactions: (Income & { type: 'income' } | VariableExpense & { type: 'expense' })[] = [
            ...incomes.map((i: Income) => ({ ...i, type: 'income' as const })),
            ...expenses.map((e: VariableExpense) => ({ ...e, type: 'expense' as const }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7)
        
        data = { totalIncome, totalExpense, balance, recentTransactions, incomes, expenses };

    } catch (e) {
        error = e as Error;
        console.error("Dashboard Error:", error)
    }

    if (error || !data) {
        return (
            <div className="p-8 text-destructive">
                <h2 className="text-2xl font-bold">Chyba při načítání dat</h2>
                <p>Omlouváme se, ale nepodařilo se načíst vaše finanční data.</p>
                <p className="text-sm text-muted-foreground mt-2">Důvod: {String(error)}</p>
            </div>
        )
    }
    
    const { totalIncome, totalExpense, balance, recentTransactions, incomes, expenses } = data;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Přehled</h2>
                <div className="flex items-center space-x-2">
                    <Button>Stáhnout report</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Celkový Zůstatek
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {balance.toLocaleString('cs-CZ')} Kč
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Aktuální stav
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Příjmy (Celkem)
                        </CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">+{totalIncome.toLocaleString('cs-CZ')} Kč</div>
                        <p className="text-xs text-muted-foreground">
                            Všechny evidované příjmy
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Výdaje (Celkem)
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">-{totalExpense.toLocaleString('cs-CZ')} Kč</div>
                        <p className="text-xs text-muted-foreground">
                            Variabilní výdaje
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Poslední aktivita
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expenses.length + incomes.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Transakcí
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Trend Zůstatku & Výdajů</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <DashboardChart data={recentTransactions.map(t => ({
                            date: format(t.date, 'dd.MM'),
                            amount: Number(t.amount),
                            type: t.type
                        })).reverse()} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Poslední Transakce</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {tx.type === 'expense' ? tx.category : tx.source}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {tx.description || format(tx.date, 'PPP', { locale: cs })}
                                        </p>
                                    </div>
                                    <div className={`ml-auto font-medium ${tx.type === 'expense' ? 'text-destructive' : 'text-success'}`}>
                                        {tx.type === 'expense' ? '-' : '+'}{Number(tx.amount).toLocaleString('cs-CZ')} Kč
                                    </div>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">Žádné transakce</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}