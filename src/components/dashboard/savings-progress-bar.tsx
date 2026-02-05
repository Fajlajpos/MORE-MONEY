"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface SavingsProgressBarProps {
    current: number;
    target: number;
    currency?: string;
    className?: string;
}

export function SavingsProgressBar({ current, target, currency = "Kč", className }: SavingsProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const percentage = Math.min(Math.max((current / target) * 100, 0), 100);

    useEffect(() => {
        // Animate progress on mount
        const timer = setTimeout(() => setProgress(percentage), 500);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className={cn("p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg", className)}>
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Měsíční cíl úspor</h3>
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                        {current.toLocaleString('cs-CZ')} {currency}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Cíl: {target.toLocaleString('cs-CZ')} {currency}</p>
                    <p className="text-sm font-medium text-green-600">{percentage.toFixed(1)}%</p>
                </div>
            </div>

            <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                    style={{ width: `${progress}%` }}
                >
                    {progress > 10 && <div className="h-4 w-1 bg-white/30 rounded-full animate-pulse" />}
                </div>
            </div>

            {percentage >= 100 && (
                <div className="mt-4 flex items-center justify-center text-green-600 font-bold animate-bounce">
                    <Trophy className="w-5 h-5 mr-2" />
                    Cíl splněn! Gratulujeme!
                </div>
            )}
        </div>
    );
}
