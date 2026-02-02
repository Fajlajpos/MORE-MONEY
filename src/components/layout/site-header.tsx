"use client"

import { MobileSidebar } from "./sidebar"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4">
                <MobileSidebar />
                <div className="mr-4 hidden md:flex">
                    {/* Breadcrumbs or Title could go here */}
                    <span className="font-semibold">Dashboard</span>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search placeholder */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Log in</Button>
                        <Button size="sm">Sign up</Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
