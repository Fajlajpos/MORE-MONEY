"use client";

import { useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, getDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpendingHeatmapProps {
    data: { date: Date | string; amount: number }[];
    currentDate?: Date;
}

export function SpendingHeatmap({ data, currentDate = new Date() }: SpendingHeatmapProps) {
    const daysInMonth = useMemo(() => {
        return eachDayOfInterval({
            start: startOfMonth(currentDate),
            end: endOfMonth(currentDate),
        });
    }, [currentDate]);

    const maxSpending = useMemo(() => {
        return Math.max(...data.map((d) => d.amount), 1);
    }, [data]);

    const getIntensityClass = (amount: number) => {
        if (amount === 0) return "bg-gray-100 dark:bg-gray-800";
        const ratio = amount / maxSpending;
        if (ratio < 0.2) return "bg-green-200 dark:bg-green-900";
        if (ratio < 0.5) return "bg-green-400 dark:bg-green-700";
        if (ratio < 0.8) return "bg-yellow-400 dark:bg-yellow-600";
        return "bg-red-500 dark:bg-red-600";
    };

    // Adjust for starting day of week (Monday = 1)
    const startDay = getDay(startOfMonth(currentDate));
    const offset = startDay === 0 ? 6 : startDay - 1;

    return (
        <div className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Výdaje v {format(currentDate, 'LLLL', { locale: cs })}
            </h3>

            <div className="grid grid-cols-7 gap-2">
                {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 mb-2">
                        {day}
                    </div>
                ))}

                {Array.from({ length: offset }).map((_, i) => (
                    <div key={`offset-${i}`} className="aspect-square" />
                ))}

                <TooltipProvider delayDuration={100}>
                    {daysInMonth.map((day) => {
                        const dayData = data.find((d) => isSameDay(new Date(d.date), day));
                        const amount = dayData?.amount || 0;

                        return (
                            <Tooltip key={day.toISOString()}>
                                <TooltipTrigger>
                                    <div
                                        className={cn(
                                            "aspect-square rounded-lg transition-all duration-300 hover:scale-110 cursor-default flex items-center justify-center text-[10px]",
                                            getIntensityClass(amount),
                                            isSameDay(day, new Date()) && "ring-2 ring-blue-500 ring-offset-2"
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">{format(day, 'd. MMMM', { locale: cs })}</p>
                                    <p className="text-sm">Výdaje: {amount.toLocaleString('cs-CZ')} Kč</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </div>
        </div>
    );
}
