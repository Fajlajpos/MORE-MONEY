"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lightbulb, Info, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

interface AiInsight {
    id: string
    type: string
    title: string
    message: string
    createdAt: string
    isRead: boolean
}

interface AiInsightsListProps {
    insights: AiInsight[]
}

export function AiInsightsList({ insights }: AiInsightsListProps) {
    return (
        <Card className="col-span-1 border-indigo-100 dark:border-indigo-900 shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950 dark:to-background rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                    <Lightbulb className="h-5 w-5 fill-yellow-400 text-yellow-600" />
                    Chytré Tipy od AI
                </CardTitle>
                <CardDescription>
                    Analyzujeme vaše výdaje a hledáme úspory.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[300px] p-4">
                    {insights.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Zatím žádné tipy. Zkuste zadat více výdajů (např. tankování).
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {insights.map((insight) => (
                                <div key={insight.id} className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border hover:shadow-sm transition-shadow">
                                    <div className="mt-1">
                                        {insight.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <Info className="h-5 w-5 text-blue-500" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-sm">{insight.title}</h4>
                                            <span className="text-xs text-muted-foreground">{format(new Date(insight.createdAt), "P", { locale: cs })}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{insight.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
