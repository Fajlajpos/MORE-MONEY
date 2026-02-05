"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ExpensePieChartProps {
    data: {
        category: string
        _sum: number
    }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const CATEGORY_LABELS: Record<string, string> = {
    food: "Jídlo",
    transport: "Doprava",
    fuel: "Palivo",
    housing: "Bydlení",
    utilities: "Energie",
    entertainment: "Zábava",
    health: "Zdraví",
    shopping: "Nákupy",
    smoking: "Kouření",
    subscriptions: "Předplatné",
    other: "Ostatní"
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
    // Filter out zero values and map labels
    const chartData = data
        .filter(item => item._sum > 0)
        .map(item => ({
            name: CATEGORY_LABELS[item.category] || item.category,
            value: item._sum
        }))

    if (chartData.length === 0) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Rozložení výdajů</CardTitle>
                    <CardDescription>Zatím žádná data pro graf</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Zadejte nějaké výdaje pro zobrazení grafu.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Rozložení výdajů</CardTitle>
                <CardDescription>Kde utrácíte nejvíce peněz</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [`${value.toLocaleString()} Kč`, 'Částka']}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
