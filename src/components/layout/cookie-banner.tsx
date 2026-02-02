"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent")
        if (!consent) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted")
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined")
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 animate-in slide-in-from-bottom">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="font-semibold">Vaše soukromí je pro nás důležité</h3>
                    <p className="text-sm text-muted-foreground">
                        Používáme cookies k analýze návštěvnosti a vylepšení vašich zážitků.
                        Vaše data (výdaje) jsou šifrována a nikdo jiný k nim nemá přístup.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDecline}>Odmítnout</Button>
                    <Button onClick={handleAccept}>Přijmout vše</Button>
                </div>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 md:hidden" onClick={handleDecline}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
