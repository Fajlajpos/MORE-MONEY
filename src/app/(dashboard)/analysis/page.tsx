
import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { ExpensePieChart } from "@/components/features/analytics/expense-pie-chart"
import { AiInsightsList } from "@/components/features/analytics/ai-insights-list"
import { BarChart, PieChart, Activity } from "lucide-react"

export default async function AnalysisPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return <div className="p-8">Přihlašte se prosím.</div>
    }

    // Fetch data for Pie Chart
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expensesByCategory = await prisma.variableExpense.groupBy({
        by: ['category'],
        where: { userId: session.user.id },
        _sum: { amount: true }
    }) as { category: string, _sum: { amount: number } }[] // Prisma raw wrapper returns different shape, adjusting mapping below

    // Normalize data from raw wrapper
    // The raw wrapper returns: [{ category: 'foo', _sum: 100 }] directly if queryRaw is matching standard prisma groupBy shape?
    // Let's assume my wrapper returns exactly what I wrote in SQL: SELECT category, SUM(amount) as _sum
    // So shape is { category: string, _sum: number }[]
    const pieChartData = Array.isArray(expensesByCategory) ? expensesByCategory.map((item: any) => ({
        category: item.category,
        _sum: Number(item._sum)
    })) : []

    // Fetch AI Insights
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insights = await prisma.aiInsight.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
    }) as any[]

    // Map raw dates to strings for client component
    const normalizedInsights = insights.map(i => ({
        ...i,
        createdAt: new Date(i.createdAt).toISOString()
    }))

    return (
        <div className="space-y-8 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Analýza & Reporty
                    </h2>
                    <p className="text-muted-foreground">
                        Detailní pohled na vaše finance a doporučení.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <ExpensePieChart data={pieChartData} />
                <AiInsightsList insights={normalizedInsights} />
            </div>

            {/* Placeholder for more charts or advanced filters */}
            <div className="p-8 border-2 border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50 text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Další reporty (měsíční srovnání, exporty) přijdou brzy.</p>
            </div>
        </div>
    )
}
