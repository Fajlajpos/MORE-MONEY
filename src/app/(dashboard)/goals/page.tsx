import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Goal } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Calendar, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { AddGoalSheet } from "@/components/features/goals/add-goal-sheet"

export default async function GoalsPage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const goals = await prisma.goal.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    // Helper to pick a gradient based on index to add variety
    const getGradient = (index: number) => {
        const gradients = [
            "from-pink-500 to-rose-500",
            "from-indigo-500 to-purple-600",
            "from-emerald-400 to-cyan-500",
            "from-orange-400 to-amber-500",
            "from-blue-400 to-indigo-500",
        ]
        return gradients[index % gradients.length]
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Finanční Cíle</h2>
                    <p className="text-muted-foreground">Sledujte svou cestu za svými sny.</p>
                </div>
                <AddGoalSheet />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.length === 0 && (
                    <Card className="col-span-full border-dashed p-12 bg-muted/30">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                <Target className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Zatím žádné cíle</h3>
                                <p className="text-muted-foreground max-w-sm mt-2">
                                    Nastavte si svůj první cíl, ať už je to dovolená, nové auto nebo rezerva.
                                </p>
                            </div>
                            <div className="mt-4">
                                <AddGoalSheet />
                            </div>
                        </div>
                    </Card>
                )}

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {goals.map((goal: any, index: number) => {
                    const percent = Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))
                    const gradient = getGradient(index)

                    return (
                        <Card key={goal.id} className="flex flex-col overflow-hidden border-none shadow-lg group hover:shadow-xl transition-all duration-300">
                            {/* Color Header */}
                            <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{goal.name}</CardTitle>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient}`}>
                                        {percent}%
                                    </div>
                                </div>
                                <CardDescription>
                                    Cíl: {Number(goal.targetAmount).toLocaleString('cs-CZ')} Kč
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 flex-1">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Našetřeno</span>
                                        <span className={`font-bold`}>{Number(goal.currentAmount).toLocaleString('cs-CZ')} Kč</span>
                                    </div>
                                    <Progress value={percent} className="h-3 bg-muted" />
                                    {/* Custom colored indicator based on gradient would be tricky with shadcn progress, keep default or customize later */}
                                </div>

                                {goal.deadline && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                        <Calendar className="h-4 w-4 text-indigo-500" />
                                        <span>Termín: <span className="font-medium">{format(new Date(goal.deadline), 'PPP', { locale: cs })}</span></span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button variant="outline" className="w-full gap-2 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-950">
                                    <TrendingUp className="h-4 w-4" />
                                    Přidat příspěvek
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
