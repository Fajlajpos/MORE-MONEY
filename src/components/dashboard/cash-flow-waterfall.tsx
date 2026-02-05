"use client";

import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CashFlowWaterfallProps {
    data: {
        month: string;
        income: number;
        expenses: number;
    }[];
}

export function CashFlowWaterfall({ data }: CashFlowWaterfallProps) {
    // Transform data to include 'net' savings
    const chartData = data.map(d => ({
        ...d,
        net: d.income - d.expenses
    }));

    return (
        <div className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg h-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Cash Flow & Úspory</h3>

            <ResponsiveContainer width="100%" height="90%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number | string | Array<number | string>) => [
                            `${Number(value).toLocaleString('cs-CZ')} Kč`,
                            ''
                        ]}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    <Bar dataKey="income" name="Příjmy" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expenses" name="Výdaje" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                    <Line type="monotone" dataKey="net" name="Čistá Úspora" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
