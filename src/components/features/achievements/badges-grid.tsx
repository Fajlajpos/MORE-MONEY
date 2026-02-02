"use client"
import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Medal, Star, Target, PiggyBank, TrendingUp } from "lucide-react"

export function BadgesGrid() {
    const badges = [
        { name: "První Krok", desc: "Zadal jsi první výdaj", icon: Star, color: "text-yellow-500", achieved: true },
        { name: "Spořič", desc: "Ušetřil jsi 10% příjmu", icon: PiggyBank, color: "text-green-500", achieved: false },
        { name: "Investor", desc: "První investice", icon: TrendingUp, color: "text-blue-500", achieved: false },
        { name: "Mistr Rozpočtu", desc: "Dodržel jsi rozpočet", icon: Target, color: "text-purple-500", achieved: false },
        { name: "Veterán", desc: "Používáš aplikaci 30 dní", icon: Medal, color: "text-orange-500", achieved: false },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge, i) => (
                <Card
                    key={i}
                    className={`text-center cursor-pointer transition-all hover:scale-105 ${!badge.achieved && "opacity-50 grayscale"}`}
                    onClick={() => alert(`Odznak "${badge.name}": ${badge.desc}\n(Logika odznaků se připravuje)`)}
                >
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
    )
}
