import * as React from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Star, Flame, Target } from "lucide-react"

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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                    { name: "První Krok", desc: "Zadal jsi první výdaj", icon: Star, color: "text-yellow-500", achieved: true },
                    { name: "Spořič", desc: "Ušetřil jsi 10% příjmu", icon: PiggyBankIcon, color: "text-green-500", achieved: false },
                    { name: "Investor", desc: "První investice", icon: TrendingUpIcon, color: "text-blue-500", achieved: false },
                    { name: "Mistr Rozpočtu", desc: "Dodržel jsi rozpočet", icon: Target, color: "text-purple-500", achieved: false },
                    { name: "Veterán", desc: "Používáš aplikaci 30 dní", icon: Medal, color: "text-orange-500", achieved: false },
                ].map((badge, i) => (
                    <Card key={i} className={`text-center ${!badge.achieved && "opacity-50 grayscale"}`}>
                        <CardContent className="pt-6 flex flex-col items-center gap-3">
                            <div className={`p-3 rounded-full bg-muted ${badge.achieved ? badge.color.replace('text-', 'bg-').replace('500', '100') : ''}`}>
                                <badge.icon className={`h-8 w-8 ${badge.achieved ? badge.color : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                                <h4 className="font-semibold">{badge.name}</h4>
                                <p className="text-xs text-muted-foreground">{badge.desc}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function PiggyBankIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2.5V5z" />
            <line x1="18" x2="18" y1="11" y2="5" />
            <path d="M8 15h.01" />
            <path d="M17 15h.01" />
            <path d="M13 12v2" />
        </svg>
    )
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
