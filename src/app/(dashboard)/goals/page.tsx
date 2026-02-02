import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Goal } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, Calendar } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

export default async function GoalsPage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const goals = await prisma.goal.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Finanční Cíle</h2>
                    <p className="text-muted-foreground">Sledujte svou cestu za svými sny.</p>
                </div>
                {/* Visual button only for now */}
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nový cíl
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.length === 0 && (
                    <Card className="col-span-full border-dashed p-8">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-primary/10">
                                <Target className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Zatím žádné cíle</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Nastavte si svůj první cíl, ať už je to dovolená, nové auto nebo rezerva.
                                </p>
                            </div>
                            <Button variant="outline">Vytvořit první cíl</Button>
                        </div>
                    </Card>
                )}

                {goals.map((goal: Goal) => {
                    const percent = Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))

                    return (
                        <Card key={goal.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{goal.name}</CardTitle>
                                    <span className="text-2xl font-bold text-primary">{percent}%</span>
                                </div>
                                <CardDescription>
                                    Cíl: {Number(goal.targetAmount).toLocaleString('cs-CZ')} Kč
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <Progress value={percent} className="h-3" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Našetřeno:</span>
                                    <span className="font-semibold text-success">{Number(goal.currentAmount).toLocaleString('cs-CZ')} Kč</span>
                                </div>
                                {goal.deadline && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>Do: {format(goal.deadline, 'PPP', { locale: cs })}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="secondary" className="w-full">Přidat příspěvek</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
