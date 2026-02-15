import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"

export const dynamic = 'force-dynamic'

import { Goal } from "@/lib/schema-types"
import { AddGoalDialog } from "@/components/features/goals/add-goal-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { Target, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function GoalsPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return <div className="p-8">Přihlašte se prosím.</div>
    }


    let goals: Goal[] = [];
    try {
        goals = (await prisma.goal.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })) as Goal[]
    } catch (e) {
        console.error("Failed to fetch goals (likely build time or db issue)", e);
        goals = [];
    }

    return (
        <div className="space-y-8 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Finanční Cíle</h2>
                    <p className="text-muted-foreground">
                        Sledujte své sny a plánujte budoucnost.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <AddGoalDialog />
                </div>
            </div>

            {goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                    <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">Zatím nemáte žádné cíle</h3>
                    <p className="text-sm text-muted-foreground mb-4">Vytvořte si první cíl a začněte spořit na své sny.</p>
                    <AddGoalDialog />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => {
                        const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                        return (
                            <Card key={goal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-indigo-500">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{goal.name}</CardTitle>
                                            <CardDescription>
                                                {goal.deadline ? `Do: ${format(new Date(goal.deadline), "P", { locale: cs })}` : "Bez termínu"}
                                            </CardDescription>
                                        </div>
                                        {goal.imageUrl && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={goal.imageUrl}
                                                alt={goal.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                        )}
                                        {!goal.imageUrl && <Target className="h-8 w-8 text-indigo-100" />}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Našetřeno</span>
                                            <span className="font-bold text-indigo-600">{goal.currentAmount.toLocaleString('cs-CZ')} Kč</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Cíl</span>
                                            <span>{goal.targetAmount.toLocaleString('cs-CZ')} Kč</span>
                                        </div>
                                        <Progress value={progress} className="h-3 bg-indigo-100 dark:bg-indigo-900" indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-600" />
                                        <div className="text-right text-xs text-muted-foreground">{progress}% hotovo</div>
                                    </div>
                                    {goal.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 italic border-l-2 border-indigo-200 pl-2">
                                            {goal.description}
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-3 flex justify-between items-center text-xs text-muted-foreground">
                                    <span>Vytvořeno {format(new Date(goal.createdAt), "P", { locale: cs })}</span>
                                    {/* Placeholder for Edit/Add Contribution buttons */}
                                    <Button variant="ghost" size="sm" className="h-7 text-xs hover:text-indigo-600">Detail</Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
