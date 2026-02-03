"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Wallet,
    PiggyBank,
    TrendingUp,
    Target,
    Trophy,
    Settings,
    Menu,

    Bot
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

import { Separator } from "@/components/ui/separator"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Přehled", href: "/dashboard" },
    { icon: Wallet, label: "Transakce", href: "/transactions" },
    { icon: PiggyBank, label: "Rozpočet", href: "/budget" },
    { icon: Target, label: "Cíle", href: "/goals" },
    { icon: TrendingUp, label: "Investice", href: "/investments" },
    { icon: Trophy, label: "Úspěchy", href: "/achievements" },
    { icon: Bot, label: "AI Asistent", href: "/ai" },
]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 border-r border-sidebar-border/30 bg-sidebar/30 backdrop-blur-2xl h-full", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    {/* Logo Section - BOLD NEW DESIGN */}
                    <div className="mb-6 px-2 flex items-center justify-center py-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/20 text-white transform transition-transform hover:scale-105 hover:rotate-3">
                                {/* Abstract 'M' / Wallet Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
                                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    MORE MONEY
                                </h1>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Finance App</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-4 mb-1 transition-all duration-200",
                                    pathname === item.href
                                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-bold shadow-sm border border-indigo-100 dark:from-indigo-950/50 dark:to-purple-950/50 dark:text-indigo-300 dark:border-indigo-900"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <div className={cn(
                                        "p-1.5 rounded-md",
                                        pathname === item.href ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-900 dark:text-indigo-200" : "bg-transparent"
                                    )}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-base">{item.label}</span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <Separator className="mx-4 w-auto" />
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                        Nastavení
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                            <Link href="/settings">
                                <Settings className="h-5 w-5" />
                                Nastavení účtu
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="h-full py-4">
                    {/* Reusing the sidebar content usually, but for now copying basic structure or importing */}
                    <Sidebar className="border-none" />
                </div>
            </SheetContent>
        </Sheet>
    )
}
