"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
    date: string;
    amount: number;
    type: string;
}

export function DashboardChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/10 rounded-md border border-dashed">
                Zatím nemáte dostatek dat pro zobrazení grafu.
            </div>
        )
    }

    // Transform data for chart if needed, or assume it's passed correctly
    // For simplicity, we just plot the amounts

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                    <YAxis tickFormatter={(val) => `${val}`} tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => {
                            if (typeof value === 'number') {
                                return [`${value.toLocaleString('cs-CZ')} Kč`, 'Částka'];
                            }
                            return null;
                        }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#00C853" fill="url(#colorIncome)" strokeWidth={2} />
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}