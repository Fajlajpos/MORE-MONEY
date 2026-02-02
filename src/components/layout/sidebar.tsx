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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mb-2 px-4 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">M</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            MORE MONEY
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    pathname === item.href && "text-primary font-semibold"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
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
                <div className="h-full py-4">
                    {/* Reusing the sidebar content usually, but for now copying basic structure or importing */}
                    <Sidebar className="border-none" />
                </div>
            </SheetContent>
        </Sheet>
    )
}
