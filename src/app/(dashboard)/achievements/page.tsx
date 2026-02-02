import * as React from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Flame } from "lucide-react"
import { BadgesGrid } from "@/components/features/achievements/badges-grid"

export default async function AchievementsPage() {
    const session = await auth()

    if (!session?.user?.id) return null

    const userStats = await prisma.userPoints.findUnique({
        where: { userId: session.user.id }
    }) || { totalPoints: 0, level: 1, currentStreak: 0 }

    const nextLevelPoints = userStats.level * 1000
    const progressPercent = ((userStats.totalPoints % 1000) / 1000) * 100

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Úspěchy a Levely</h2>
                    <p className="text-muted-foreground">Sleduj svůj pokrok a získávej odměny za finanční disciplínu.</p>
                </div>
            </div>

            {/* Main Level Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <CardContent className="flex flex-col md:flex-row items-center gap-8 p-8">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground border-4 border-background shadow-xl">
                            {userStats.level}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold border-2 border-background flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            Level
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold">Finanční Učedník</h3>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{userStats.totalPoints} XP</span>
                                <span>{nextLevelPoints} XP</span>
                            </div>
                        </div>
                        <Progress value={progressPercent} className="h-4" />
                        <p className="text-sm text-muted-foreground">
                            Zbývá {nextLevelPoints - userStats.totalPoints} bodů do další úrovně.
                            Přidej transakci (+10 XP) nebo splň cíl (+50 XP)!
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl border min-w-[120px]">
                        <Flame className="h-8 w-8 text-orange-500 mb-1" />
                        <span className="text-2xl font-bold">{userStats.currentStreak}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Dní v řadě</span>
                    </div>
                </CardContent>
            </Card>

            {/* Badges Grid */}
            <h3 className="text-xl font-semibold">Tvoje Odznaky</h3>
            <BadgesGrid />
        </div>
    )
}

