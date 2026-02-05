"use client";

import { cn } from '@/lib/utils';
import { Lightbulb, AlertTriangle, TrendingUp, X, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export type InsightType = 'savings_opportunity' | 'warning' | 'tip';

interface InsightCardProps {
    id: string;
    type: InsightType;
    title: string;
    message: string;
    potentialSaving?: number | null;
    onDismiss?: (id: string) => void;
    onAct?: (id: string) => void;
}

export function InsightCard({ id, type, title, message, potentialSaving, onDismiss, onAct }: InsightCardProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const getStyles = () => {
        switch (type) {
            case 'savings_opportunity':
                return {
                    bg: "bg-green-50 dark:bg-green-900/20",
                    border: "border-green-200 dark:border-green-800",
                    iconBg: "bg-green-100 dark:bg-green-800",
                    iconColor: "text-green-600 dark:text-green-400",
                    Icon: TrendingUp
                };
            case 'warning':
                return {
                    bg: "bg-orange-50 dark:bg-orange-900/20",
                    border: "border-orange-200 dark:border-orange-800",
                    iconBg: "bg-orange-100 dark:bg-orange-800",
                    iconColor: "text-orange-600 dark:text-orange-400",
                    Icon: AlertTriangle
                };
            case 'tip':
            default:
                return {
                    bg: "bg-purple-50 dark:bg-purple-900/20",
                    border: "border-purple-200 dark:border-purple-800",
                    iconBg: "bg-purple-100 dark:bg-purple-800",
                    iconColor: "text-purple-600 dark:text-purple-400",
                    Icon: Lightbulb
                };
        }
    };

    const styles = getStyles();
    const Icon = styles.Icon;

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all duration-500 ease-in-out transform hover:scale-[1.02]",
                styles.bg,
                styles.border,
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
        >
            <div className="flex items-start gap-4">
                <div className={cn("rounded-full p-2 shrink-0", styles.iconBg)}>
                    <Icon className={cn("h-5 w-5", styles.iconColor)} />
                </div>

                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        {message}
                    </p>

                    {potentialSaving && (
                        <div className="mb-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Ušetříš až {potentialSaving.toLocaleString('cs-CZ')} Kč
                        </div>
                    )}

                    <div className="flex gap-2 mt-1">
                        {onAct && (
                            <button
                                onClick={() => onAct(id)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                            >
                                <Check className="h-3 w-3" /> Chci to zkusit
                            </button>
                        )}
                        <button
                            onClick={() => { setIsVisible(false); setTimeout(() => onDismiss?.(id), 500); }}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Ne, díky
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => { setIsVisible(false); setTimeout(() => onDismiss?.(id), 500); }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
