
import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Crown } from "lucide-react"

export default async function LeaderboardPage() {
    await auth()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaderboard = (await prisma.userPoints.findLeaderboard(10)) as any[]

    return (
        <div className="space-y-8 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">Žebříček</h2>
                    <p className="text-muted-foreground">
                        Porovnejte své úspěchy s ostatními.
                    </p>
                </div>
            </div>

            <Card className="border-t-4 border-t-yellow-500 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Top 10 Uživatelů
                    </CardTitle>
                    <CardDescription>Nejlepší spořitelé a plniči cílů</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaderboard.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">Zatím žádná data.</div>
                        ) : (
                            leaderboard.map((user, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 font-bold text-lg text-muted-foreground">
                                            {index === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                                            {index === 1 && <Medal className="h-6 w-6 text-slate-400" />}
                                            {index === 2 && <Medal className="h-6 w-6 text-amber-700" />}
                                            {index > 2 && `#${index + 1}`}
                                        </div>
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name ? user.name.substring(0, 2).toUpperCase() : "??"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">{user.name || "Neznámý uživatel"}</div>
                                            <div className="text-xs text-muted-foreground">Level {user.level}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-lg text-indigo-600">
                                        {user.totalPoints.toLocaleString()} b.
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
